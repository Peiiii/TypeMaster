import { useGameStore } from '../stores/gameStore';
import { generateSentences, generateStory } from '../services/geminiService';
import { Difficulty, GameMode, Topic } from '../types';
import { AudioManager } from './AudioManager';

export class GameManager {
  private audioManager = new AudioManager();
  private autoNextTimer: ReturnType<typeof setTimeout> | null = null;
  private sentenceStartTime: number | null = null;

  // Helper to remove punctuation for logic comparison
  private stripPunctuation = (text: string) => {
    return text.replace(/[.,!?;:]/g, '');
  };

  loadSentences = async (difficulty: Difficulty, topic?: Topic) => {
    const state = useGameStore.getState();
    const targetTopic = topic || state.currentTopic;
    const isStoryMode = state.gameMode === 'story';
    
    try {
      let sentences;
      if (isStoryMode) {
        sentences = await generateStory(difficulty);
      } else {
        sentences = await generateSentences(difficulty, targetTopic);
      }

      useGameStore.setState({
        sentences,
        currentSentenceIndex: 0,
        isLoading: false,
        isComplete: false,
        error: null,
        userInput: '',
        showSuccessAnim: false,
        wpm: 0
      });
      this.sentenceStartTime = null;
    } catch (err) {
      useGameStore.setState({ 
        isLoading: false, 
        error: "Failed to load content. Please refresh." 
      });
    }
  };

  changeDifficulty = (difficulty: Difficulty) => {
    useGameStore.setState({ currentDifficulty: difficulty });
    this.loadSentences(difficulty);
  };

  changeTopic = (topic: Topic) => {
    useGameStore.setState({ currentTopic: topic });
    const state = useGameStore.getState();
    this.loadSentences(state.currentDifficulty, topic);
  };

  changeGameMode = (mode: GameMode) => {
    const state = useGameStore.getState();
    if (state.gameMode === mode) return;

    useGameStore.setState({ 
      gameMode: mode,
      score: 0,
      streak: 0,
      wpm: 0
    });
    this.loadSentences(state.currentDifficulty);
  };

  handleInput = (value: string) => {
    const state = useGameStore.getState();
    if (state.showSuccessAnim || state.isLoading) return;

    // Prevent double spaces
    if (value.includes('  ')) return;
    
    // Start Timer on first character
    if (!this.sentenceStartTime && value.length > 0) {
      this.sentenceStartTime = Date.now();
    }

    // Play Type Sound if enabled and content changed (and length increased)
    if (state.isSoundEnabled && value.length > state.userInput.length) {
      this.audioManager.playTypeSound();
    }

    // Strip punctuation from input
    const cleanValue = this.stripPunctuation(value);

    // Auto-advance logic: Add space if word is complete and correct
    let nextValue = cleanValue;
    const isTypingForward = cleanValue.length > this.stripPunctuation(state.userInput).length;

    if (isTypingForward) {
      const currentSentence = state.sentences[state.currentSentenceIndex];
      if (currentSentence) {
        const targetWords = currentSentence.english.trim().split(/\s+/).map(w => this.stripPunctuation(w));
        const userWords = cleanValue.split(' '); 

        if (!cleanValue.endsWith(' ')) {
          const currentWordIndex = userWords.length - 1;
          
          if (currentWordIndex < targetWords.length) {
            const currentUserWord = userWords[currentWordIndex];
            const currentTargetWord = targetWords[currentWordIndex];
            
            // Check exact match (case insensitive)
            if (currentUserWord.toLowerCase() === currentTargetWord.toLowerCase()) {
              const isLastWord = currentWordIndex === targetWords.length - 1;
              if (!isLastWord) {
                nextValue = cleanValue + ' ';
              }
            } else {
               // Check for error to play sound
               // If user typed 'a' and target is 'b', play error
               if (!currentTargetWord.toLowerCase().startsWith(currentUserWord.toLowerCase())) {
                   if (state.isSoundEnabled) this.audioManager.playErrorSound();
               }
            }
          }
        }
      }
    }
    
    useGameStore.setState({ userInput: nextValue });
    this.checkCompletion(nextValue);
  };

