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
  
  const targetWords = useMemo(() => targetSentence.trim().split(/\s+/), [targetSentence]);
  const userWords = useMemo(() => userInput.split(/\s+/), [userInput]);
  const activeWordIndex = userWords.length - 1;

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-10 justify-center max-w-6xl mx-auto p-8">
      {targetWords.map((fullTargetWord, index) => {
        const match = fullTargetWord.match(/^(.+?)([.,!?;:]*)$/);
        const targetWord = match ? match[1] : fullTargetWord;
        const punctuation = match ? match[2] : "";

        const userWord = userWords[index] || "";
        const normalizedTarget = targetWord.toLowerCase();
        const normalizedUser = userWord.toLowerCase();
        
        const isMatched = normalizedUser === normalizedTarget;
        const isPartialMatch = normalizedTarget.startsWith(normalizedUser) && userWord.length > 0;
        const isError = !isMatched && !isPartialMatch && userWord.length > 0;
        const isActive = index === activeWordIndex;
        
        return (
          <div key={index} className="relative flex items-baseline">
            {/* Bubble Word Slot */}
            <div 
              className={`
                relative flex items-center justify-center
                transition-all duration-150
                border-[3px] border-black rounded-2xl
                px-4 py-2 min-w-[3rem]
                sticker-shadow
                ${isComplete 
                  ? 'bg-acid-green scale-110 -rotate-2' 
                  : isActive 
                    ? 'bg-acid-yellow scale-110 rotate-1' 
                    : isMatched
                      ? 'bg-white text-black'
                      : isError
                        ? 'bg-acid-pink text-white animate-shake'
                        : 'bg-white text-slate-400 opacity-60'
                }
              `}
            >
              {/* Target Text (Shadow/Hint) */}
              <span className={`
                select-none pointer-events-none font-bubble text-3xl md:text-5xl transition-opacity duration-300
                ${showHint || isComplete ? 'opacity-20 text-black' : 'opacity-0'}
              `}>
                {targetWord}
              </span>

              {/* User Typing Text */}
              <span className={`absolute inset-0 flex items-center justify-center pointer-events-none`}>
                <span className={`relative font-bubble text-3xl md:text-5xl text-black ${isComplete ? 'animate-bounce' : ''}`}>
                  {userWord}
                  {isActive && !isComplete && (
                    <span className="absolute -right-2 h-[80%] w-[4px] bg-black rounded-full caret-blink top-[10%]" />
                  )}
                </span>
              </span>

              {/* Status Mini-Stickers */}
              {isMatched && !isComplete && (
                <div className="absolute -top-3 -right-3 bg-acid-green border-[2px] border-black rounded-full p-1 sticker-shadow animate-pop-in">
                  <Check size={14} strokeWidth={4} className="text-black" />
                </div>
              )}
              {isError && (
                 <div className="absolute -top-3 -right-3 bg-white border-[2px] border-black rounded-full p-1 sticker-shadow animate-shake">
                 <X size={14} strokeWidth={4} className="text-red-600" />
               </div>
              )}
            </div>
            
            {/* Punctuation Stickers */}
            {punctuation && (
                <span className={`font-bubble text-4xl md:text-6xl ml-2 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] ${isComplete ? 'text-black' : 'text-black/20'}`}>
                    {punctuation}
                </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default WordDisplay;