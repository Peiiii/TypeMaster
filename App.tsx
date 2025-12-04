import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Brain, Sparkles, RefreshCw, Trophy, ChevronRight, Keyboard, Volume2 } from 'lucide-react';
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
    const handleClick = () => inputRef.current?.focus();
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

  // Loading Screen (Only shows on very first load if slow, or if we explicitly set it)
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
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Brain size={24} />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">TypeMaster AI</h1>
          </div>
          
          <DifficultySelector 
            currentDifficulty={difficulty} 
            onSelect={setDifficulty} 
            disabled={false}
          />

          <div className="flex items-center gap-6 text-sm font-medium">
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
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative max-w-5xl mx-auto w-full">
        
        {/* Chinese Prompt Card */}
        <div className="w-full text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <span className="inline-block px-3 py-1 bg-slate-200 text-slate-600 rounded-full text-xs font-bold tracking-wider mb-4 uppercase">
             Translate to English
           </span>
           <h2 className="text-3xl md:text-5xl font-extrabold text-slate-800 leading-tight">
             {currentSentence?.chinese}
           </h2>
        </div>

        {/* Word Slots Display */}
        <div className="w-full mb-12">
          {currentSentence && (
            <WordDisplay 
              targetSentence={currentSentence.english}
              userInput={userInput}
              isComplete={showSuccessAnim}
            />
          )}
        </div>

        {/* Helper/Instructions */}
        <div className="text-slate-400 text-sm flex items-center gap-2 mb-8 opacity-70">
          <Keyboard size={16} />
          <span>Type the English translation...</span>
        </div>

        {/* Controls (Success State) */}
        <div className={`
          fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-6 transform transition-transform duration-300 ease-out
          ${showSuccessAnim ? 'translate-y-0' : 'translate-y-full'}
        `}>
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full text-green-600">
                <Sparkles size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-green-700">Correct!</h3>
                <p className="text-green-600 text-sm">{currentSentence?.english}</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={handleSpeak}
                className="p-3 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                title="Listen"
              >
                <Volume2 size={24} />
              </button>
              <button 
                onClick={nextSentence}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-green-200 transition-all hover:scale-105 flex items-center gap-2"
              >
                Next Sentence <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Hidden Input */}
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          className="opacity-0 absolute top-0 left-0 h-full w-full cursor-default"
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />

        {gameData.error && (
           <div className="absolute bottom-10 bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm">
             {gameData.error}
           </div>
        )}
      </main>
    </div>
  );
};

export default App;