  calculateWPM = (charCount: number) => {
    if (!this.sentenceStartTime) return 0;
    const timeSpentMs = Date.now() - this.sentenceStartTime;
    const timeSpentMin = timeSpentMs / 1000 / 60;
    if (timeSpentMin === 0) return 0;
    
    // Standard WPM = (All characters / 5) / Minutes
    const wpm = Math.round((charCount / 5) / timeSpentMin);
    // Cap at reasonable max to avoid glitches
    return Math.min(wpm, 200);
  };

  checkCompletion = (input: string) => {
    const state = useGameStore.getState();
    const currentSentence = state.sentences[state.currentSentenceIndex];
    if (!currentSentence) return;

    const normalizedInput = input.trim().toLowerCase();
    const normalizedTarget = this.stripPunctuation(currentSentence.english).trim().toLowerCase();

    if (normalizedInput === normalizedTarget) {
      // Calculate WPM for this sentence
      const currentWpm = this.calculateWPM(currentSentence.english.length);
      
      // Update Average WPM
      // If it's the first sentence, just use current. Otherwise average it roughly.
      // A true average would need total chars / total time, but a rolling average is fine for a game.
      const newAverageWpm = state.wpm === 0 ? currentWpm : Math.round((state.wpm + currentWpm) / 2);
      
      useGameStore.setState({ wpm: newAverageWpm });
      this.handleSuccess();
      return;
    }
  };

  handleSuccess = () => {
    const state = useGameStore.getState();
    if (state.showSuccessAnim) return;

    useGameStore.setState({
      showSuccessAnim: true,
      score: state.score + 10 + (state.streak * 2),
      streak: state.streak + 1
    });

    if (state.isSoundEnabled) {
      this.audioManager.playSuccessSound();
      // Speak immediately
      this.audioManager.speak(state.sentences[state.currentSentenceIndex].english);
    }

    if (state.isAutoAdvance) {
      if (this.autoNextTimer) clearTimeout(this.autoNextTimer);
      // Fast transition: 200ms to allow visual confirmation (green text), then next.
      this.autoNextTimer = setTimeout(() => {
        this.nextSentence();
      }, 200);
    }
  };

  handleHint = () => {
    const state = useGameStore.getState();
    const currentSentence = state.sentences[state.currentSentenceIndex];

    if (!currentSentence || state.showSuccessAnim || state.isComplete) return;

    const target = this.stripPunctuation(currentSentence.english);
    const current = state.userInput;

    let matchLen = 0;
    while (
      matchLen < current.length && 
      matchLen < target.length && 
      current[matchLen].toLowerCase() === target[matchLen].toLowerCase()
    ) {
      matchLen++;
    }

    const nextContent = target.slice(0, matchLen + 1);
    
    if (nextContent !== current) {
       useGameStore.setState({ 
         userInput: nextContent,
         score: Math.max(0, state.score - 2)
       });
       this.checkCompletion(nextContent);
    }
  };

  nextSentence = () => {
    if (this.autoNextTimer) {
      clearTimeout(this.autoNextTimer);
      this.autoNextTimer = null;
    }

    const state = useGameStore.getState();
    const nextIndex = state.currentSentenceIndex + 1;
    
    this.sentenceStartTime = null; // Reset timer for next sentence

    if (nextIndex >= state.sentences.length) {
      useGameStore.setState({ 
        isComplete: true,
        showSuccessAnim: false,
        userInput: ''
      });
    } else {
      useGameStore.setState({
        currentSentenceIndex: nextIndex,
        userInput: '',
        showSuccessAnim: false
      });
    }
  };

  restartGame = () => {
    if (this.autoNextTimer) {
      clearTimeout(this.autoNextTimer);
      this.autoNextTimer = null;
    }
    const state = useGameStore.getState();
    useGameStore.setState({
      score: 0,
      streak: 0,
      wpm: 0,
      isComplete: false
    });
    this.sentenceStartTime = null;
    this.loadSentences(state.currentDifficulty);
  };
}