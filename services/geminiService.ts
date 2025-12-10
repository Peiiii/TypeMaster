import { Sentence, Difficulty, Topic } from '../types';
import { easySentences } from '../data/easy';
import { mediumSentences } from '../data/medium';
import { hardSentences } from '../data/hard';

const SENTENCE_DATA: Record<Difficulty, Sentence[]> = {
  [Difficulty.EASY]: easySentences,
  [Difficulty.MEDIUM]: mediumSentences,
  [Difficulty.HARD]: hardSentences,
};

export const generateSentences = async (difficulty: Difficulty, topic: Topic = 'all'): Promise<Sentence[]> => {
  // 1. Get pool based on difficulty
  const pool = SENTENCE_DATA[difficulty] || SENTENCE_DATA[Difficulty.EASY];
  
  // 2. Filter by topic
  const filteredPool = topic === 'all' 
    ? pool 
    : pool.filter(s => s.topic === topic);

  // If filtered pool is empty (e.g., no 'tech' sentences in 'easy'), fallback to all
  const finalPool = filteredPool.length > 0 ? filteredPool : pool;

  // 3. Shuffle algorithm to get random sentences each time
  const shuffled = [...finalPool].sort(() => 0.5 - Math.random());
  
  // 4. Return top 5 (or more if you want longer sessions, let's do 10 to utilize the larger dataset)
  return shuffled.slice(0, 10);
};