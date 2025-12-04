import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Brain, Sparkles, RefreshCw, Trophy, ChevronRight, Keyboard, Volume2, Lightbulb } from 'lucide-react';
import { generateSentences } from './services/geminiService';
import { Sentence, Difficulty, GameState } from './types';
import WordDisplay from './components/WordDisplay';
import DifficultySelector from './components/DifficultySelector';

const App: React.FC = () => {
  // --- State ---
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [gameData, setGameData] = useState<GameState>({
    currentSentenceIndex: 0,
    sentences: [],
    score: 0,
    streak: 0,
    isLoading: true, // Initial load is true
    isComplete: false,
    error: null,
  });
  const [userInput, setUserInput] = useState('');
  const [showSuccessAnim, setShowSuccessAnim] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // --- Helpers ---
  const currentSentence = gameData.sentences[gameData.currentSentenceIndex];

  const loadSentences = useCallback(async (diff: Difficulty) => {
    // Note: We deliberately do NOT set isLoading: true here to prevent 
    // the UI from flashing a spinner when switching difficulties,
    // since the data load is now effectively instant.
    
    try {
      const sentences = await generateSentences(diff);
      setGameData(prev => ({
        ...prev,
        sentences,
        currentSentenceIndex: 0,
        isLoading: false,
        isComplete: false,
        error: null
      }));
      setUserInput('');
      // Focus input on load
      setTimeout(() => inputRef.current?.focus(), 50);
    } catch (err) {
      setGameData(prev => ({ ...prev, isLoading: false, error: "Failed to load sentences. Please refresh." }));
    }
  }, []);

  // --- Effects ---
  useEffect(() => {
    loadSentences(difficulty);
  }, [difficulty, loadSentences]);

  // Keep focus on input
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Don't autofocus if clicking on a button or interactive element
      if ((e.target as HTMLElement).closest('button')) return;
      inputRef.current?.focus();
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // --- Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (showSuccessAnim || gameData.isLoading) return;

    const val = e.target.value;
    // Prevent double spaces for cleaner splitting
    if (val.includes('  ')) return;
    
    setUserInput(val);
    checkCompletion(val);
  };

  const handleHint = () => {
    if (!currentSentence || showSuccessAnim || gameData.isComplete) return;

    const target = currentSentence.english;
    const current = userInput;

    // Progressive Hint Logic:
    // 1. Find the length of the matching prefix (case-insensitive)
    // 2. Reveal exactly one more character from the Target (fixing errors if any)
    let matchLen = 0;
    while (
      matchLen < current.length && 
      matchLen < target.length && 
      current[matchLen].toLowerCase() === target[matchLen].toLowerCase()
    ) {
      matchLen++;
    }

    // Slice up to matchLen + 1 to add the next character
    const nextContent = target.slice(0, matchLen + 1);
    
    if (nextContent !== current) {
       setUserInput(nextContent);
       checkCompletion(nextContent);
       
       // Deduct score for using a hint
       setGameData(prev => ({
         ...prev,
         score: Math.max(0, prev.score - 2)
       }));
       
       inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && showSuccessAnim) {
      e.preventDefault();
      nextSentence();
    } else if (e.key === 'Tab' && !showSuccessAnim) {
      e.preventDefault();
      handleHint();
    }
  };

  const checkCompletion = (input: string) => {
    if (!currentSentence) return;

    // Robust comparison: normalize case and trim whitespace
    const normalizedInput = input.trim().toLowerCase();
    const normalizedTarget = currentSentence.english.trim().toLowerCase();

    // 1. Exact Match Check
    if (normalizedInput === normalizedTarget) {
      handleSuccess();
      return;
    }

    // 2. Forgiving Match Check (Ignore missing final punctuation)
    // If target is "I am happy." and input is "I am happy", we accept it.
    const lastChar = normalizedTarget.slice(-1);
    const isPunctuation = ['.', '!', '?'].includes(lastChar);
    
    if (isPunctuation) {
      const targetWithoutPunct = normalizedTarget.slice(0, -1);
      // If the input matches the target minus the punctuation
      if (normalizedInput === targetWithoutPunct) {
        // Auto-complete the punctuation for the user so it looks correct
        setUserInput(currentSentence.english); 
        handleSuccess();
      }
    }
  };

  const handleSuccess = () => {
    setShowSuccessAnim(true);
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3'); // Simple ping sound
    audio.volume = 0.2;
    audio.play().catch(() => {}); // Ignore play errors (browsers block auto audio sometimes)

    setGameData(prev => ({
      ...prev,
      score: prev.score + 10 + (prev.streak * 2),
      streak: prev.streak + 1
    }));
  };

  const nextSentence = () => {
    setShowSuccessAnim(false);
    setUserInput('');
    
    setGameData(prev => {
      const nextIndex = prev.currentSentenceIndex + 1;
      if (nextIndex >= prev.sentences.length) {
        return { ...prev, isComplete: true };
      }
      return { ...prev, currentSentenceIndex: nextIndex };
    });
  };

  const handlePlayAgain = () => {
    // Reset game state for a restart
    setGameData(prev => ({
        ...prev,
        score: 0,
        streak: 0,
        isComplete: false,
    }));
    loadSentences(difficulty);
  };

  const handleSpeak = () => {
    if (!currentSentence) return;
    const utterance = new SpeechSynthesisUtterance(currentSentence.english);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  // --- Render ---

  // Loading Screen
  if (gameData.isLoading && gameData.sentences.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-400">
        <div className="animate-spin mb-4">
          <RefreshCw size={32} className="text-indigo-500" />
        </div>
        <p className="font-medium text-slate-600 animate-pulse">Loading English lesson...</p>
      </div>
    );
  }

  // End of Set Screen
  if (gameData.isComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-slate-100">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-600">
            <Trophy size={40} />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Excellent Work!</h2>
          <p className="text-slate-600 mb-6">You completed the {difficulty} session.</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 p-4 rounded-xl">
              <div className="text-2xl font-bold text-indigo-600">{gameData.score}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Score</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl">
              <div className="text-2xl font-bold text-orange-500">{gameData.streak}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Best Streak</div>
            </div>
          </div>

          <button 
            onClick={handlePlayAgain}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={20} />
            Start New Session
          </button>
        </div>
      </div>
    );
  }

  // Main Game Loop
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      {/* Changed: 'relative' on mobile to prevent obstruction, 'sticky' on desktop */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200 relative md:sticky md:top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-2 md:py-4 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
          
          <div className="w-full md:w-auto flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="bg-indigo-600 p-1.5 md:p-2 rounded-lg text-white">
                <Brain size={20} className="md:w-6 md:h-6" />
              </div>
              <h1 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">TypeMaster AI</h1>
            </div>
            {/* Stats visible on mobile top row */}
            <div className="flex md:hidden items-center gap-4 text-sm font-medium">
               <div className="flex flex-col items-end">
                 <span className="text-indigo-600 text-lg leading-none font-bold">{gameData.score}</span>
               </div>
               <div className="flex flex-col items-end">
                 <span className="text-slate-700 text-lg leading-none">{gameData.currentSentenceIndex + 1}<span className="text-slate-400 text-sm">/{gameData.sentences.length}</span></span>
               </div>
            </div>
          </div>
          
          <div className="w-full md:w-auto flex justify-center">
            <DifficultySelector 
              currentDifficulty={difficulty} 
              onSelect={setDifficulty} 
              disabled={false}
            />
          </div>

          {/* Stats visible on desktop only */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
             <div className="flex flex-col items-end">
               <span className="text-slate-400 text-xs uppercase">Score</span>
               <span className="text-indigo-600 text-lg leading-none">{gameData.score}</span>
             </div>
             <div className="flex flex-col items-end">
               <span className="text-slate-400 text-xs uppercase">Progress</span>
               <span className="text-slate-700 text-lg leading-none">{gameData.currentSentenceIndex + 1}<span className="text-slate-400 text-base">/{gameData.sentences.length}</span></span>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {/* Changed: 'justify-start' and 'pt-8' on mobile to ensure content starts from top and isn't cut off */}
      <main className="flex-1 flex flex-col items-center justify-start md:justify-center p-4 md:p-6 pt-8 md:pt-6 pb-40 md:pb-6 relative max-w-5xl mx-auto w-full z-0">
        
        {/* Chinese Prompt Card */}
        <div className="w-full text-center mb-8 md:mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10 pointer-events-none">
           <span className="inline-block px-3 py-1 bg-slate-200 text-slate-600 rounded-full text-[10px] md:text-xs font-bold tracking-wider mb-3 md:mb-4 uppercase">
             Translate to English
           </span>
           <h2 className="text-2xl md:text-5xl font-extrabold text-slate-800 leading-tight px-2">
             {currentSentence?.chinese}
           </h2>
        </div>

        {/* Word Slots Display */}
        <div className="w-full mb-8 md:mb-12 relative z-10 pointer-events-none">
          {currentSentence && (
            <WordDisplay 
              targetSentence={currentSentence.english}
              userInput={userInput}
              isComplete={showSuccessAnim}
            />
          )}
          
          {/* Success Inline Action */}
          {showSuccessAnim && (
             <div className="absolute -bottom-20 left-0 right-0 flex justify-center animate-in fade-in slide-in-from-top-2 duration-300 z-30 pointer-events-auto">
                <button 
                  onClick={nextSentence}
                  className="group flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white pl-6 pr-4 py-3 rounded-full shadow-xl shadow-indigo-200 transition-all hover:scale-105 active:scale-95 border-2 border-indigo-100"
                >
                   <span className="font-bold">Next Sentence</span>
                   <div className="flex items-center justify-center bg-white/20 rounded h-6 w-6 text-xs font-mono">↵</div>
                   <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                </button>
             </div>
          )}
        </div>

        {/* Helper/Instructions/Hints */}
        <div className="flex items-center gap-4 mb-8 relative z-20">
            <div className={`text-slate-400 text-sm flex items-center gap-2 transition-opacity duration-300 ${showSuccessAnim ? 'opacity-0' : 'opacity-70'}`}>
                <Keyboard size={16} />
                <span className="hidden sm:inline">Type translation...</span>
            </div>
            
            {!showSuccessAnim && !gameData.isComplete && (
                <button
                    onClick={handleHint}
                    className="flex items-center gap-2 px-3 py-2 md:py-1.5 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors text-sm font-medium border border-yellow-200 shadow-sm active:translate-y-0.5 cursor-pointer"
                    title="Get a hint (Costs 2 points)"
                    type="button"
                >
                    <Lightbulb size={16} className={gameData.score >= 2 ? "fill-yellow-100" : ""} />
                    <span>Hint</span>
                    <span className="bg-white/60 px-1.5 py-0.5 rounded text-[10px] font-bold tracking-tight text-yellow-700/70 border border-yellow-200/50">-2</span>
                </button>
            )}
        </div>

        {/* Controls (Success State - Fixed Bottom Bar) */}
        <div className={`
          fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 md:p-6 transform transition-transform duration-300 ease-out z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]
          ${showSuccessAnim ? 'translate-y-0' : 'translate-y-full'}
        `}>
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
              <div className="bg-green-100 p-2 md:p-3 rounded-full text-green-600 animate-bounce-short shrink-0">
                <Sparkles size={20} className="md:w-6 md:h-6" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base md:text-lg font-bold text-green-700 truncate">Correct!</h3>
                <p className="text-green-600 text-xs md:text-sm font-medium truncate">{currentSentence?.english}</p>
              </div>
            </div>
            
            <div className="flex gap-2 md:gap-3 shrink-0">
              <button 
                onClick={handleSpeak}
                className="p-3 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                title="Listen"
              >
                <Volume2 size={24} />
              </button>
              {/* Secondary Next Button (for mobile ease) */}
              <button 
                onClick={nextSentence}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 md:px-6 py-2 md:py-3 rounded-xl font-bold transition-all md:hidden"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Hidden Input - Z-index 0 to sit behind buttons but cover area for tapping empty space */}
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="opacity-0 absolute top-0 left-0 h-full w-full cursor-default z-0 touch-none"
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />

        {gameData.error && (
           <div className="absolute bottom-20 bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm z-50">
             {gameData.error}
           </div>
        )}
      </main>
    </div>
  );
};

export default App;