import React from 'react';
import { Topic } from '../../types';
import { Briefcase, Coffee, Globe, Hash, MessagesSquare, Sparkles } from 'lucide-react';

interface TopicSelectorProps {
  currentTopic: Topic;
  onSelect: (topic: Topic) => void;
  disabled: boolean;
}

const TopicSelector: React.FC<TopicSelectorProps> = ({ currentTopic, onSelect, disabled }) => {
  const topics: { id: Topic; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'all', label: 'ALL', icon: <Sparkles size={14} />, color: 'bg-acid-blue' },
    { id: 'daily', label: 'DAILY', icon: <Coffee size={14} />, color: 'bg-acid-pink' },
    { id: 'travel', label: 'TRAVEL', icon: <Globe size={14} />, color: 'bg-acid-yellow' },
    { id: 'business', label: 'WORK', icon: <Briefcase size={14} />, color: 'bg-acid-orange' },
    { id: 'tech', label: 'TECH', icon: <Hash size={14} />, color: 'bg-emerald-400' },
    { id: 'social', label: 'SOCIAL', icon: <MessagesSquare size={14} />, color: 'bg-purple-400' },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
      {topics.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          disabled={disabled}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black border-[2px] border-black transition-all duration-200 whitespace-nowrap
            ${currentTopic === item.id 
              ? `${item.color} text-black sticker-shadow scale-105 rotate-1` 
              : 'bg-white text-slate-500 opacity-80 hover:opacity-100'}
            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default TopicSelector;