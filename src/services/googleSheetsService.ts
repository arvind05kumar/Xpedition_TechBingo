// Google Sheets Service for Startup Bingo Game
// This service handles sending game data to Google Sheets via Google Apps Script

export interface GameSubmissionData {
  playerName: string;
  finalScore: number;
  timeLeft: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unansweredQuestions: number;
  completedRows: number;
  completedColumns: number;
  completedDiagonals: number;
  gameDuration: number;
  questionsData: string;
  answersData: string;
  correctAnswersList: string;
  wrongAnswersList: string;
  accuracy: number;
  averageTimePerQuestion: number;
  submissionMethod: string;
  deviceInfo: string;
}

import { CONFIG } from '../config';

// Use the URLs from configuration
const GOOGLE_APPS_SCRIPT_URL = CONFIG.GOOGLE_APPS_SCRIPT_URL;

export class GoogleSheetsService {
  private static async submitToSheetDB(data: GameSubmissionData): Promise<boolean> {
    if (!CONFIG.SHEETDB_URL || CONFIG.SHEETDB_URL.trim() === '') return false;
    try {
      console.log('Sending game data to SheetDB endpoint:', CONFIG.SHEETDB_URL);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5 sec timeout max

      const response = await fetch(CONFIG.SHEETDB_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: [data] }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        console.log('Game data successfully saved to SheetDB!');
        return true;
      } else {
        const errorText = await response.text();
        console.warn('SheetDB error response:', response.status, errorText);
        return false;
      }
    } catch (err: any) {
      console.warn('SheetDB submission fast fallback triggered:', err.name || err);
      return false;
    }
  }

  private static async submitToGoogleSheets(data: GameSubmissionData): Promise<boolean> {
    // If SheetDB URL is provided, submit to SheetDB first
    if (CONFIG.SHEETDB_URL && CONFIG.SHEETDB_URL.trim() !== '') {
      const sheetDbSuccess = await this.submitToSheetDB(data);
      if (sheetDbSuccess) return true;
    }

    if (!GOOGLE_APPS_SCRIPT_URL || GOOGLE_APPS_SCRIPT_URL.trim() === '') return false;

    // Fast no-cors fetch to Apps Script with 3-second timeout
    try {
      const formData = new URLSearchParams();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString(),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return true;
    } catch (e) {
      console.warn('Google Apps Script request finished/timed out:', e);
      return true;
    }
  }



  public static async saveGameData(
    playerName: string,
    gameState: any,
    gameStartTime: number,
    submissionMethod: 'manual' | 'timeout'
  ): Promise<boolean> {
    // Check if Google Sheets integration is enabled
    if (!CONFIG.ENABLE_GOOGLE_SHEETS) {
      if (CONFIG.ENABLE_LOGGING) {
        console.log('Google Sheets integration is disabled');
      }
      return true; // Return true to avoid blocking the game
    }

    const gameEndTime = Date.now();
    const gameDuration = Math.floor((gameEndTime - gameStartTime) / 1000);
    
    const totalQuestions = gameState.board.length;
    const correctAnswersCount = gameState.correctAnswers.size;
    const wrongAnswersCount = gameState.wrongAnswers.size;
    const unansweredQuestions = totalQuestions - correctAnswersCount - wrongAnswersCount;
    
    const accuracy = totalQuestions > 0 ? (correctAnswersCount / totalQuestions) * 100 : 0;
    const averageTimePerQuestion = totalQuestions > 0 ? gameDuration / totalQuestions : 0;
    
    // Get device/browser information
    const deviceInfo = `${navigator.userAgent} | ${navigator.platform} | ${screen.width}x${screen.height}`;
    
    // Prepare detailed questions and answers data
    const questionsData = JSON.stringify(gameState.board.map((q: any, index: number) => ({
      id: q?.id,
      question: q?.question,
      correctAnswer: q?.answer,
      userAnswer: gameState.answers[index] || '',
      isCorrect: gameState.correctAnswers.has(q?.id),
      isWrong: gameState.wrongAnswers.has(q?.id),
      isUnanswered: !gameState.answers[index] && !gameState.correctAnswers.has(q?.id) && !gameState.wrongAnswers.has(q?.id)
    })));
    
    const answersData = JSON.stringify(gameState.answers);
    const correctAnswersList = Array.from(gameState.correctAnswers).join(',');
    const wrongAnswersList = Array.from(gameState.wrongAnswers).join(',');
    
    const submissionData: GameSubmissionData = {
      playerName,
      finalScore: gameState.score,
      timeLeft: gameState.timeLeft,
      totalQuestions,
      correctAnswers: correctAnswersCount,
      wrongAnswers: wrongAnswersCount,
      unansweredQuestions,
      completedRows: gameState.completedLines.rows.length,
      completedColumns: gameState.completedLines.columns.length,
      completedDiagonals: gameState.completedLines.diagonals.length,
      gameDuration,
      questionsData,
      answersData,
      correctAnswersList,
      wrongAnswersList,
      accuracy: Math.round(accuracy * 100) / 100, // Round to 2 decimal places
      averageTimePerQuestion: Math.round(averageTimePerQuestion * 100) / 100,
      submissionMethod,
      deviceInfo
    };

    if (CONFIG.ENABLE_LOGGING) {
      console.log('Submitting game data to Google Sheets:', submissionData);
    }

    return await this.submitToGoogleSheets(submissionData);
  }

  // Method to test the connection
  public static async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Error testing Google Sheets connection:', error);
      return false;
    }
  }
}
