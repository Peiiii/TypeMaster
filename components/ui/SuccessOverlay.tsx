import React from 'react';
import { Sparkles, ChevronRight, Volume2 } from 'lucide-react';

interface SuccessOverlayProps {
  isVisible: boolean;
  correctEnglish: string;
  onNext: () => void;
  onSpeak: () => void;
}

const SuccessOverlay: React.FC<SuccessOverlayProps> = ({ isVisible, correctEnglish, onNext, onSpeak }) => {
  return (
    <div className={`
      fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-6 transform transition-transform duration-150 ease-out z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]
      ${isVisible ? 'translate-y-0' : 'translate-y-full'}
    `}>
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-full text-green-600 animate-bounce-short">
            <Sparkles size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-green-700">Correct!</h3>
            <p className="text-green-600 text-sm font-medium">{correctEnglish}</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={onSpeak}
            className="p-3 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            title="Listen"
          >
            <Volume2 size={24} />
          </button>
          <button 
            onClick={onNext}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold transition-all md:hidden"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessOverlay;