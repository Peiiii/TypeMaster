import { create } from 'zustand';
import { Difficulty, GameState } from '../types';

interface GameStore extends GameState {
  // Actions
  setDifficulty: (difficulty: Difficulty) => void;
  setSentences: (sentences: GameState['sentences']) => void;
  setUserInput: (input: string) => void;
  setScore: (score: number) => void;
  setStreak: (streak: number) => void;
  setIsLoading: (isLoading: boolean) => void;
  setCompletionStatus: (isComplete: boolean) => void;
  setShowSuccessAnim: (show: boolean) => void;
  setError: (error: string | null) => void;
  nextSentenceIndex: () => void;
  resetGame: (difficulty: Difficulty) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  // Initial State
  currentDifficulty: Difficulty.EASY,
  sentences: [],
  currentSentenceIndex: 0,
  userInput: '',
  score: 0,
  streak: 0,
  isLoading: true,
  isComplete: false,
  showSuccessAnim: false,
  error: null,

  // Actions
  setDifficulty: (difficulty) => set({ currentDifficulty: difficulty }),
  setSentences: (sentences) => set({ sentences }),
  setUserInput: (userInput) => set({ userInput }),
  setScore: (score) => set({ score }),
  setStreak: (streak) => set({ streak }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setCompletionStatus: (isComplete) => set({ isComplete }),
  setShowSuccessAnim: (showSuccessAnim) => set({ showSuccessAnim }),
  setError: (error) => set({ error }),
  nextSentenceIndex: () => set((state) => ({ 
    currentSentenceIndex: state.currentSentenceIndex + 1,
    userInput: '',
    showSuccessAnim: false
  })),
  resetGame: (difficulty) => set({
    currentDifficulty: difficulty,
    currentSentenceIndex: 0,
    score: 0,
    streak: 0,
    isComplete: false,
    showSuccessAnim: false,
    userInput: '',
    error: null
  })
}));
