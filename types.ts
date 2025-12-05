export interface Sentence {
  english: string;
  chinese: string;
}

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export interface GameState {
  currentDifficulty: Difficulty;
  sentences: Sentence[];
  currentSentenceIndex: number;
  userInput: string;
  score: number;
  streak: number;
  isLoading: boolean;
  isComplete: boolean;
  showSuccessAnim: boolean;
  error: string | null;
}
