import React from 'react';
import { Brain } from 'lucide-react';
import DifficultySelector from './DifficultySelector';
import { Difficulty } from '../../types';

interface GameHeaderProps {
  score: number;
  currentDifficulty: Difficulty;
  currentIndex: number;
  totalSentences: number;
  onDifficultyChange: (diff: Difficulty) => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ 
  score, 
  currentDifficulty, 
  currentIndex, 
  totalSentences, 
  onDifficultyChange 
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Brain size={24} />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">TypeMaster AI</h1>
        </div>
        
        <DifficultySelector 
          currentDifficulty={currentDifficulty} 
          onSelect={onDifficultyChange} 
          disabled={false}
        />

        <div className="flex items-center gap-6 text-sm font-medium">
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
