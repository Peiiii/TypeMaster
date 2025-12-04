import { Sentence, Difficulty } from '../types';
import { EASY_SENTENCES } from './easy';
import { MEDIUM_SENTENCES } from './medium';
import { HARD_SENTENCES } from './hard';

export const SENTENCE_DATA: Record<Difficulty, Sentence[]> = {
  [Difficulty.EASY]: EASY_SENTENCES,
  [Difficulty.MEDIUM]: MEDIUM_SENTENCES,
  [Difficulty.HARD]: HARD_SENTENCES,
};