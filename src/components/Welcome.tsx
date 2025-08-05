import React, { useState } from 'react';
import { Brain } from 'lucide-react';

interface WelcomeProps {
  onStart: (playerName: string) => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim().length < 2) {
      setError('Please enter a valid name (minimum 2 characters)');
      return;
    }
    onStart(playerName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-12 h-12 text-indigo-600" />
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              TECH-BINGOO
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-1">
              Enter Your Name
            </label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => {
                setPlayerName(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Your name"
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg 
              hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium"
          >
            Start Game
          </button>
        </form>

        <div className="mt-8 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">How to Play</h2>
          <ul className="text-left text-gray-600 space-y-2">
            <li>1. Answer technical questions correctly to mark cells</li>
            <li>2. Complete a row, column, or diagonal to win</li>
            <li>3. Race against time to achieve the highest score</li>
            <li>4. Challenge yourself with diverse tech topics</li>
          </ul>
        </div>
      </div>
    </div>
  );
};