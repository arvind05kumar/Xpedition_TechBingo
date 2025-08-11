# Quick Start Guide - Tech Bingo with Google Sheets

## 🚀 Get Started in 5 Minutes

### Step 1: Create Google Sheets
1. Go to [sheets.google.com](https://sheets.google.com)
2. Create a new spreadsheet
3. Copy the spreadsheet ID from the URL (between `/d/` and `/edit`)

### Step 2: Set up Google Apps Script
1. Go to [script.google.com](https://script.google.com)
2. Create new project
3. Replace the code with contents of `google-apps-script.js`
4. Replace `YOUR_SPREADSHEET_ID_HERE` with your spreadsheet ID
5. Save project

### Step 3: Deploy Web App
1. Click "Deploy" → "New deployment"
2. Type: "Web app"
3. Execute as: "Me"
4. Who has access: "Anyone"
5. Click "Deploy"
6. Copy the web app URL

### Step 4: Update React App
1. Open `src/config.ts`
2. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with your web app URL
3. Save the file

### Step 5: Set up Headers
1. In Google Apps Script editor, run `setupHeaders()` function once
2. This creates column headers in your spreadsheet

### Step 6: Run the Game
```bash
npm install
npm run dev
```

## 📊 What Data Gets Saved

Every time a player finishes the game, this data is automatically saved:

- **Player Name** & **Timestamp**
- **Score** & **Time Remaining**
- **Correct/Wrong/Unanswered** question counts
- **Accuracy Percentage** & **Game Duration**
- **Detailed Question Analysis** (every question with user's answer)
- **Device Information** (browser, platform, screen size)
- **Submission Method** (manual vs timeout)

## 🔧 Troubleshooting

### Data not saving?
- Check browser console for errors
- Verify web app URL in `src/config.ts`
- Make sure Google Apps Script is deployed with "Anyone" access

### CORS errors?
- Ensure Google Apps Script is deployed as a web app
- Check that "Who has access" is set to "Anyone"

### Wrong spreadsheet?
- Verify spreadsheet ID in `google-apps-script.js`
- Make sure you ran `setupHeaders()` function

## 📈 Evaluation Features

Your Google Sheets will have:
- **Automatic calculations** for accuracy and timing
- **Sortable columns** for easy analysis
- **Detailed question data** for deep evaluation
- **Real-time updates** as players complete games

## 🎯 Ready to Use!

Once set up, every player's game data will be automatically saved to your Google Sheets for easy evaluation and analysis. No authentication required - just enter a name and start playing!
