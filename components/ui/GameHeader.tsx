import React from 'react';
import { Brain, Play, Pause } from 'lucide-react';
import DifficultySelector from './DifficultySelector';
import { Difficulty } from '../../types';

interface GameHeaderProps {
  score: number;
  currentDifficulty: Difficulty;
  currentIndex: number;
  totalSentences: number;
  isAutoAdvance: boolean;
  onDifficultyChange: (diff: Difficulty) => void;
  onToggleAutoAdvance: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ 
  score, 
  currentDifficulty, 
  currentIndex, 
  totalSentences, 
  isAutoAdvance,
  onDifficultyChange,
  onToggleAutoAdvance
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Brain size={24} />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">TypeMaster AI</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <DifficultySelector 
            currentDifficulty={currentDifficulty} 
            onSelect={onDifficultyChange} 
            disabled={false}
          />
          
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
            <span className="hidden sm:inline">Auto Next</span>
          </button>
        </div>

        <div className="flex items-center gap-6 text-sm font-medium w-full md:w-auto justify-end">
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
      </div>
    </header>
  );
};

export default GameHeader;