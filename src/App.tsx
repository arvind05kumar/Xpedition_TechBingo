import React, { useState, useEffect, useCallback } from 'react';
import { Timer } from './components/Timer';
import { BingoCell } from './components/BingoCell';
import { Leaderboard } from './components/Leaderboard';
import { ProgressBar } from './components/ProgressBar';
import { Welcome } from './components/Welcome';
import { sampleQuestions } from './data/questions';
import { GameState, Question, LeaderboardEntry } from './types';
import { Cloud } from 'lucide-react';
import { GoogleSheetsService } from './services/googleSheetsService';
import { isAnswerMatch } from './utils/answerMatch';

const BOARD_SIZE = 5;
const GAME_TIME = 180; // 3 minutes in seconds
// Reserved for future scoring extensions
// const ROW_POINTS = 1;
// const COLUMN_POINTS = 2;
// const DIAGONAL_POINTS = 3;
// const EARLY_SUBMISSION_POINTS = 2;
const CELL_POINTS = 10;

const initialGameState: GameState = {
  board: Array(BOARD_SIZE * BOARD_SIZE).fill(null),
  answers: {},
  correctAnswers: new Set(),
  wrongAnswers: new Set(),
  timeLeft: GAME_TIME,
  gameOver: false,
  score: 0,
  completedLines: {
    rows: [],
    columns: [],
    diagonals: []
  },
  submitted: false
};

