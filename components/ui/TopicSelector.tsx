import React from 'react';
import { Topic } from '../../types';
import { Briefcase, Coffee, Globe, Hash, MessagesSquare, Sparkles } from 'lucide-react';

interface TopicSelectorProps {
  currentTopic: Topic;
  onSelect: (topic: Topic) => void;
  disabled: boolean;
}

const TopicSelector: React.FC<TopicSelectorProps> = ({ currentTopic, onSelect, disabled }) => {
  const topics: { id: Topic; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All', icon: <Sparkles size={14} /> },
    { id: 'daily', label: 'Daily', icon: <Coffee size={14} /> },
    { id: 'travel', label: 'Travel', icon: <Globe size={14} /> },
    { id: 'business', label: 'Work', icon: <Briefcase size={14} /> },
    { id: 'tech', label: 'Tech', icon: <Hash size={14} /> },
    { id: 'social', label: 'Social', icon: <MessagesSquare size={14} /> },
  ];

  return (
    <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
      {topics.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          disabled={disabled}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap
            ${currentTopic === item.id 
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
              : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-indigo-600'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
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