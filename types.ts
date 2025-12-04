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
  currentSentenceIndex: number;
  sentences: Sentence[];
  score: number;
  streak: number;
  isLoading: boolean;
  isComplete: boolean;
  error: string | null;
}
