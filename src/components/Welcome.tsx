import React, { useState } from 'react';
import { Cloud, Zap } from 'lucide-react';

interface WelcomeProps {
  onStart: (playerName: string) => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim().length < 2) {
      setError('Please enter a valid name or roll number (minimum 2 characters)');
      return;
    }
    onStart(playerName);
  };

  return (
    <div className="aws-bg-gradient min-h-screen py-10 px-3 sm:py-12 sm:px-4 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto bg-[#0e0722]/90 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-950/70 p-6 sm:p-8 text-white">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-purple-950/60 border border-purple-500/40 rounded-2xl mb-4 shadow-lg shadow-purple-900/40">
            <Cloud className="w-10 h-10 sm:w-12 sm:h-12 text-purple-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-purple-300 via-purple-100 to-white bg-clip-text text-transparent mb-2">
            AWS BINGO
          </h1>
          <p className="text-xs sm:text-sm text-purple-300/80 font-medium">
            Test your AWS & Cloud Tech knowledge
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div>
            <label htmlFor="playerName" className="block text-sm font-semibold text-purple-200 mb-2">
              Enter Your Roll Number / Name
            </label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => {
                setPlayerName(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 rounded-lg bg-[#160b33] border border-purple-500/40 text-white placeholder-purple-300/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200"
              placeholder="e.g. 2100123"
            />
            {error && <p className="mt-2 text-sm text-rose-400 font-medium">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white py-3.5 px-4 rounded-lg font-bold tracking-wide shadow-lg shadow-purple-600/30 hover:shadow-purple-500/50 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5 text-purple-200 fill-purple-200" />
            Start Game (3 Mins)
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-purple-900/40 text-center">
          <h2 className="text-base sm:text-lg font-semibold text-purple-200 mb-3">How to Play</h2>
          <ul className="text-left text-purple-300/90 space-y-2 text-xs sm:text-sm">
            <li className="flex items-start gap-2">
              <span className="text-purple-400 font-bold">•</span>
              <span>Answer AWS & tech questions correctly to mark cells.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 font-bold">•</span>
              <span>Complete rows, columns, or diagonals for maximum score.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 font-bold">•</span>
              <span>You have <strong>3 minutes</strong> to complete as many questions as possible!</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};