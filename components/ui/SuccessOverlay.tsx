import React from 'react';
import { Sparkles, ChevronRight, Volume2, Star } from 'lucide-react';

interface SuccessOverlayProps {
  isVisible: boolean;
  correctEnglish: string;
  onNext: () => void;
  onSpeak: () => void;
}

const SuccessOverlay: React.FC<SuccessOverlayProps> = ({ isVisible, correctEnglish, onNext, onSpeak }) => {
  return (
    <div className={`
      fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 transform transition-all duration-300 ease-out z-50
      ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95 pointer-events-none'}
    `}>
      <div className="bg-acid-green border-[4px] border-black rounded-[2.5rem] p-6 sticker-shadow flex items-center justify-between relative overflow-hidden">
        {/* Background Sparkles */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <Star className="absolute top-2 left-4" size={20} />
            <Star className="absolute bottom-2 right-12" size={16} />
        </div>

        <div className="flex items-center gap-6 relative z-10">
          <div className="bg-white border-[3px] border-black p-3 rounded-2xl sticker-shadow rotate-[-5deg] animate-bounce">
            <Sparkles size={32} className="text-acid-pink" />
          </div>
          <div>
            <h3 className="font-bubble text-3xl text-black uppercase tracking-tighter">PERFECT!</h3>
            <p className="font-bubble text-xl text-black/60 italic leading-none">{correctEnglish}</p>
          </div>
        </div>
        
        <div className="flex gap-4 relative z-10">
          <button 
            onClick={onSpeak}
            className="p-4 bg-white border-[3px] border-black rounded-2xl sticker-shadow-hover text-black transition-all"
            title="Listen"
          >
            <Volume2 size={24} strokeWidth={3} />
          </button>
          <button 
            onClick={onNext}
            className="bg-acid-yellow hover:bg-yellow-400 text-black border-[3px] border-black px-8 py-4 rounded-2xl font-black transition-all sticker-shadow-hover text-lg uppercase tracking-widest flex items-center gap-2"
          >
            NEXT <ChevronRight size={24} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessOverlay;