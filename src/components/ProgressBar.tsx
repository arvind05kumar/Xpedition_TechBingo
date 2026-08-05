import React from 'react';
import { GameState } from '../types';

const BOARD_SIZE = 5;

interface ProgressBarProps {
  gameState: GameState;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ gameState }) => {
  const totalCells = BOARD_SIZE * BOARD_SIZE;
  const answeredCells = gameState.correctAnswers.size + gameState.wrongAnswers.size;
  const progress = (answeredCells / totalCells) * 100;
  const correctProgress = (gameState.correctAnswers.size / totalCells) * 100;

  return (
    <div className="w-full mb-6 bg-[#140a30]/80 p-3 sm:p-4 rounded-xl border border-purple-500/25 shadow-lg shadow-purple-950/40">
      <div className="flex justify-between mb-2 text-xs sm:text-sm font-semibold">
        <span className="text-purple-300">
          Progress: {Math.round(progress)}% ({answeredCells}/{totalCells})
        </span>
        <span className="text-emerald-400">
          Correct: {gameState.correctAnswers.size}/{totalCells}
        </span>
      </div>
      <div className="w-full h-3 bg-[#0a0418] rounded-full overflow-hidden border border-purple-900/50">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 rounded-full"
          style={{ width: `${correctProgress}%` }}
        />
        <div
          className="h-full bg-gradient-to-r from-rose-600 to-red-500 transition-all duration-300 -mt-3"
          style={{ width: `${progress - correctProgress}%`, marginLeft: `${correctProgress}%` }}
        />
      </div>
    </div>
  );
};