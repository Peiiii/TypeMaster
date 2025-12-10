import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Sentence, Difficulty, Topic } from '../types';
import { easySentences } from '../data/easy/index';
import { mediumSentences } from '../data/medium/index';
import { hardSentences } from '../data/hard/index';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SENTENCE_DATA: Record<Difficulty, Sentence[]> = {
  [Difficulty.EASY]: easySentences,
  [Difficulty.MEDIUM]: mediumSentences,
  [Difficulty.HARD]: hardSentences,
};

// Define the schema for structured JSON output
const sentenceSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      english: { type: Type.STRING, description: "The English sentence." },
      chinese: { type: Type.STRING, description: "The Chinese translation." },
      topic: { type: Type.STRING, description: "The specific topic category." },
    },
    required: ["english", "chinese", "topic"],
  },
};

/**
 * Generates sentences using Gemini 2.5 Flash.
 * Falls back to static data if API fails or key is missing.
 */
export const generateSentences = async (difficulty: Difficulty, topic: Topic = 'all'): Promise<Sentence[]> => {
  try {
    // Check if API Key exists (it should be injected by the environment)
    if (!process.env.API_KEY) {
      console.warn("No API Key found. Using static data.");
      return getStaticSentences(difficulty, topic);
    }

    const modelId = 'gemini-2.5-flash';
    
    // Construct a specific prompt based on user selection
    const topicInstruction = topic === 'all' 
      ? "a mix of topics including daily life, travel, business, tech, and social interactions" 
      : `the specific topic of '${topic}'`;

    const difficultyInstruction = getDifficultyInstruction(difficulty);

    const prompt = `
      Generate 10 distinct English sentences with their Chinese translations for a typing game.
      
      Target Audience: Students learning English.
      Difficulty Level: ${difficulty} (${difficultyInstruction}).
      Topic: ${topicInstruction}.

      Requirements:
      1. Sentences must be grammatically correct.
      2. Chinese translations must be natural.
      3. Do not include numbering or bullet points in the text content.
      4. The 'topic' field in the JSON should match one of: 'daily', 'travel', 'business', 'tech', 'social'.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: "You are an expert English language teacher creating curriculum for a typing app.",
        responseMimeType: "application/json",
        responseSchema: sentenceSchema,
        temperature: 0.7, // Slight creativity but focused
      },
    });

    const generatedText = response.text;
    if (!generatedText) {
        throw new Error("Empty response from AI");
    }

    const data = JSON.parse(generatedText) as Sentence[];
    
    // Validate that we got an array
    if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Invalid format received from AI");
    }

    return data;

  } catch (error) {
    console.error("Gemini API Error (Falling back to static data):", error);
    return getStaticSentences(difficulty, topic);
  }
};

/**
 * Helper to give the AI context on what "Hard" means vs "Easy"
 */
function getDifficultyInstruction(difficulty: Difficulty): string {
  switch (difficulty) {
    case Difficulty.EASY:
      return "Short sentences (3-6 words), simple vocabulary, present tense, basic subject-verb-object structure.";
    case Difficulty.MEDIUM:
      return "Moderate length (7-12 words), compound sentences, varied tenses, intermediate vocabulary.";
    case Difficulty.HARD:
      return "Complex sentences, advanced vocabulary, idioms, professional or academic tone, 12+ words.";
    default:
      return "Standard English sentences.";
  }
}

/**
 * Fallback function using existing static data
 */
const getStaticSentences = (difficulty: Difficulty, topic: Topic): Sentence[] => {
  // 1. Get pool based on difficulty
  const pool = SENTENCE_DATA[difficulty] || SENTENCE_DATA[Difficulty.EASY];
  
  // 2. Filter by topic
  const filteredPool = topic === 'all' 
    ? pool 
    : pool.filter(s => s.topic === topic);

  // If filtered pool is empty fallback to all
  const finalPool = filteredPool.length > 0 ? filteredPool : pool;

  // 3. Shuffle algorithm
  const shuffled = [...finalPool].sort(() => 0.5 - Math.random());
  
  // 4. Return top 10
  return shuffled.slice(0, 10);
};