import { useGameStore } from '../stores/gameStore';
import { generateSentences } from '../services/geminiService';
import { Difficulty, Topic } from '../types';
import { AudioManager } from './AudioManager';

export class GameManager {
  private audioManager: AudioManager;
  private autoNextTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(audioManager: AudioManager) {
    this.audioManager = audioManager;
  }

  // Helper to remove punctuation for logic comparison
  private stripPunctuation = (text: string) => {
    return text.replace(/[.,!?;:]/g, '');
  };

  loadSentences = async (difficulty: Difficulty, topic?: Topic) => {
    const state = useGameStore.getState();
    const targetTopic = topic || state.currentTopic;
    
    // Only set loading if empty to prevent flash on difficulty switch
    if (state.sentences.length === 0) {
      useGameStore.setState({ isLoading: true });
    }

    try {
      const sentences = await generateSentences(difficulty, targetTopic);
      useGameStore.setState({
        sentences,
        currentSentenceIndex: 0,
        isLoading: false,
        isComplete: false,
        error: null,
        userInput: '',
        showSuccessAnim: false
      });
    } catch (err) {
      useGameStore.setState({ 
        isLoading: false, 
        error: "Failed to load sentences. Please refresh." 
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

  handleInput = (value: string) => {
    const state = useGameStore.getState();
    if (state.showSuccessAnim || state.isLoading) return;

    // Prevent double spaces
    if (value.includes('  ')) return;
    
    // Strip punctuation from input (User doesn't need to type it)
    const cleanValue = this.stripPunctuation(value);

    // Auto-advance logic: Add space if word is complete and correct
    let nextValue = cleanValue;
    const previousInput = state.userInput;
    const isTypingForward = cleanValue.length > previousInput.length;

    if (isTypingForward) {
      const currentSentence = state.sentences[state.currentSentenceIndex];
      if (currentSentence) {
        // Strip punctuation from target words for comparison
        const targetWords = currentSentence.english.trim().split(/\s+/).map(w => this.stripPunctuation(w));
        const userWords = cleanValue.split(' '); 

        // Only check if we are currently inside a word (not if we just typed a space)
        if (!cleanValue.endsWith(' ')) {
          const currentWordIndex = userWords.length - 1;
          
          if (currentWordIndex < targetWords.length) {
            const currentUserWord = userWords[currentWordIndex];
            const currentTargetWord = targetWords[currentWordIndex];
            
            // Check exact match (case insensitive)
            if (currentUserWord.toLowerCase() === currentTargetWord.toLowerCase()) {
              const isLastWord = currentWordIndex === targetWords.length - 1;
              
              // If matched and not the last word, auto-append space
              if (!isLastWord) {
                nextValue = cleanValue + ' ';
              }
            }
          }
        }
      }
    }
    
    useGameStore.setState({ userInput: nextValue });
    this.checkCompletion(nextValue);
  };

  checkCompletion = (input: string) => {
    const state = useGameStore.getState();
    const currentSentence = state.sentences[state.currentSentenceIndex];
    if (!currentSentence) return;

    const normalizedInput = input.trim().toLowerCase();
    // Compare against stripped target sentence
    const normalizedTarget = this.stripPunctuation(currentSentence.english).trim().toLowerCase();

    // Exact Match (ignoring punctuation)
    if (normalizedInput === normalizedTarget) {
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
    }

    // Auto Advance Logic
    if (state.isAutoAdvance) {
      if (this.autoNextTimer) clearTimeout(this.autoNextTimer);
      
      // REDUCED DELAY: 500ms -> 200ms for snappier transition
      this.autoNextTimer = setTimeout(() => {
        this.nextSentence();
      }, 200); 
    }
  };

  handleHint = () => {
    const state = useGameStore.getState();
    const currentSentence = state.sentences[state.currentSentenceIndex];

    if (!currentSentence || state.showSuccessAnim || state.isComplete) return;

    // Hint uses stripped target
    const target = this.stripPunctuation(currentSentence.english);
    const current = state.userInput;

    // Progressive Hint Logic
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
         score: Math.max(0, state.score - 2) // Penalty
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
      isComplete: false
    });
    this.loadSentences(state.currentDifficulty);
  };
}