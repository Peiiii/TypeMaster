
import { useGameStore } from '../stores/gameStore';
import { generateSentences, generateStory } from '../services/geminiService';
import { Difficulty, GameMode, Topic, Sentence } from '../types';
import { AudioManager } from './AudioManager';

const STORAGE_KEYS = {
  COMPLETED_PRACTICE: 'typemaster_completed_practice',
  STORY_PROGRESS: 'typemaster_story_progress', // { difficulty: { storyIndex: number, sentenceIndex: number } }
};

export class GameManager {
  private audioManager = new AudioManager();
  private autoNextTimer: ReturnType<typeof setTimeout> | null = null;
  private sentenceStartTime: number | null = null;

  private stripPunctuation = (text: string) => {
    return text.replace(/[.,!?;:]/g, '');
  };

  private getCompletedSentences = (): Set<string> => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMPLETED_PRACTICE);
    return new Set(saved ? JSON.parse(saved) : []);
  };

  private saveCompletedSentence = (english: string) => {
    const completed = this.getCompletedSentences();
    completed.add(english);
    localStorage.setItem(STORAGE_KEYS.COMPLETED_PRACTICE, JSON.stringify(Array.from(completed)));
    useGameStore.setState({ completedCount: completed.size });
  };

  private getStoryProgress = (difficulty: Difficulty) => {
    const saved = localStorage.getItem(STORAGE_KEYS.STORY_PROGRESS);
    const progress = saved ? JSON.parse(saved) : {};
    return progress[difficulty] || { storyIndex: 0, sentenceIndex: 0 };
  };

  private saveStoryProgress = (difficulty: Difficulty, storyIndex: number, sentenceIndex: number) => {
    const saved = localStorage.getItem(STORAGE_KEYS.STORY_PROGRESS);
    const progress = saved ? JSON.parse(saved) : {};
    progress[difficulty] = { storyIndex, sentenceIndex };
    localStorage.setItem(STORAGE_KEYS.STORY_PROGRESS, JSON.stringify(progress));
  };

  loadSentences = async (difficulty: Difficulty, topic?: Topic) => {
    const state = useGameStore.getState();
    const targetTopic = topic || state.currentTopic;
    const isStoryMode = state.gameMode === 'story';
    
    useGameStore.setState({ isLoading: true });

    try {
      let sentences: Sentence[] = [];
      let initialIndex = 0;

      if (isStoryMode) {
        const progress = this.getStoryProgress(difficulty);
        const storyPool = await generateStory(difficulty);
        // StoryPool for one difficulty is an array of stories (Sentence[][])
        // Since geminiService returns a single random story, we need to adapt it 
        // OR make geminiService return all stories so we can pick. 
        // For now, geminiService returns one, so we just check if it matches our progress or reset.
        sentences = storyPool; 
        initialIndex = progress.sentenceIndex < sentences.length ? progress.sentenceIndex : 0;
      } else {
        const completed = this.getCompletedSentences();
        sentences = await generateSentences(difficulty, targetTopic);
        
        // Prioritize uncompleted sentences
        const uncompleted = sentences.filter(s => !completed.has(s.english));
        if (uncompleted.length >= 5) {
          sentences = uncompleted.slice(0, 10);
        } else {
          // If we've seen almost everything, just give them the random set (shuffle ensures variety)
          sentences = sentences.slice(0, 10);
        }
      }

      useGameStore.setState({
        sentences,
        currentSentenceIndex: initialIndex,
        isLoading: false,
        isComplete: false,
        error: null,
        userInput: '',
        showSuccessAnim: false,
        wpm: 0,
        completedCount: this.getCompletedSentences().size
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
    if (value.includes('  ')) return;
    
    if (!this.sentenceStartTime && value.length > 0) {
      this.sentenceStartTime = Date.now();
    }

    if (state.isSoundEnabled && value.length > state.userInput.length) {
      this.audioManager.playTypeSound();
    }

    const cleanValue = this.stripPunctuation(value);
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
            
            if (currentUserWord.toLowerCase() === currentTargetWord.toLowerCase()) {
              const isLastWord = currentWordIndex === targetWords.length - 1;
              if (!isLastWord) {
                nextValue = cleanValue + ' ';
              }
            } else {
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
    return Math.min(Math.round((charCount / 5) / timeSpentMin), 200);
  };

  checkCompletion = (input: string) => {
    const state = useGameStore.getState();
    const currentSentence = state.sentences[state.currentSentenceIndex];
    if (!currentSentence) return;

    const normalizedInput = input.trim().toLowerCase();
    const normalizedTarget = this.stripPunctuation(currentSentence.english).trim().toLowerCase();

    if (normalizedInput === normalizedTarget) {
      const currentWpm = this.calculateWPM(currentSentence.english.length);
      const newAverageWpm = state.wpm === 0 ? currentWpm : Math.round((state.wpm + currentWpm) / 2);
      
      useGameStore.setState({ wpm: newAverageWpm });
      this.handleSuccess();
      return;
    }
  };

  handleSuccess = () => {
    const state = useGameStore.getState();
    if (state.showSuccessAnim) return;

    // Persist completion
    if (state.gameMode === 'practice') {
      this.saveCompletedSentence(state.sentences[state.currentSentenceIndex].english);
    } else {
      // In story mode, we save the "next" index
      this.saveStoryProgress(state.currentDifficulty, 0, state.currentSentenceIndex + 1);
    }

    useGameStore.setState({
      showSuccessAnim: true,
      score: state.score + 10 + (state.streak * 2),
      streak: state.streak + 1
    });

    if (state.isSoundEnabled) {
      this.audioManager.playSuccessSound();
      this.audioManager.speak(state.sentences[state.currentSentenceIndex].english);
    }

    if (state.isAutoAdvance) {
      if (this.autoNextTimer) clearTimeout(this.autoNextTimer);
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
    this.sentenceStartTime = null;

    if (nextIndex >= state.sentences.length) {
      // If story mode reached end, reset progress for this difficulty
      if (state.gameMode === 'story') {
        this.saveStoryProgress(state.currentDifficulty, 0, 0);
      }
      
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
    
    // For story mode restart actually means start from begining
    if (state.gameMode === 'story') {
       this.saveStoryProgress(state.currentDifficulty, 0, 0);
    }

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
