import React from 'react';
import { Brain, Play, Pause, Volume2, VolumeX, BookOpen, LayoutGrid } from 'lucide-react';
import DifficultySelector from './DifficultySelector';
import TopicSelector from './TopicSelector';
import { Difficulty, Topic, GameMode } from '../../types';

interface GameHeaderProps {
  score: number;
  currentDifficulty: Difficulty;
  currentTopic?: Topic;
  gameMode: GameMode;
  currentIndex: number;
  totalSentences: number;
  isAutoAdvance: boolean;
  isSoundEnabled: boolean;
  onDifficultyChange: (diff: Difficulty) => void;
  onTopicChange?: (topic: Topic) => void;
  onModeChange: (mode: GameMode) => void;
  onToggleAutoAdvance: () => void;
  onToggleSound: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ 
  score, 
  currentDifficulty, 
  currentTopic = 'all',
  gameMode,
  currentIndex, 
  totalSentences, 
  isAutoAdvance,
  isSoundEnabled,
  onDifficultyChange,
  onTopicChange,
  onModeChange,
  onToggleAutoAdvance,
  onToggleSound
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Top Row / Logo & Score (Mobile) */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
             <div className="flex items-center gap-3">
              <div className={`bg-indigo-600 p-2 rounded-lg text-white shadow-indigo-200 shadow-lg transition-transform ${gameMode === 'story' ? 'rotate-[-5deg]' : ''}`}>
                {gameMode === 'story' ? <BookOpen size={24} /> : <Brain size={24} />}
              </div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight hidden sm:block">TypeMaster AI</h1>
            </div>
            
            {/* Mode Switcher */}
            <div className="flex bg-slate-100 p-1 rounded-lg">
               <button
                 onClick={() => onModeChange('practice')}
                 className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-sm font-medium transition-all ${gameMode === 'practice' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 <LayoutGrid size={14} />
                 <span>Topic</span>
               </button>
               <button
                 onClick={() => onModeChange('story')}
                 className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-sm font-medium transition-all ${gameMode === 'story' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
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
                <TopicSelector 
                  currentTopic={currentTopic}
                  onSelect={onTopicChange}
                  disabled={false}
                />
              </>
            )}
          </div>

          {/* Right Stats & Toggles */}
          <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
             
             {/* Sound Toggle */}
             <button
              onClick={onToggleSound}
              className={`
                flex items-center justify-center p-1.5 rounded-full transition-all
                ${isSoundEnabled 
                  ? 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100' 
                  : 'text-slate-400 bg-slate-100 hover:bg-slate-200'}
              `}
              title={isSoundEnabled ? "Mute Sound" : "Enable Sound"}
            >
              {isSoundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

             {/* Auto Advance Toggle */}
             <button
              onClick={onToggleAutoAdvance}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border transition-all
                ${isAutoAdvance 
                  ? 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100' 
                  : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'}
              `}
              title={isAutoAdvance ? "Auto-next is ON" : "Auto-next is OFF"}
            >
              {isAutoAdvance ? <Play size={12} className="fill-current" /> : <Pause size={12} />}
              <span className="inline">Auto Next</span>
            </button>

            <div className="hidden md:flex items-center gap-6 text-sm font-medium border-l border-slate-200 pl-4">
                <div className="flex flex-col items-end">
                  <span className="text-slate-400 text-xs uppercase">Score</span>
                  <span className="text-indigo-600 text-lg leading-none">{score}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-slate-400 text-xs uppercase">Progress</span>
                  <span className="text-slate-700 text-lg leading-none">
                    {currentIndex + 1}
                    <span className="text-slate-400 text-base">/{totalSentences}</span>
                  </span>
                </div>
            </div>
            
            {/* Mobile Progress Compact */}
             <div className="md:hidden flex items-center gap-2 text-slate-500 text-sm font-medium">
               <span className="bg-indigo-50 text-indigo-700 px-2 rounded-full text-xs">{score} pts</span>
               <span>{currentIndex + 1} / {totalSentences}</span>
             </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default GameHeader;