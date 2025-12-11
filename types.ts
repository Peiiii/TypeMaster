export type Topic = 'all' | 'daily' | 'travel' | 'business' | 'tech' | 'social';
export type GameMode = 'practice' | 'story';

export interface Sentence {
  english: string;
  chinese: string;
  topic: Exclude<Topic, 'all'> | 'story';
}

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export interface GameState {
  gameMode: GameMode;
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