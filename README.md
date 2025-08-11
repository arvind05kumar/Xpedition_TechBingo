# Tech Bingo Game with Google Sheets Integration

A React-based tech bingo game that automatically saves all player data to Google Sheets for easy evaluation and analysis.

## Features

- **No Authentication Required**: Simple player name entry to start the game
- **Comprehensive Data Collection**: Saves detailed game metrics including:
  - Player name and timestamp
  - Final score and time remaining
  - Correct/wrong/unanswered questions count
  - Completed rows, columns, and diagonals
  - Game duration and accuracy percentage
  - Detailed question-by-question analysis
  - Device and browser information
- **Automatic Submission**: Data is saved both on manual submission and timeout
- **Real-time Evaluation**: All data is instantly available in Google Sheets

## Setup Instructions

### 1. Create Google Sheets

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Note down the spreadsheet ID from the URL (the long string between `/d/` and `/edit`)

### 2. Set up Google Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Create a new project
3. Replace the default code with the contents of `google-apps-script.js`
4. Replace `YOUR_SPREADSHEET_ID_HERE` with your actual spreadsheet ID
5. Save the project with a name like "Tech Bingo Data Collector"

### 3. Deploy as Web App

1. Click on "Deploy" → "New deployment"
2. Choose "Web app" as the type
3. Set "Execute as" to "Me"
4. Set "Who has access" to "Anyone"
5. Click "Deploy"
6. Copy the web app URL that's generated

### 4. Update the React App

1. Open `src/services/googleSheetsService.ts`
2. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with your deployed web app URL
3. Save the file

### 5. Set up Spreadsheet Headers

1. In your Google Apps Script editor, run the `setupHeaders()` function once
2. This will create the column headers in your spreadsheet

### 6. Install Dependencies and Run

```bash
npm install
npm run dev
```

## Data Collected

The game automatically saves the following data for each player:

| Column | Description |
|--------|-------------|
| Timestamp | When the game was completed |
| Player Name | Name entered by the player |
| Final Score | Total points earned |
| Time Left | Seconds remaining when game ended |
| Total Questions | Number of questions in the game |
| Correct Answers | Number of correct responses |
| Wrong Answers | Number of incorrect responses |
| Unanswered Questions | Number of questions not attempted |
| Completed Rows | Number of completed horizontal lines |
| Completed Columns | Number of completed vertical lines |
| Completed Diagonals | Number of completed diagonal lines |
| Game Duration | Total time spent playing (seconds) |
| Questions Data | Detailed JSON with each question and answer |
| Answers Data | JSON object of all player answers |
| Correct Answers List | Comma-separated list of correct answer IDs |
| Wrong Answers List | Comma-separated list of wrong answer IDs |
| Accuracy | Percentage of correct answers |
| Average Time Per Question | Average seconds per question |
| Submission Method | How game ended (manual/timeout) |
| Device Info | Browser and device information |

## Evaluation Features

### Automatic Calculations
- **Accuracy Percentage**: (Correct Answers / Total Questions) × 100
- **Average Time Per Question**: Total game time / Number of questions
- **Completion Rate**: Percentage of questions attempted
- **Line Completion**: Tracks bingo line achievements

### Easy Analysis
- Sort by score, accuracy, or time
- Filter by submission method
- Export data for further analysis
- Create charts and graphs in Google Sheets

## Game Rules

- 5×5 bingo grid with tech questions
- 10 minutes time limit
- 10 points per correct answer
- Players can submit answers individually or submit the entire game
- Game ends automatically when time runs out

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your Google Apps Script is deployed as a web app with "Anyone" access
2. **Data Not Saving**: Check the browser console for error messages
3. **Wrong Spreadsheet**: Verify the spreadsheet ID in the Google Apps Script code

### Testing the Connection

The app includes a test function. You can test the Google Sheets connection by calling:
```javascript
GoogleSheetsService.testConnection()
```

## Security Notes

- No authentication required for players
- All data is publicly accessible via the Google Apps Script URL
- Consider implementing rate limiting if needed
- Data is stored in your Google account

## Customization

### Adding New Questions
Edit `src/data/questions.ts` to add or modify questions.

### Changing Game Parameters
Modify constants in `src/App.tsx`:
- `BOARD_SIZE`: Grid size (default: 5)
- `GAME_TIME`: Time limit in seconds (default: 600)
- `CELL_POINTS`: Points per correct answer (default: 10)

### Modifying Data Collection
Edit `src/services/googleSheetsService.ts` to add or remove data fields.

## License

This project is open source and available under the MIT License.
