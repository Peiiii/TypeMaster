import { Sentence, Difficulty, Topic } from '../types';
import { easySentences } from '../data/easy/index';
import { mediumSentences } from '../data/medium/index';
import { hardSentences } from '../data/hard/index';
import { storyData } from '../data/stories/index';

// NOTE: Runtime AI is temporarily disabled. Using built-in static content.

const SENTENCE_DATA: Record<Difficulty, Sentence[]> = {
  [Difficulty.EASY]: easySentences,
  [Difficulty.MEDIUM]: mediumSentences,
  [Difficulty.HARD]: hardSentences,
};

/**
 * Generates random practice sentences based on topic.
 * Uses static data for now to ensure reliability without API key.
 */
export const generateSentences = async (difficulty: Difficulty, topic: Topic = 'all'): Promise<Sentence[]> => {
  // Return immediately for instant transition
  return getStaticSentences(difficulty, topic);
};

/**
 * Generates a coherent story.
 * Picks a random story from the static library.
 */
export const generateStory = async (difficulty: Difficulty): Promise<Sentence[]> => {
  // Return immediately for instant transition
  return getStaticStory(difficulty);
};

const getStaticSentences = (difficulty: Difficulty, topic: Topic): Sentence[] => {
  const pool = SENTENCE_DATA[difficulty] || SENTENCE_DATA[Difficulty.EASY];
  const filteredPool = topic === 'all' ? pool : pool.filter(s => s.topic === topic);
  const finalPool = filteredPool.length > 0 ? filteredPool : pool;
  
  // Shuffle and pick 10
  const shuffled = [...finalPool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 10);
};

const getStaticStory = (difficulty: Difficulty): Sentence[] => {
  const stories = storyData[difficulty] || storyData[Difficulty.EASY];
  // Select a random story from the available stories for this difficulty
  const randomIndex = Math.floor(Math.random() * stories.length);
  return stories[randomIndex];
};