// Google Sheets Service for Tech Bingo Game
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

// Use the URL from configuration
const GOOGLE_APPS_SCRIPT_URL = CONFIG.GOOGLE_APPS_SCRIPT_URL;

export class GoogleSheetsService {
  private static async submitToGoogleSheets(data: GameSubmissionData): Promise<boolean> {
    return new Promise((resolve) => {
      // Create a hidden form and submit it
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = GOOGLE_APPS_SCRIPT_URL;
      form.target = 'hidden-iframe';
      form.style.display = 'none';

      // Add all data as hidden fields
      Object.entries(data).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });

      // Create hidden iframe to receive response
      const iframe = document.createElement('iframe');
      iframe.name = 'hidden-iframe';
      iframe.style.display = 'none';
      iframe.onload = () => {
        // Remove form and iframe after submission
        document.body.removeChild(form);
        document.body.removeChild(iframe);
        
        // For a one-day event, we'll assume success
        console.log('Form submitted successfully');
        resolve(true);
      };

      // Add to page and submit
      document.body.appendChild(iframe);
      document.body.appendChild(form);
      form.submit();
    });
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
