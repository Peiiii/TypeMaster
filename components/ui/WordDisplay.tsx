import React, { useMemo } from 'react';
import { Check, X } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';

interface WordDisplayProps {
  targetSentence: string;
  userInput: string;
  isComplete: boolean;
}

const WordDisplay: React.FC<WordDisplayProps> = ({ targetSentence, userInput, isComplete }) => {
  const showHint = useGameStore(state => state.showHint);
  
  // Normalize strings for comparison
  const targetWords = useMemo(() => targetSentence.trim().split(/\s+/), [targetSentence]);
  
  // Split user input by spaces to map to slots. 
  const userWords = useMemo(() => {
    return userInput.split(/\s+/);
  }, [userInput]);

  // Determine which word is currently active
  const activeWordIndex = userWords.length - 1;

  return (
    <div className="flex flex-wrap gap-x-3 gap-y-12 justify-center max-w-5xl mx-auto p-4 perspective-1000">
      {targetWords.map((fullTargetWord, index) => {
        // Separate word from trailing punctuation
        const match = fullTargetWord.match(/^(.+?)([.,!?;:]*)$/);
        const targetWord = match ? match[1] : fullTargetWord;
        const punctuation = match ? match[2] : "";

        const userWord = userWords[index] || "";
        
        // Match logic
        const normalizedTarget = targetWord.toLowerCase();
        const normalizedUser = userWord.toLowerCase();
        
        const isMatched = normalizedUser === normalizedTarget;
        const isPartialMatch = normalizedTarget.startsWith(normalizedUser) && userWord.length > 0;
        const isError = !isMatched && !isPartialMatch && userWord.length > 0;
        
        const isActive = index === activeWordIndex;
        
        return (
          <div key={index} className="relative group flex items-baseline">
            {/* The Slot Container */}
            <div 
              className={`
                relative flex items-center justify-center
                transition-all duration-200
                border-b-[3px]
                px-1 py-1
                min-w-[1.5rem]
                ${isComplete 
                  ? 'border-green-500 text-green-600' 
                  : isActive 
                    ? 'border-indigo-500 bg-indigo-50/50 transform scale-110 shadow-lg shadow-indigo-100' 
                    : isMatched
                      ? 'border-emerald-400 bg-emerald-50/30 text-emerald-700'
                      : isError
                        ? 'border-red-400 bg-red-50 text-red-600'
                        : 'border-slate-300 text-slate-800'
                }
                rounded-t-md
              `}
            >
              {/* 
                GHOST ELEMENT (Hint):
                Controlled by `showHint`.
                If showHint is false, opacity is 0 unless it's the active word (optional hint logic could go here, but strict mode keeps it hidden).
                We keep the layout width even if hidden.
              */}
              <span className={`
                select-none pointer-events-none text-3xl md:text-4xl font-bold tracking-wide whitespace-pre font-mono transition-opacity duration-300
                ${showHint || isComplete ? 'opacity-30 text-slate-400' : 'opacity-0'}
              `}>
                {targetWord}
              </span>

              {/* 
                VISIBLE INPUT:
                Overlay with user typed text
              */}
              <span className={`absolute inset-0 flex items-center justify-center pointer-events-none`}>
                <span className={`relative text-3xl md:text-4xl font-bold tracking-wide whitespace-pre font-mono ${isComplete ? 'animate-bounce-short' : ''}`}>
                  {userWord || '\u200B'}
                  
                  {/* Blinking Cursor */}
                  {isActive && !isComplete && (
                    <span className="absolute -right-[2px] h-[80%] w-[3px] bg-indigo-600 rounded-full caret-blink top-[10%]" />
                  )}
                </span>
              </span>

              {/* Status Icons */}
              {isMatched && !isComplete && (
                <div className="absolute -top-4 -right-4 bg-white rounded-full p-0.5 shadow-sm text-emerald-500 animate-in fade-in zoom-in duration-200 z-10 border border-emerald-100">
                  <Check size={14} strokeWidth={4} />
                </div>
              )}
              {isError && (
                 <div className="absolute -top-4 -right-4 bg-white rounded-full p-0.5 shadow-sm text-red-400 animate-shake z-10 border border-red-100">
                 <X size={14} strokeWidth={4} />
               </div>
              )}
            </div>
            
            {/* Punctuation Display */}
            {punctuation && (
                <span className={`text-3xl md:text-4xl font-bold font-mono ml-0.5 select-none transition-colors duration-300 ${isComplete ? 'text-green-600' : 'text-slate-300'}`}>
                    {punctuation}
                </span>
            )}

            {/* Hint: Letter Count (Excludes punctuation) */}
            {!isComplete && (
               <div className={`
                 absolute -bottom-6 left-0 right-0 text-center text-[10px] font-mono transition-all duration-200
                 ${isActive ? 'text-indigo-500 font-bold translate-y-0' : 'text-slate-300 translate-y-1'}
                 ${isMatched ? 'opacity-0' : 'opacity-100'}
               `}>
                 {targetWord.length}
               </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default WordDisplay;