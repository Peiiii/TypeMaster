import { useGameStore } from '../stores/gameStore';
import { generateSentences } from '../services/geminiService';
import { Difficulty } from '../types';
import { AudioManager } from './AudioManager';

export class GameManager {
  private audioManager: AudioManager;
  private autoNextTimer: ReturnType<typeof setTimeout> | null = null;

  // We pass dependencies if needed, or instantiate them. 
  // Ideally managers in this pattern are singletons or instantiated by Presenter.
  // We'll accept audioManager to trigger sounds.
  constructor(audioManager: AudioManager) {
    this.audioManager = audioManager;
  }

  loadSentences = async (difficulty: Difficulty) => {
    // Only set loading true if we don't have sentences yet (first load)
    // to avoid flashing.
    const state = useGameStore.getState();
    if (state.sentences.length === 0) {
      useGameStore.setState({ isLoading: true });
    }

    try {
      const sentences = await generateSentences(difficulty);
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

  handleInput = (value: string) => {
    const state = useGameStore.getState();
    if (state.showSuccessAnim || state.isLoading) return;

    // Prevent double spaces
    if (value.includes('  ')) return;
    
    // Auto-advance logic: Add space if word is complete and correct
    let nextValue = value;
    const previousInput = state.userInput;
    const isTypingForward = value.length > previousInput.length;

    if (isTypingForward) {
      const currentSentence = state.sentences[state.currentSentenceIndex];
      if (currentSentence) {
        const targetWords = currentSentence.english.trim().split(/\s+/);
        const userWords = value.split(' '); // Use simple space split for user input

        // Only check if we are currently inside a word (not if we just typed a space)
        if (!value.endsWith(' ')) {
          const currentWordIndex = userWords.length - 1;
          
          if (currentWordIndex < targetWords.length) {
            const currentUserWord = userWords[currentWordIndex];
            const currentTargetWord = targetWords[currentWordIndex];
            
            // Check exact match (case insensitive)
            if (currentUserWord.toLowerCase() === currentTargetWord.toLowerCase()) {
              const isLastWord = currentWordIndex === targetWords.length - 1;
              
              // If matched and not the last word, auto-append space
              if (!isLastWord) {
                nextValue = value + ' ';
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
    const normalizedTarget = currentSentence.english.trim().toLowerCase();

    // 1. Exact Match
    if (normalizedInput === normalizedTarget) {
      this.handleSuccess();
      return;
    }

    // 2. Forgiving Match (ignore trailing punctuation)
    const lastChar = normalizedTarget.slice(-1);
    const isPunctuation = ['.', '!', '?'].includes(lastChar);
    
    if (isPunctuation) {
      const targetWithoutPunct = normalizedTarget.slice(0, -1);
      if (normalizedInput === targetWithoutPunct) {
        // Auto-complete punctuation
        useGameStore.setState({ userInput: currentSentence.english });
        this.handleSuccess();
      }
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

    this.audioManager.playSuccessSound();

    // Auto Advance Logic
    if (state.isAutoAdvance) {
      if (this.autoNextTimer) clearTimeout(this.autoNextTimer);
      
      this.autoNextTimer = setTimeout(() => {
        this.nextSentence();
      }, 300); // Super fast 300ms transition
    }
  };

  handleHint = () => {
    const state = useGameStore.getState();
    const currentSentence = state.sentences[state.currentSentenceIndex];

    if (!currentSentence || state.showSuccessAnim || state.isComplete) return;

    const target = currentSentence.english;
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
    // Clear any pending auto-advance timer to prevent double-skipping
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