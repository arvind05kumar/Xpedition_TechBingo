// Configuration file for Tech Bingo Game
// Update these values according to your setup

export const CONFIG = {
  // Replace this with your deployed Google Apps Script web app URL
  GOOGLE_APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxZFvaR0NqTNe-js7jPSyHhk4pOIFHT0g_gygZmyxe5zgIqFI-nv20ba81L4CBOTzRsVw/exec', // Replace with your actual web app URL
  
  // Game settings
  BOARD_SIZE: 5,
  GAME_TIME: 600, // 10 minutes in seconds
  CELL_POINTS: 10,
  
  // Feature flags
  ENABLE_GOOGLE_SHEETS: true, // Set to false to disable Google Sheets integration
  ENABLE_LOGGING: true, // Set to false to disable console logging
};
