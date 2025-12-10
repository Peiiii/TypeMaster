export type Topic = 'all' | 'daily' | 'travel' | 'business' | 'tech' | 'social';

export interface Sentence {
  english: string;
  chinese: string;
  topic: Exclude<Topic, 'all'>;
}

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export interface GameState {
  currentDifficulty: Difficulty;
  currentTopic: Topic;
  sentences: Sentence[];
  currentSentenceIndex: number;
  userInput: string;
  score: number;
  streak: number;
  isLoading: boolean;
  isComplete: boolean;
  showSuccessAnim: boolean;
  isAutoAdvance: boolean;
  isSoundEnabled: boolean;
  error: string | null;
}