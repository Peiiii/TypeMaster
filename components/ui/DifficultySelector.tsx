import React from 'react';
import { Difficulty } from '../../types';

interface DifficultySelectorProps {
  currentDifficulty: Difficulty;
  onSelect: (difficulty: Difficulty) => void;
  disabled: boolean;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ currentDifficulty, onSelect, disabled }) => {
  const levels = [
    { id: Difficulty.EASY, label: 'EASY', color: 'bg-acid-green' },
    { id: Difficulty.MEDIUM, label: 'MEDIUM', color: 'bg-acid-yellow' },
    { id: Difficulty.HARD, label: 'HARD', color: 'bg-acid-pink' },
  ];

  return (
    <div className="flex gap-2">
      {levels.map((level) => (
        <button
          key={level.id}
          onClick={() => onSelect(level.id)}
          disabled={disabled}
          className={`
            px-4 py-1.5 rounded-xl text-[11px] font-black border-[2px] border-black transition-all duration-150
            ${currentDifficulty === level.id 
              ? `${level.color} sticker-shadow scale-110 -rotate-2 text-black` 
              : 'bg-white text-slate-500 opacity-60 hover:opacity-100'}
            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {level.label}
        </button>
      ))}
    </div>
  );
};

export default DifficultySelector;