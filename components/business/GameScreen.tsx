import React, { useEffect, useRef } from 'react';
import { RefreshCw, Trophy, ChevronRight, Keyboard, Lightbulb, BookOpen, Clock } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { usePresenter } from '../../hooks/usePresenter';
import GameHeader from '../ui/GameHeader';
import WordDisplay from '../ui/WordDisplay';
import SuccessOverlay from '../ui/SuccessOverlay';

const GameScreen: React.FC = () => {
  const presenter = usePresenter();
  
  // Select data from store
  const { 
    currentDifficulty, currentTopic, gameMode, sentences, currentSentenceIndex, score, streak, wpm,
    isLoading, isComplete, userInput, showSuccessAnim, isAutoAdvance, isSoundEnabled, showHint, error 
  } = useGameStore();

  const inputRef = useRef<HTMLInputElement>(null);

  // Initial Load
  useEffect(() => {
    presenter.gameManager.loadSentences(currentDifficulty, currentTopic);
  }, []);

  // Focus management
  useEffect(() => {
    const handleClick = () => inputRef.current?.focus();
    document.addEventListener('click', handleClick);
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
        <p className="font-medium text-slate-600 animate-pulse">
          {gameMode === 'story' ? 'Writing a story for you...' : 'Loading English lesson...'}
        </p>
      </div>
    );
  }

  // Completion View
  if (isComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-slate-100 animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-600 shadow-yellow-100 shadow-lg">
            <Trophy size={40} />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Excellent Work!</h2>
          <p className="text-slate-600 mb-8">
            You completed the {gameMode === 'story' ? 'story' : `${currentTopic} session`} on {currentDifficulty}.
          </p>
          
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100">
              <div className="text-xl font-bold text-indigo-600">{score}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-1">Score</div>
            </div>
            <div className="bg-orange-50 p-3 rounded-xl border border-orange-100">
              <div className="text-xl font-bold text-orange-600">{streak}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-1">Streak</div>
            </div>
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
              <div className="text-xl font-bold text-emerald-600">{wpm}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-1">WPM</div>
            </div>
          </div>

          <button 
            onClick={() => presenter.gameManager.restartGame()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
          >
            <RefreshCw size={20} />
            {gameMode === 'story' ? 'Generate New Story' : 'Start New Session'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <GameHeader 
        score={score}
        wpm={wpm}
        currentDifficulty={currentDifficulty}
        currentTopic={currentTopic}
        gameMode={gameMode}
        currentIndex={currentSentenceIndex}
        totalSentences={sentences.length}
        isAutoAdvance={isAutoAdvance}
        isSoundEnabled={isSoundEnabled}
        showHint={showHint}
        onDifficultyChange={(d) => presenter.gameManager.changeDifficulty(d)}
        onTopicChange={(t) => presenter.gameManager.changeTopic(t)}
        onModeChange={(m) => presenter.gameManager.changeGameMode(m)}
        onToggleAutoAdvance={useGameStore.getState().toggleAutoAdvance}
        onToggleSound={useGameStore.getState().toggleSound}
        onToggleHint={useGameStore.getState().toggleHint}
      />

      <main className="flex-1 flex flex-col items-center justify-center p-4 relative max-w-6xl mx-auto w-full overflow-hidden">
        {/* Story Indicator */}
        {gameMode === 'story' && (
           <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-indigo-400 opacity-80 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
             <BookOpen size={14} />
             <span className="text-xs font-bold tracking-wider uppercase">Story Mode</span>
           </div>
        )}

        {/* Transition Container: Animates when currentSentenceIndex changes */}
        <div 
           key={currentSentenceIndex}
           className="flex flex-col items-center justify-center w-full max-w-4xl py-10 animate-in slide-in-from-right-8 fade-in duration-300"
        >
            {/* Chinese Prompt */}
            <div className="w-full text-center mb-16">
               <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold tracking-widest mb-6 uppercase border border-slate-200">
                 Translate to English
               </span>
               <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-slate-800 leading-tight tracking-tight">
                 {currentSentence?.chinese}
               </h2>
            </div>

            {/* Interactive Word Display */}
            <div className="w-full mb-12 relative min-h-[120px]">
              {currentSentence && (
                <WordDisplay 
                  targetSentence={currentSentence.english}
                  userInput={userInput}
                  isComplete={showSuccessAnim}
                />
              )}
              
              {/* Success Inline Button (Desktop) - Only show if NOT auto-advancing to avoid flashing */}
              {showSuccessAnim && !isAutoAdvance && (
                 <div className="absolute -bottom-24 left-0 right-0 flex justify-center animate-in fade-in slide-in-from-top-2 duration-300 z-30">
                    <button 
                      onClick={() => presenter.gameManager.nextSentence()}
                      className="group flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white pl-6 pr-4 py-3 rounded-full shadow-xl shadow-indigo-200 transition-all hover:scale-105 active:scale-95 border-2 border-indigo-100"
                    >
                       <span className="font-bold">Next Sentence</span>
                       <div className="flex items-center justify-center bg-white/20 rounded h-6 w-6 text-xs font-mono">↵</div>
                       <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                    </button>
                 </div>
              )}
            </div>
        </div>

        {/* Hints & Instructions */}
        <div className="flex flex-col items-center gap-4 mb-8 relative z-20">
            {!showSuccessAnim && !isComplete && (
                <div className="flex items-center gap-3">
                     <div className={`text-slate-400 text-sm flex items-center gap-2 transition-opacity duration-300 ${userInput.length > 0 ? 'opacity-0' : 'opacity-70'}`}>
                        <Keyboard size={16} />
                        <span className="hidden sm:inline">Start typing...</span>
                    </div>

                    <div className="h-4 w-px bg-slate-200 mx-2 hidden sm:block"></div>

                    <button
                        onClick={() => {
                            presenter.gameManager.handleHint();
                            inputRef.current?.focus();
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors text-xs font-bold border border-yellow-200 shadow-sm active:translate-y-0.5 group"
                        title="Click or press Tab"
                    >
                        <Lightbulb size={14} className={`group-hover:fill-current ${score >= 2 ? "" : ""}`} />
                        <span>HINT</span>
                        <span className="bg-white/60 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-yellow-700/70 border border-yellow-200/50">-2</span>
                    </button>
                    <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider text-slate-300">
                        (Tab)
                    </span>
                </div>
            )}
        </div>

        {/* Bottom Success Overlay - Only show if NOT auto-advancing */}
        <SuccessOverlay 
          isVisible={showSuccessAnim && !isAutoAdvance}
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
           <div className="absolute bottom-24 bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm border border-red-200 shadow-sm animate-shake">
             {error}
           </div>
        )}
      </main>
    </div>
  );
};

export default GameScreen;