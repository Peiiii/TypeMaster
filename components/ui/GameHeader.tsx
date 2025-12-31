import React from 'react';
import { Brain, Play, Pause, Volume2, VolumeX, BookOpen, LayoutGrid, Eye, EyeOff, Activity, CheckCircle2, Star } from 'lucide-react';
import DifficultySelector from './DifficultySelector';
import TopicSelector from './TopicSelector';
import { Difficulty, Topic, GameMode } from '../../types';
import { useGameStore } from '../../stores/gameStore';

interface GameHeaderProps {
  score: number;
  wpm: number;
  currentDifficulty: Difficulty;
  currentTopic?: Topic;
  gameMode: GameMode;
  currentIndex: number;
  totalSentences: number;
  isAutoAdvance: boolean;
  isSoundEnabled: boolean;
  showHint: boolean;
  onDifficultyChange: (diff: Difficulty) => void;
  onTopicChange?: (topic: Topic) => void;
  onModeChange: (mode: GameMode) => void;
  onToggleAutoAdvance: () => void;
  onToggleSound: () => void;
  onToggleHint: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ 
  score, 
  wpm,
  currentDifficulty, 
  currentTopic = 'all',
  gameMode,
  currentIndex, 
  totalSentences, 
  isAutoAdvance,
  isSoundEnabled,
  showHint,
  onDifficultyChange,
  onTopicChange,
  onModeChange,
  onToggleAutoAdvance,
  onToggleSound,
  onToggleHint
}) => {
  const completedCount = useGameStore(state => state.completedCount);

  return (
    <header className="relative z-50 p-4">
      <div className="max-w-7xl mx-auto bg-white border-[3px] border-black sticker-shadow rounded-2xl p-4 md:px-6 md:py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo Section */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="bg-acid-pink p-2.5 rounded-xl border-[3px] border-black sticker-shadow -rotate-3 hover:rotate-0 transition-transform cursor-pointer">
              <Star className="text-white fill-white animate-spin-slow" size={24} />
            </div>
            <div>
              <h1 className="font-bubble text-2xl text-black tracking-tight leading-none">TYPEMASTER</h1>
              <div className="flex items-center gap-2 mt-1">
                 <span className="bg-acid-yellow text-black border-[2px] border-black px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-widest">
                   {gameMode} MODE
                 </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 w-full md:w-auto">
            <div className="flex bg-slate-100 p-1 rounded-xl border-[2px] border-black">
               <button
                 onClick={() => onModeChange('practice')}
                 className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${gameMode === 'practice' ? 'bg-acid-blue text-white border-[2px] border-black sticker-shadow scale-105' : 'text-slate-500'}`}
               >
                 <LayoutGrid size={14} strokeWidth={3} />
                 <span>PRACTICE</span>
               </button>
               <button
                 onClick={() => onModeChange('story')}
                 className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${gameMode === 'story' ? 'bg-acid-pink text-white border-[2px] border-black sticker-shadow scale-105' : 'text-slate-500'}`}
               >
                 <BookOpen size={14} strokeWidth={3} />
                 <span>STORY</span>
               </button>
            </div>

            <DifficultySelector 
              currentDifficulty={currentDifficulty} 
              onSelect={onDifficultyChange} 
              disabled={false}
            />
          </div>

          {/* Stats Sticker Box */}
          <div className="flex items-center gap-4 bg-acid-yellow border-[3px] border-black p-3 rounded-xl sticker-shadow rotate-1">
             <div className="flex flex-col items-center border-r-[2px] border-black pr-4">
                <span className="text-[10px] font-black uppercase text-black/50 tracking-tighter">SPEED</span>
                <span className="font-bubble text-2xl text-black">{wpm}</span>
             </div>
             <div className="flex flex-col items-center">
                <span className="text-[10px] font-black uppercase text-black/50 tracking-tighter">SCORE</span>
                <span className="font-bubble text-2xl text-black">{score}</span>
             </div>
             
             {/* Icon Toggles */}
             <div className="flex flex-col gap-1 pl-2 ml-2 border-l-[2px] border-black">
                <button onClick={onToggleSound} className="hover:text-acid-pink transition-colors">
                  {isSoundEnabled ? <Volume2 size={16} strokeWidth={3} /> : <VolumeX size={16} strokeWidth={3} />}
                </button>
                <button onClick={onToggleHint} className="hover:text-acid-pink transition-colors">
                  {showHint ? <Eye size={16} strokeWidth={3} /> : <EyeOff size={16} strokeWidth={3} />}
                </button>
             </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default GameHeader;