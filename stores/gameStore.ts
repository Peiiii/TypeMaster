import { create } from 'zustand';
import { Difficulty, GameState, Topic, GameMode } from '../types';

interface GameStore extends GameState {
  // New Stats
  wpm: number;
  showHint: boolean; // Toggle for "Copying Mode" vs "Translation Mode"
  
  // Actions
  setGameMode: (mode: GameMode) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setTopic: (topic: Topic) => void;
  setSentences: (sentences: GameState['sentences']) => void;
  setUserInput: (input: string) => void;
  setScore: (score: number) => void;
  setStreak: (streak: number) => void;
  setWpm: (wpm: number) => void;
  setIsLoading: (isLoading: boolean) => void;
  setCompletionStatus: (isComplete: boolean) => void;
  setShowSuccessAnim: (show: boolean) => void;
  setError: (error: string | null) => void;
  toggleAutoAdvance: () => void;
  toggleSound: () => void;
  toggleHint: () => void;
  nextSentenceIndex: () => void;
  resetGame: (difficulty: Difficulty) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  // Initial State
  gameMode: 'story',
  currentDifficulty: Difficulty.EASY,
  currentTopic: 'all',
  sentences: [],
  currentSentenceIndex: 0,
  userInput: '',
  score: 0,
  streak: 0,
  wpm: 0,
  isLoading: true,
  isComplete: false,
  showSuccessAnim: false,
  isAutoAdvance: true,
  isSoundEnabled: true, // Default to ON for better game feel
  showHint: false, // Default to Translation mode (Harder)
  error: null,

  // Actions
  setGameMode: (mode) => set({ gameMode: mode }),
  setDifficulty: (difficulty) => set({ currentDifficulty: difficulty }),
  setTopic: (topic) => set({ currentTopic: topic }),
  setSentences: (sentences) => set({ sentences }),
  setUserInput: (userInput) => set({ userInput }),
  setScore: (score) => set({ score }),
  setStreak: (streak) => set({ streak }),
  setWpm: (wpm) => set({ wpm }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setCompletionStatus: (isComplete) => set({ isComplete }),
  setShowSuccessAnim: (showSuccessAnim) => set({ showSuccessAnim }),
  setError: (error) => set({ error }),
  toggleAutoAdvance: () => set((state) => ({ isAutoAdvance: !state.isAutoAdvance })),
  toggleSound: () => set((state) => ({ isSoundEnabled: !state.isSoundEnabled })),
  toggleHint: () => set((state) => ({ showHint: !state.showHint })),
  nextSentenceIndex: () => set((state) => ({ 
    currentSentenceIndex: state.currentSentenceIndex + 1,
    userInput: '',
    showSuccessAnim: false
  })),
  resetGame: (difficulty) => set((state) => ({
    currentDifficulty: difficulty,
    currentSentenceIndex: 0,
    score: 0,
    streak: 0,
    wpm: 0,
    isComplete: false,
    showSuccessAnim: false,
    userInput: '',
    error: null
  }))
}));