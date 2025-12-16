import React from 'react';
import { Brain, Play, Pause, Volume2, VolumeX, BookOpen, LayoutGrid, Eye, EyeOff, Activity } from 'lucide-react';
import DifficultySelector from './DifficultySelector';
import TopicSelector from './TopicSelector';
import { Difficulty, Topic, GameMode } from '../../types';

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
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm transition-all duration-200">
      <div className="max-w-6xl mx-auto px-4 py-2 md:py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
          
          {/* Top Row / Logo & Mode (Mobile Optimized) */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
             <div className="flex items-center gap-2 md:gap-3">
              <div className={`bg-indigo-600 p-2 rounded-lg text-white shadow-indigo-200 shadow-lg transition-transform ${gameMode === 'story' ? 'rotate-[-5deg]' : ''}`}>
                {gameMode === 'story' ? <BookOpen size={20} /> : <Brain size={20} />}
              </div>
              <h1 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight hidden sm:block">TypeMaster</h1>
            </div>
            
            {/* Stats Compact (Mobile) */}
             <div className="md:hidden flex items-center gap-3">
                 <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                    <Activity size={12} className="text-orange-500" />
                    <span className="text-xs font-bold text-slate-700">{wpm} WPM</span>
                 </div>
                 <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                    {score} pts
                 </div>
             </div>

            {/* Mode Switcher */}
            <div className="flex bg-slate-100 p-1 rounded-lg ml-auto md:ml-0">
               <button
                 onClick={() => onModeChange('practice')}
                 className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs md:text-sm font-medium transition-all ${gameMode === 'practice' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 <LayoutGrid size={14} />
                 <span>Topic</span>
               </button>
               <button
                 onClick={() => onModeChange('story')}
                 className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs md:text-sm font-medium transition-all ${gameMode === 'story' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 <BookOpen size={14} />
                 <span>Story</span>
               </button>
            </div>
          </div>
          
          {/* Middle Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <DifficultySelector 
              currentDifficulty={currentDifficulty} 
              onSelect={onDifficultyChange} 
              disabled={false}
            />
            
            {/* Only show topic selector in Practice Mode */}
            {gameMode === 'practice' && onTopicChange && (
              <>
                <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
                <div className="w-full sm:w-auto overflow-x-auto">
                  <TopicSelector 
                    currentTopic={currentTopic}
                    onSelect={onTopicChange}
                    disabled={false}
                  />
                </div>
              </>
            )}
          </div>

          {/* Right Stats & Toggles */}
          <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
             
             {/* Toggle Group */}
             <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-full border border-slate-200">
               {/* Hint Toggle */}
               <button
                onClick={onToggleHint}
                className={`p-1.5 rounded-full transition-all ${showHint ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                title={showHint ? "Hide English (Translation Mode)" : "Show English (Typing Mode)"}
               >
                {showHint ? <Eye size={14} /> : <EyeOff size={14} />}
               </button>

               {/* Sound Toggle */}
               <button
                onClick={onToggleSound}
                className={`p-1.5 rounded-full transition-all ${isSoundEnabled ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                title="Toggle Sound"
              >
                {isSoundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
              </button>

               {/* Auto Advance Toggle */}
               <button
                onClick={onToggleAutoAdvance}
                className={`p-1.5 rounded-full transition-all ${isAutoAdvance ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                title="Toggle Auto-Next"
              >
                {isAutoAdvance ? <Play size={14} className="fill-current" /> : <Pause size={14} />}
              </button>
             </div>

            {/* Desktop Stats */}
            <div className="hidden md:flex items-center gap-4 text-sm font-medium border-l border-slate-200 pl-4">
                <div className="flex flex-col items-end">
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider font-bold">Speed</span>
                  <span className="text-slate-700 text-lg leading-none font-bold tabular-nums">{wpm} <span className="text-xs text-slate-400 font-normal">wpm</span></span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider font-bold">Progress</span>
                  <span className="text-slate-700 text-lg leading-none font-bold">
                    {currentIndex + 1}
                    <span className="text-slate-400 text-sm font-medium">/{totalSentences}</span>
                  </span>
                </div>
            </div>
            
            {/* Mobile Progress Bar */}
             <div className="md:hidden flex-1 ml-2">
               <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                 <div 
                    className="h-full bg-indigo-500 transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / totalSentences) * 100}%` }}
                 />
               </div>
             </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default GameHeader;