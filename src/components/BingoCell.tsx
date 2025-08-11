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
    if (isCorrect === true) return 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200';
    if (isCorrect === false) return 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200';
    if (isSelected) return 'bg-gradient-to-br from-indigo-600 to-purple-600 border-indigo-700 text-white shadow-lg';
    return 'bg-white hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100';
  };

  return (
    <button
      onClick={onClick}
      className={`${getBgColor()} p-4 border rounded-lg shadow-sm 
        hover:shadow-md transition-all duration-200 min-h-[120px] text-sm relative
        transform hover:-translate-y-1 ${isSelected ? 'ring-4 ring-indigo-300 ring-opacity-50' : ''}`}
    >
      <p className={isSelected ? 'text-white' : 'text-gray-800'}>{question}</p>
      {isCorrect !== null && (
        <div className="absolute top-2 right-2">
          {isCorrect ? (
            <Check className="w-5 h-5 text-green-600" />
          ) : (
            <X className="w-5 h-5 text-red-600" />
          )}
        </div>
      )}
    </button>
  );
};