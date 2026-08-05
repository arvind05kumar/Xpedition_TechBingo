// Configuration file for AWS Bingo Game
// Update these values according to your setup

export const CONFIG = {
  // SheetDB API URL - Paste your SheetDB API URL here (e.g., https://sheetdb.io/api/v1/YOUR_API_ID)
  SHEETDB_URL: 'https://sheetdb.io/api/v1/nz83nauts9smv',

  // Replace this with your deployed Google Apps Script web app URL (fallback)
  GOOGLE_APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycby3GgHE9A2PfqdB4HW8BZNdroTFm9t78cDgGsesFR-7MCjeCwVoJHHv8UQ3_PRFSlcyQw/exec',

  // Game settings
  BOARD_SIZE: 5,
  GAME_TIME: 180, // 3 minutes in seconds
  CELL_POINTS: 10,

  // Feature flags
  ENABLE_GOOGLE_SHEETS: true, // Set to false to disable Google Sheets integration
  ENABLE_LOGGING: true, // Set to false to disable console logging
};
