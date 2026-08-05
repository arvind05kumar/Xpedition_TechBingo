import React from 'react';
import { Check, X } from 'lucide-react';

interface BingoCellProps {
  question: string;
  isCorrect: boolean | null;
  onClick: () => void;
  isSelected: boolean;
}

export const BingoCell: React.FC<BingoCellProps> = ({
  question,
  isCorrect,
  onClick,
  isSelected,
}) => {
  const getBgColor = () => {
    if (isCorrect === true) return 'bg-emerald-950/90 border-emerald-500/70 text-emerald-100 shadow-lg shadow-emerald-900/30';
    if (isCorrect === false) return 'bg-rose-950/90 border-rose-500/70 text-rose-100 shadow-lg shadow-rose-900/30';
    if (isSelected) return 'bg-gradient-to-br from-purple-600 to-indigo-600 border-2 border-purple-300 text-white shadow-xl shadow-purple-600/50 ring-2 ring-purple-400';
    return 'bg-[#180e38]/80 hover:bg-[#261754] border border-purple-900/60 text-purple-100 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-950/50';
  };

  return (
    <button
      onClick={onClick}
      className={`${getBgColor()} p-3 sm:p-4 rounded-xl transition-all duration-200 min-h-[90px] sm:min-h-[110px] md:min-h-[120px] text-xs sm:text-sm relative flex flex-col justify-between items-center text-center
        transform hover:-translate-y-1 ${isSelected ? 'scale-[1.02]' : ''}`}
    >
      <p className="leading-snug font-medium my-auto">{question}</p>
      {isCorrect !== null && (
        <div className="absolute top-2 right-2 p-1 rounded-full bg-black/40 backdrop-blur-sm">
          {isCorrect ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <X className="w-4 h-4 text-rose-400" />
          )}
        </div>
      )}
    </button>
  );
};