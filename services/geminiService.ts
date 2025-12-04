import { Sentence, Difficulty } from '../types';

// Built-in data acting as our "JSON file"
const SENTENCE_DATA: Record<Difficulty, Sentence[]> = {
  [Difficulty.EASY]: [
    { english: "I am happy.", chinese: "我很开心。" },
    { english: "It is a cat.", chinese: "这是一只猫。" },
    { english: "The sky is blue.", chinese: "天空是蓝色的。" },
    { english: "I love you.", chinese: "我爱你。" },
    { english: "Good morning.", chinese: "早上好。" },
    { english: "See you later.", chinese: "待会见。" },
    { english: "Thank you.", chinese: "谢谢你。" },
    { english: "Yes, please.", chinese: "好的，请。" },
    { english: "No, thanks.", chinese: "不，谢谢。" },
    { english: "How are you?", chinese: "你好吗？" },
    { english: "He runs fast.", chinese: "他跑得很快。" },
    { english: "She likes tea.", chinese: "她喜欢喝茶。" }
  ],
  [Difficulty.MEDIUM]: [
    { english: "Where is the library?", chinese: "图书馆在哪里？" },
    { english: "I would like a coffee.", chinese: "我想要一杯咖啡。" },
    { english: "What time is it now?", chinese: "现在几点了？" },
    { english: "My friend lives in London.", chinese: "我的朋友住在伦敦。" },
    { english: "She likes to read books.", chinese: "她喜欢读书。" },
    { english: "He works at a hospital.", chinese: "他在一家医院工作。" },
    { english: "We went to the park.", chinese: "我们去了公园。" },
    { english: "This movie is very interesting.", chinese: "这部电影很有趣。" },
    { english: "Could you help me please?", chinese: "请问你能帮我吗？" },
    { english: "I have a lot of homework.", chinese: "我有很多作业。" }
  ],
  [Difficulty.HARD]: [
    { english: "Success consists of going from failure to failure without loss of enthusiasm.", chinese: "成功在于从一个失败走到另一个失败而不失去热情。" },
    { english: "The quick brown fox jumps over the lazy dog.", chinese: "敏捷的棕色狐狸跳过了懒惰的狗。" },
    { english: "I have been learning English for five years.", chinese: "我已经学了五年英语了。" },
    { english: "If I were you, I would accept the offer.", chinese: "如果我是你，我会接受这个提议。" },
    { english: "Despite the rain, we decided to go hiking.", chinese: "尽管下雨，我们还是决定去徒步旅行。" },
    { english: "Technology is changing the way we live and work.", chinese: "科技正在改变我们的生活和工作方式。" },
    { english: "Honesty is the best policy.", chinese: "诚实是上策。" },
    { english: "Actions speak louder than words.", chinese: "事实胜于雄辩。" }
  ]
};

export const generateSentences = async (difficulty: Difficulty): Promise<Sentence[]> => {
  // Data is local, no delay needed
  const pool = SENTENCE_DATA[difficulty] || SENTENCE_DATA[Difficulty.EASY];
  
  // Shuffle algorithm to get random sentences each time
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  
  // Return top 5
  return shuffled.slice(0, 5);
};