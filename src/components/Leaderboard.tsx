import React from 'react';
import { LeaderboardEntry } from '../types';
import { Trophy, Award, Medal, Clock } from 'lucide-react';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  onPlayAgain: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ entries, onPlayAgain }) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-amber-400" />;
      case 2:
        return <Award className="w-6 h-6 text-slate-300" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return null;
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <div className="bg-[#0e0722]/90 backdrop-blur-xl border border-purple-500/30 p-6 sm:p-8 rounded-2xl shadow-2xl shadow-purple-950/70 max-w-2xl mx-auto text-white">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-purple-300 via-purple-100 to-white bg-clip-text text-transparent">
        Leaderboard
      </h2>
      
      <div className="space-y-3 mb-6">
        {entries.map((entry) => (
          <div
            key={entry.username + entry.rank}
            className="flex items-center justify-between p-4 rounded-xl bg-[#160b33] border border-purple-900/50 hover:border-purple-500/40 transition-all"
          >
            <div className="flex items-center space-x-4">
              <span className="w-8 flex justify-center font-bold text-purple-300">
                {getRankIcon(entry.rank) || `#${entry.rank}`}
              </span>
              <span className="font-semibold text-purple-100">{entry.username}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-emerald-400">{entry.highScore} pts</span>
              {entry.timeLeft !== undefined && (
                <div className="flex items-center gap-1.5 text-xs text-purple-300/80 bg-purple-950/50 px-2.5 py-1 rounded-md border border-purple-800/40">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  <span>{formatTime(entry.timeLeft)}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={onPlayAgain}
          className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-purple-600/30 hover:shadow-purple-500/50 transition-all duration-200"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};