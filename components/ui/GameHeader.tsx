import React from 'react';
import { Brain, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import DifficultySelector from './DifficultySelector';
import TopicSelector from './TopicSelector';
import { Difficulty, Topic } from '../../types';

interface GameHeaderProps {
  score: number;
  currentDifficulty: Difficulty;
  currentTopic?: Topic;
  currentIndex: number;
  totalSentences: number;
  isAutoAdvance: boolean;
  isSoundEnabled: boolean;
  onDifficultyChange: (diff: Difficulty) => void;
  onTopicChange?: (topic: Topic) => void;
  onToggleAutoAdvance: () => void;
  onToggleSound: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ 
  score, 
  currentDifficulty, 
  currentTopic = 'all',
  currentIndex, 
  totalSentences, 
  isAutoAdvance,
  isSoundEnabled,
  onDifficultyChange,
  onTopicChange,
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
              <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-indigo-200 shadow-lg">
                <Brain size={24} />
              </div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight hidden sm:block">TypeMaster AI</h1>
            </div>
            
            {/* Mobile Score Compact */}
            <div className="flex md:hidden items-center gap-3 text-sm font-medium">
                <div className="bg-indigo-50 px-3 py-1 rounded-full text-indigo-700">
                  {score} pts
                </div>
            </div>
          </div>
          
          {/* Middle Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <DifficultySelector 
              currentDifficulty={currentDifficulty} 
              onSelect={onDifficultyChange} 
              disabled={false}
            />
            
            <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
            
            {onTopicChange && (
              <TopicSelector 
                currentTopic={currentTopic}
                onSelect={onTopicChange}
                disabled={false}
              />
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
             <div className="md:hidden text-slate-500 text-sm font-medium">
               {currentIndex + 1} / {totalSentences}
             </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default GameHeader;