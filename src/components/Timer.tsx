import React, { useEffect } from 'react';
import { Timer as TimerIcon } from 'lucide-react';

interface TimerProps {
  timeLeft: number;
  setTimeLeft: (time: number) => void;
  onTimeUp: () => void;
}

export const Timer: React.FC<TimerProps> = ({ timeLeft, setTimeLeft, onTimeUp }) => {
  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, setTimeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isLowTime = timeLeft <= 30;

  return (
    <div
      className={`flex items-center gap-2 text-lg sm:text-xl font-bold px-4 py-2 rounded-xl border transition-all duration-200 ${
        isLowTime
          ? 'bg-rose-950/90 border-rose-500/80 text-rose-200 animate-pulse shadow-lg shadow-rose-900/40'
          : 'bg-[#180d38] border-purple-500/40 text-purple-200 shadow-lg shadow-purple-950/60'
      }`}
    >
      <TimerIcon className={`w-5 h-5 ${isLowTime ? 'text-rose-400' : 'text-purple-400'}`} />
      <span className="font-mono tracking-wider">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
};