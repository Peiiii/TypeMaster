import React, { useMemo } from 'react';
import { Check, X } from 'lucide-react';

interface WordDisplayProps {
  targetSentence: string;
  userInput: string;
  isComplete: boolean;
}

const WordDisplay: React.FC<WordDisplayProps> = ({ targetSentence, userInput, isComplete }) => {
  // Normalize strings for comparison
  const targetWords = useMemo(() => targetSentence.trim().split(/\s+/), [targetSentence]);
  
  // Split user input by spaces to map to slots. 
  const userWords = useMemo(() => {
    return userInput.split(/\s+/);
  }, [userInput]);

  // Determine which word is currently active
  const isTypingNextWord = userInput.endsWith(' ') && userInput.length > 0;
  const activeWordIndex = isTypingNextWord ? userWords.length - 1 : userWords.length - 1;

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-10 justify-center max-w-4xl mx-auto p-4 perspective-1000">
      {targetWords.map((targetWord, index) => {
        const userWord = userWords[index] || "";
        
        // Match logic (Case insensitive for visual feedback)
        const normalizedTarget = targetWord.toLowerCase();
        const normalizedUser = userWord.toLowerCase();
        
        const isMatched = normalizedUser === normalizedTarget;
        const isPartialMatch = normalizedTarget.startsWith(normalizedUser) && userWord.length > 0;
        const isError = !isMatched && !isPartialMatch && userWord.length > 0;
        
        const isActive = index === activeWordIndex;
        
        return (
          <div key={index} className="relative group">
            {/* The Slot Container */}
            <div 
              className={`
                relative flex items-center justify-center
                transition-all duration-200
                border-b-4 
                px-1 py-1
                min-w-[2.5rem]
                ${isComplete 
                  ? 'border-green-500 text-green-600' 
                  : isActive 
                    ? 'border-indigo-500 bg-indigo-50/50' 
                    : isMatched
                      ? 'border-emerald-400 bg-emerald-50/30 text-emerald-700'
                      : isError
                        ? 'border-red-300 bg-red-50 text-red-600'
                        : 'border-slate-300 text-slate-800'
                }
              `}
            >
              {/* 
                GHOST ELEMENT:
                This invisible span contains the TARGET word.
                It forces the parent <div> to always be the width of the correct answer.
                This prevents the underscore from resizing while typing.
              */}
              <span className="opacity-0 select-none pointer-events-none text-2xl md:text-3xl font-bold tracking-wide whitespace-pre font-mono">
                {targetWord}
              </span>

              {/* 
                VISIBLE INPUT:
                This span overlays the ghost element.
                It contains what the user has actually typed.
                Centered absolutely within the fixed-width parent.
              */}
              <span className={`absolute inset-0 flex items-center justify-center pointer-events-none`}>
                <span className={`text-2xl md:text-3xl font-bold tracking-wide whitespace-pre font-mono ${isComplete ? 'animate-bounce-short' : ''}`}>
                  {userWord}
                </span>
              </span>

              {/* Status Icons */}
              {isMatched && !isComplete && (
                <div className="absolute -top-3 -right-3 text-emerald-500 animate-in fade-in zoom-in duration-200 z-10">
                  <Check size={16} strokeWidth={4} />
                </div>
              )}
              {isError && (
                 <div className="absolute -top-3 -right-3 text-red-400 animate-shake z-10">
                 <X size={16} strokeWidth={4} />
               </div>
              )}
            </div>
            
            {/* Hint: Letter Count */}
            {!isComplete && (
               <div className={`
                 absolute -bottom-6 left-0 right-0 text-center text-[10px] font-mono transition-colors duration-200
                 ${isActive ? 'text-indigo-400 font-bold' : 'text-slate-300'}
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