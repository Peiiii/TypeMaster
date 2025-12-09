import React, { useEffect, useRef } from 'react';
import { RefreshCw, Trophy, ChevronRight, Keyboard, Lightbulb } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { usePresenter } from '../../hooks/usePresenter';
import GameHeader from '../ui/GameHeader';
import WordDisplay from '../ui/WordDisplay';
import SuccessOverlay from '../ui/SuccessOverlay';

const GameScreen: React.FC = () => {
  const presenter = usePresenter();
  
  // Select data from store
  const { 
    currentDifficulty, sentences, currentSentenceIndex, score, streak, 
    isLoading, isComplete, userInput, showSuccessAnim, isAutoAdvance, error 
  } = useGameStore();

  const inputRef = useRef<HTMLInputElement>(null);

  // Initial Load
  useEffect(() => {
    presenter.gameManager.loadSentences(currentDifficulty);
  }, []);

  // Focus management
  useEffect(() => {
    const handleClick = () => inputRef.current?.focus();
    document.addEventListener('click', handleClick);
    // Initial focus
    setTimeout(() => inputRef.current?.focus(), 50);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    presenter.gameManager.handleInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && showSuccessAnim) {
      e.preventDefault();
      presenter.gameManager.nextSentence();
    } else if (e.key === 'Tab' && !showSuccessAnim) {
      e.preventDefault();
      presenter.gameManager.handleHint();
    }
  };

  const currentSentence = sentences[currentSentenceIndex];

  // Loading View
  if (isLoading && sentences.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-400">
        <div className="animate-spin mb-4">
          <RefreshCw size={32} className="text-indigo-500" />
        </div>
        <p className="font-medium text-slate-600 animate-pulse">Loading English lesson...</p>
      </div>
    );
  }

  // Completion View
  if (isComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-slate-100">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-600">
            <Trophy size={40} />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Excellent Work!</h2>
          <p className="text-slate-600 mb-6">You completed the {currentDifficulty} session.</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 p-4 rounded-xl">
              <div className="text-2xl font-bold text-indigo-600">{score}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Score</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl">
              <div className="text-2xl font-bold text-orange-500">{streak}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Best Streak</div>
            </div>
          </div>

          <button 
            onClick={() => presenter.gameManager.restartGame()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={20} />
            Start New Session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <GameHeader 
        score={score}
        currentDifficulty={currentDifficulty}
        currentIndex={currentSentenceIndex}
        totalSentences={sentences.length}
        isAutoAdvance={isAutoAdvance}
        onDifficultyChange={(d) => presenter.gameManager.changeDifficulty(d)}
        onToggleAutoAdvance={useGameStore.getState().toggleAutoAdvance}
      />

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative max-w-5xl mx-auto w-full">
        {/* Chinese Prompt */}
        <div className="w-full text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <span className="inline-block px-3 py-1 bg-slate-200 text-slate-600 rounded-full text-xs font-bold tracking-wider mb-4 uppercase">
             Translate to English
           </span>
           <h2 className="text-3xl md:text-5xl font-extrabold text-slate-800 leading-tight">
             {currentSentence?.chinese}
           </h2>
        </div>

        {/* Interactive Word Display */}
        <div className="w-full mb-12 relative">
          {currentSentence && (
            <WordDisplay 
              targetSentence={currentSentence.english}
              userInput={userInput}
              isComplete={showSuccessAnim}
            />
          )}
          
          {/* Success Inline Button (Desktop) */}
          {showSuccessAnim && (
             <div className="absolute -bottom-20 left-0 right-0 flex justify-center animate-in fade-in slide-in-from-top-2 duration-300 z-30">
                <button 
                  onClick={() => presenter.gameManager.nextSentence()}
                  className="group flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white pl-6 pr-4 py-3 rounded-full shadow-xl shadow-indigo-200 transition-all hover:scale-105 active:scale-95 border-2 border-indigo-100"
                >
                   <span className="font-bold">Next Sentence</span>
                   <div className="flex items-center justify-center bg-white/20 rounded h-6 w-6 text-xs font-mono">↵</div>
                   <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                   
                   {/* Auto-advance progress indicator */}
                   {isAutoAdvance && (
                     <span className="absolute -bottom-6 text-[10px] text-indigo-400 font-medium animate-pulse">
                       Auto-advancing...
                     </span>
                   )}
                </button>
             </div>
          )}
        </div>

        {/* Hints & Instructions */}
        <div className="flex items-center gap-4 mb-8">
            <div className={`text-slate-400 text-sm flex items-center gap-2 transition-opacity duration-300 ${showSuccessAnim ? 'opacity-0' : 'opacity-70'}`}>
                <Keyboard size={16} />
                <span className="hidden sm:inline">Type translation...</span>
            </div>
            
            {!showSuccessAnim && !isComplete && (
                <button
                    onClick={() => {
                        presenter.gameManager.handleHint();
                        inputRef.current?.focus();
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors text-sm font-medium border border-yellow-200 shadow-sm active:translate-y-0.5"
                    title="Get a hint (Costs 2 points)"
                >
                    <Lightbulb size={16} className={score >= 2 ? "fill-yellow-100" : ""} />
                    <span>Hint</span>
                    <span className="bg-white/60 px-1.5 py-0.5 rounded text-[10px] font-bold tracking-tight text-yellow-700/70 border border-yellow-200/50">-2</span>
                </button>
            )}
        </div>

        {/* Bottom Success Overlay */}
        <SuccessOverlay 
          isVisible={showSuccessAnim}
          correctEnglish={currentSentence?.english || ''}
          onNext={() => presenter.gameManager.nextSentence()}
          onSpeak={() => presenter.audioManager.speak(currentSentence?.english)}
        />

        {/* Hidden Input for Typing */}
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="opacity-0 absolute top-0 left-0 h-full w-full cursor-default"
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />

        {error && (
           <div className="absolute bottom-10 bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm">
             {error}
           </div>
        )}
      </main>
    </div>
  );
};

export default GameScreen;