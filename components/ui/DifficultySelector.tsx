import React from 'react';
import { Difficulty } from '../../types';

interface DifficultySelectorProps {
  currentDifficulty: Difficulty;
  onSelect: (difficulty: Difficulty) => void;
  disabled: boolean;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ currentDifficulty, onSelect, disabled }) => {
  const levels = [
    { id: Difficulty.EASY, label: 'Easy', color: 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200' },
    { id: Difficulty.MEDIUM, label: 'Medium', color: 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200' },
    { id: Difficulty.HARD, label: 'Hard', color: 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200' },
  ];

  return (
    <div className="flex gap-2 justify-center">
      {levels.map((level) => (
        <button
          key={level.id}
          onClick={() => onSelect(level.id)}
          disabled={disabled}
          className={`
            px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200
            ${currentDifficulty === level.id 
              ? `ring-2 ring-offset-2 ring-indigo-500 ${level.color} scale-105` 
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {level.label}
        </button>
      ))}
    </div>
  );
};

export default DifficultySelector;
