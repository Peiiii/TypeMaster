import { Sentence, Difficulty } from '../types';
import { SENTENCE_DATA } from '../data/sentences';

export const generateSentences = async (difficulty: Difficulty): Promise<Sentence[]> => {
  // Data is now imported from a separate large dataset
  const pool = SENTENCE_DATA[difficulty] || SENTENCE_DATA[Difficulty.EASY];
  
  // Create a shallow copy to avoid mutating the original data
  const shuffled = [...pool];
  
  // Fisher-Yates Shuffle Algorithm for better randomness
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  // Return top 5 distinct sentences
  return shuffled.slice(0, 5);
};