function App() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [playerName, setPlayerName] = useState<string>('');
  const [gameStarted, setGameStarted] = useState(false);
  const [gameStartTime, setGameStartTime] = useState<number>(0);
  const [isSubmittingToSheets, setIsSubmittingToSheets] = useState(false);

  const shuffleQuestions = useCallback(() => {
    const shuffled = [...sampleQuestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, BOARD_SIZE * BOARD_SIZE)
      .map((q, id) => ({ ...q, id }));

    setGameState(prev => ({
      ...prev,
      board: shuffled,
      answers: {},
      correctAnswers: new Set(),
      wrongAnswers: new Set(),
      timeLeft: GAME_TIME,
      gameOver: false,
      score: 0,
      completedLines: { rows: [], columns: [], diagonals: [] },
      submitted: false
    }));
  }, []);

  useEffect(() => {
    if (gameStarted) {
      shuffleQuestions();
    }
  }, [gameStarted, shuffleQuestions]);

  const handleStart = (name: string) => {
    setPlayerName(name);
    setGameStarted(true);
    setGameStartTime(Date.now());
  };

  const checkLine = useCallback(() => {
    const board = gameState.board as Question[];
    const correct = gameState.correctAnswers;
    const newCompletedLines = {
      rows: [] as number[],
      columns: [] as number[],
      diagonals: [] as number[]
    };
    let hasWinningLine = false;

    for (let i = 0; i < BOARD_SIZE; i++) {
      const row = Array.from({ length: BOARD_SIZE }, (_, j) => {
        const cell = board[i * BOARD_SIZE + j];
        return cell ? cell.id : null;
      });
      if (row.every(id => id !== null && correct.has(id))) {
        hasWinningLine = true;
        if (!gameState.completedLines.rows.includes(i)) {
          newCompletedLines.rows.push(i);
        }
      }
    }

    for (let i = 0; i < BOARD_SIZE; i++) {
      const col = Array.from({ length: BOARD_SIZE }, (_, j) => {
        const cell = board[j * BOARD_SIZE + i];
        return cell ? cell.id : null;
      });
      if (col.every(id => id !== null && correct.has(id))) {
        hasWinningLine = true;
        if (!gameState.completedLines.columns.includes(i)) {
          newCompletedLines.columns.push(i);
        }
      }
    }

    const diag1 = Array.from({ length: BOARD_SIZE }, (_, i) => {
      const cell = board[i * BOARD_SIZE + i];
      return cell ? cell.id : null;
    });
    const diag2 = Array.from({ length: BOARD_SIZE }, (_, i) => {
      const cell = board[i * BOARD_SIZE + (BOARD_SIZE - 1 - i)];
      return cell ? cell.id : null;
    });

    if (diag1.every(id => id !== null && correct.has(id))) {
      hasWinningLine = true;
      if (!gameState.completedLines.diagonals.includes(0)) {
        newCompletedLines.diagonals.push(0);
      }
    }
    if (diag2.every(id => id !== null && correct.has(id))) {
      hasWinningLine = true;
      if (!gameState.completedLines.diagonals.includes(1)) {
        newCompletedLines.diagonals.push(1);
      }
    }

    return { hasWinningLine, newCompletedLines };
  }, [gameState.board, gameState.correctAnswers, gameState.completedLines]);

  const calculateScore = useCallback(() => {
    // Only cell points, no extra for rows/columns
    return gameState.correctAnswers.size * CELL_POINTS;
  }, [gameState.correctAnswers.size]);

  const handleCellClick = (index: number) => {
    if (gameState.gameOver || gameState.submitted) return;
    setSelectedCell(index);
    setCurrentAnswer(gameState.answers[index] || '');
  };

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCell === null || gameState.gameOver || gameState.submitted) return;

    const question = gameState.board[selectedCell] as Question;
    if (!question) return;

    const isCorrect = isAnswerMatch(currentAnswer, question.answer);

    setGameState(prev => ({
      ...prev,
      answers: { ...prev.answers, [selectedCell]: currentAnswer },
      correctAnswers: isCorrect ? new Set([...prev.correctAnswers, question.id]) : prev.correctAnswers,
      wrongAnswers: !isCorrect ? new Set([...prev.wrongAnswers, question.id]) : prev.wrongAnswers,
    }));

    setCurrentAnswer('');
    setSelectedCell(null);
  };

  const handleGameSubmit = async () => {
    // We still call checkLine so any completed lines are captured,
    // but we do NOT block submission if there are none.
    const { newCompletedLines } = checkLine();

    const finalScore = calculateScore();
    
    // Update game state first
    setGameState(prev => ({
      ...prev,
      gameOver: true,
      score: finalScore,
      completedLines: {
        rows: [...prev.completedLines.rows, ...newCompletedLines.rows],
        columns: [...prev.completedLines.columns, ...newCompletedLines.columns],
        diagonals: [...prev.completedLines.diagonals, ...newCompletedLines.diagonals]
      },
      submitted: true
    }));

    // Update leaderboard
    setLeaderboard(prev => {
      const newEntry = {
        username: playerName,
        highScore: finalScore,
        timeLeft: gameState.timeLeft,
        rank: 0
      };
      const newLeaderboard = [...prev, newEntry]
        .sort((a, b) => b.highScore - a.highScore)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));
      return newLeaderboard;
    });

    // Submit to Google Sheets
    setIsSubmittingToSheets(true);
    try {
      const success = await GoogleSheetsService.saveGameData(
        playerName,
        { ...gameState, score: finalScore, completedLines: newCompletedLines },
        gameStartTime,
        'manual'
      );
      
      if (success) {
        console.log('Game data saved to Google Sheets successfully!');
      } else {
        console.error('Failed to save game data to Google Sheets');
      }
    } catch (error) {
      console.error('Error saving to Google Sheets:', error);
    } finally {
      setIsSubmittingToSheets(false);
    }
  };

  if (!gameStarted) {
    return (
      <Welcome onStart={handleStart} />
    );
  }

  if (gameState.gameOver) {
    return (
      <div className="aws-bg-gradient min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="max-w-4xl mx-auto w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-300 via-purple-100 to-white bg-clip-text text-transparent mb-3">
              {gameState.timeLeft <= 0 ? "Time's Up!!!" : "Game Finished!"}
            </h1>
            <p className="text-2xl font-bold text-emerald-400 mb-4">Final Score: {gameState.score}</p>
            {isSubmittingToSheets && (
              <div className="text-purple-200 mb-4 flex items-center justify-center gap-3">
                <p>Saving your results...</p>
                <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-purple-400 border-t-transparent"></div>
              </div>
            )}
          </div>
          <Leaderboard
            entries={leaderboard}
            onPlayAgain={() => {
              shuffleQuestions();
              setGameStarted(true);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="aws-bg-gradient min-h-screen py-6 px-3 sm:py-8 sm:px-4 text-white">
      <div className="max-w-4xl w-full mx-auto bg-[#0e0722]/90 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-950/70 p-4 sm:p-6 md:p-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-purple-900/40">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-950/60 border border-purple-500/40 rounded-xl shadow-md">
              <Cloud className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-purple-300 via-purple-100 to-white bg-clip-text text-transparent">
              AWS BINGO
            </h1>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <p className="text-sm sm:text-base font-semibold text-purple-200 bg-purple-950/60 border border-purple-800/40 px-3 py-1.5 rounded-lg">
              {playerName}
            </p>
            <Timer
              timeLeft={gameState.timeLeft}
              setTimeLeft={(time) => setGameState(prev => ({ ...prev, timeLeft: time }))}
              onTimeUp={async () => {
                setGameState(prev => ({ ...prev, gameOver: true }));
                
                // Submit to Google Sheets / SheetDB on timeout
                setIsSubmittingToSheets(true);
                try {
                  const success = await GoogleSheetsService.saveGameData(
                    playerName,
                    gameState,
                    gameStartTime,
                    'timeout'
                  );
                  
                  if (success) {
                    console.log('Game data saved successfully!');
                  } else {
                    console.error('Failed to save game data');
                  }
                } catch (error) {
                  console.error('Error saving game data:', error);
                } finally {
                  setIsSubmittingToSheets(false);
                }
              }}
            />
          </div>
        </div>

        <ProgressBar gameState={gameState} />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8">
          {gameState.board.map((cell, index) => (
            <BingoCell
              key={index}
              question={cell?.question || ''}
              isCorrect={
                cell
                  ? gameState.correctAnswers.has(cell.id)
                    ? true
                    : gameState.wrongAnswers.has(cell.id)
                    ? false
                    : null
                  : null
              }
              onClick={() => handleCellClick(index)}
              isSelected={selectedCell === index}
            />
          ))}
        </div>

        <form onSubmit={handleAnswerSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label htmlFor="answer" className="block text-sm font-semibold text-purple-200 mb-1.5">
              Your Answer {selectedCell !== null && <span className="text-xs font-normal text-purple-400">(Selected Cell #{selectedCell + 1})</span>}
            </label>
            <input
              type="text"
              id="answer"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              className="mt-1 block w-full rounded-xl bg-[#160b33] border border-purple-500/40 text-white placeholder-purple-300/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400 text-base sm:text-lg py-3 sm:py-4 px-4 h-12 sm:h-14 md:h-16 transition-all"
              placeholder={selectedCell !== null ? "Type your answer here..." : "Click any Bingo cell above to answer..."}
              disabled={selectedCell === null || gameState.gameOver || gameState.submitted}
            />
          </div>
          <div className="flex gap-3 sm:gap-4">
            <button
              type="submit"
              disabled={selectedCell === null || gameState.gameOver || gameState.submitted}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 sm:py-3.5 px-3 sm:px-4 rounded-xl 
                hover:from-purple-500 hover:to-indigo-500 disabled:from-purple-950/40 disabled:to-indigo-950/40 disabled:text-purple-400/40 disabled:border disabled:border-purple-900/30
                disabled:cursor-not-allowed transition-all duration-200 font-bold text-sm sm:text-base shadow-lg shadow-purple-900/30"
            >
              Submit Answer
            </button>
            <button
              type="button"
              onClick={handleGameSubmit}
              disabled={gameState.gameOver || gameState.submitted}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 sm:py-3.5 px-3 sm:px-4 rounded-xl 
                hover:from-emerald-500 hover:to-teal-500 disabled:from-gray-800 disabled:to-gray-900 disabled:text-gray-500
                disabled:cursor-not-allowed transition-all duration-200 font-bold text-sm sm:text-base shadow-lg shadow-emerald-950/30"
            >
              Submit Game
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
