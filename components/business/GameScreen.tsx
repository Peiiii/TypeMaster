import React, { useEffect, useRef } from 'react';
import { RefreshCw, Trophy, ChevronRight, Keyboard, Lightbulb, BookOpen, Star, Sparkles } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { usePresenter } from '../../hooks/usePresenter';
import GameHeader from '../ui/GameHeader';
import WordDisplay from '../ui/WordDisplay';
import SuccessOverlay from '../ui/SuccessOverlay';

const GameScreen: React.FC = () => {
  const presenter = usePresenter();
  const { 
    currentDifficulty, currentTopic, gameMode, sentences, currentSentenceIndex, score, streak, wpm,
    isLoading, isComplete, userInput, showSuccessAnim, isAutoAdvance, isSoundEnabled, showHint, error 
  } = useGameStore();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    presenter.gameManager.loadSentences(currentDifficulty, currentTopic);
  }, []);

  useEffect(() => {
    const handleClick = () => inputRef.current?.focus();
    document.addEventListener('click', handleClick);
    setTimeout(() => inputRef.current?.focus(), 100);
    return () => document.removeEventListener('click', handleClick);
  }, []);

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

  if (isLoading && sentences.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-acid-blue relative overflow-hidden">
        <div className="absolute top-10 left-10 animate-spin-slow opacity-30 text-white"><Star size={120} /></div>
        <div className="absolute bottom-10 right-10 animate-spin-slow opacity-30 text-white"><Sparkles size={100} /></div>
        <div className="animate-spin mb-6 bg-white p-4 rounded-full border-[3px] border-black sticker-shadow">
          <RefreshCw size={48} className="text-acid-pink" />
        </div>
        <p className="font-bubble text-3xl text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
          CRAFTING YOUR LESSON...
        </p>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-acid-blue p-6 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-1/4 left-10 rotate-12 opacity-40"><Star size={80} className="fill-acid-yellow text-black stroke-[3px]" /></div>
        <div className="absolute bottom-1/4 right-10 -rotate-12 opacity-40"><Sparkles size={100} className="fill-acid-pink text-black stroke-[3px]" /></div>
        
        <div className="bg-white border-[4px] border-black rounded-3xl sticker-shadow p-10 max-w-md w-full text-center relative z-10 animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-acid-yellow border-[3px] border-black rounded-full flex items-center justify-center mx-auto mb-8 sticker-shadow -rotate-6">
            <Trophy size={48} className="text-black" />
          </div>
          <h2 className="font-bubble text-5xl text-black mb-4 uppercase tracking-tighter">YOU WIN!</h2>
          <p className="font-black text-slate-500 mb-8 uppercase text-sm tracking-widest">SESSION COMPLETE</p>
          
          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="bg-acid-blue border-[2px] border-black p-3 rounded-2xl sticker-shadow">
              <div className="font-bubble text-2xl text-white">{score}</div>
              <div className="text-[10px] text-white font-black uppercase mt-1">SCORE</div>
            </div>
            <div className="bg-acid-pink border-[2px] border-black p-3 rounded-2xl sticker-shadow">
              <div className="font-bubble text-2xl text-white">{streak}</div>
              <div className="text-[10px] text-white font-black uppercase mt-1">STREAK</div>
            </div>
            <div className="bg-acid-green border-[2px] border-black p-3 rounded-2xl sticker-shadow">
              <div className="font-bubble text-2xl text-black">{wpm}</div>
              <div className="text-[10px] text-black font-black uppercase mt-1">WPM</div>
            </div>
          </div>

          <button 
            onClick={() => presenter.gameManager.restartGame()}
            className="w-full bg-acid-yellow hover:bg-yellow-400 text-black border-[3px] border-black font-black py-5 px-8 rounded-2xl sticker-shadow-hover transition-all text-xl uppercase tracking-wider flex items-center justify-center gap-3"
          >
            <RefreshCw size={24} strokeWidth={3} />
            PLAY AGAIN
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-acid-blue flex flex-col relative overflow-hidden">
      {/* Animated Background Icons */}
      <div className="fixed top-20 left-[5%] animate-float opacity-20 pointer-events-none rotate-12"><Star size={120} className="fill-white" /></div>
      <div className="fixed bottom-20 right-[5%] animate-float opacity-20 pointer-events-none -rotate-12" style={{animationDelay: '1.5s'}}><Star size={150} className="fill-white" /></div>
      <div className="fixed top-1/2 left-[80%] animate-spin-slow opacity-10 pointer-events-none"><Sparkles size={200} className="fill-white" /></div>

      <GameHeader 
        score={score} wpm={wpm} currentDifficulty={currentDifficulty} currentTopic={currentTopic}
        gameMode={gameMode} currentIndex={currentSentenceIndex} totalSentences={sentences.length}
        isAutoAdvance={isAutoAdvance} isSoundEnabled={isSoundEnabled} showHint={showHint}
        onDifficultyChange={(d) => presenter.gameManager.changeDifficulty(d)}
        onTopicChange={(t) => presenter.gameManager.changeTopic(t)}
        onModeChange={(m) => presenter.gameManager.changeGameMode(m)}
        onToggleAutoAdvance={useGameStore.getState().toggleAutoAdvance}
        onToggleSound={useGameStore.getState().toggleSound}
        onToggleHint={useGameStore.getState().toggleHint}
      />

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 max-w-7xl mx-auto w-full">
        
        {/* Content Container */}
        <div key={currentSentenceIndex} className="w-full flex flex-col items-center animate-in slide-in-from-bottom-12 duration-500">
            
            {/* Translation Prompt Sticker */}
            <div className="bg-white border-[3px] border-black p-8 rounded-3xl sticker-shadow mb-12 max-w-4xl w-full text-center rotate-[-1deg]">
               <span className="bg-acid-pink text-white border-[2px] border-black px-4 py-1.5 rounded-full text-xs font-black tracking-widest mb-6 inline-block sticker-shadow uppercase">
                 TRANSLATE THIS!
               </span>
               <h2 className="text-4xl md:text-6xl font-black text-black leading-tight tracking-tighter">
                 {currentSentence?.chinese}
               </h2>
            </div>

            {/* English Word Slots */}
            <div className="w-full mb-12">
              <WordDisplay 
                targetSentence={currentSentence?.english || ''}
                userInput={userInput}
                isComplete={showSuccessAnim}
              />
            </div>
        </div>

        {/* UI Overlay Toggles/Hints */}
        <div className="flex gap-4">
             <button
                onClick={() => presenter.gameManager.handleHint()}
                className="group flex items-center gap-3 bg-acid-yellow hover:bg-yellow-400 text-black border-[3px] border-black px-6 py-3 rounded-2xl sticker-shadow-hover transition-all"
             >
                <Lightbulb size={24} strokeWidth={3} className="group-hover:animate-pulse" />
                <span className="font-black uppercase text-sm tracking-widest">GET HINT (TAB)</span>
                <span className="bg-black/10 px-2 py-0.5 rounded-lg text-xs font-black">-2</span>
             </button>
        </div>

        <SuccessOverlay 
          isVisible={showSuccessAnim && !isAutoAdvance}
          correctEnglish={currentSentence?.english || ''}
          onNext={() => presenter.gameManager.nextSentence()}
          onSpeak={() => presenter.audioManager.speak(currentSentence?.english)}
        />

        {/* Hidden Input */}
        <input
          ref={inputRef} type="text" value={userInput}
          onChange={handleInputChange} onKeyDown={handleKeyDown}
          className="opacity-0 absolute top-0 left-0 h-0 w-0"
          autoFocus autoComplete="off" spellCheck="false"
        />

        {error && (
           <div className="fixed bottom-10 bg-acid-pink text-white border-[3px] border-black px-6 py-3 rounded-2xl sticker-shadow animate-shake z-50 font-black">
             {error}
           </div>
        )}
      </main>
    </div>
  );
};

export default GameScreen;