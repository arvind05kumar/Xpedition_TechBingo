#!/usr/bin/env node

/**
 * Setup script for Startup Bingo Google Sheets Integration
 * This script helps you configure the Google Apps Script URL
 */

const fs = require('fs');
const path = require('path');

console.log('🎯 Startup Bingo Google Sheets Setup\n');

// Check if config file exists
const configPath = path.join(__dirname, 'src', 'config.ts');
const servicePath = path.join(__dirname, 'src', 'services', 'googleSheetsService.ts');

if (!fs.existsSync(configPath)) {
  console.error('❌ Config file not found. Please make sure you have the correct file structure.');
  process.exit(1);
}

// Read current config
let configContent = fs.readFileSync(configPath, 'utf8');

console.log('📋 Current Configuration:');
console.log('========================');

// Extract current URL
const urlMatch = configContent.match(/GOOGLE_APPS_SCRIPT_URL:\s*['"`]([^'"`]*)['"`]/);
const currentUrl = urlMatch ? urlMatch[1] : 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

console.log(`🔗 Google Apps Script URL: ${currentUrl}`);
console.log(`📊 Google Sheets Integration: ${configContent.includes('ENABLE_GOOGLE_SHEETS: true') ? '✅ Enabled' : '❌ Disabled'}`);
console.log(`📝 Logging: ${configContent.includes('ENABLE_LOGGING: true') ? '✅ Enabled' : '❌ Disabled'}`);

console.log('\n📝 Setup Instructions:');
console.log('====================');
console.log('1. Create a Google Sheets spreadsheet');
console.log('2. Go to script.google.com and create a new project');
console.log('3. Copy the contents of google-apps-script.js into your project');
console.log('4. Replace YOUR_SPREADSHEET_ID_HERE with your spreadsheet ID');
console.log('5. Deploy as a web app with "Anyone" access');
console.log('6. Copy the web app URL and update it in src/config.ts');
console.log('7. Run the setupHeaders() function in Google Apps Script once');

console.log('\n🔧 Manual Configuration:');
console.log('=======================');
console.log('Edit src/config.ts to update the Google Apps Script URL');
console.log('Edit google-apps-script.js to update the spreadsheet ID');

console.log('\n✅ Setup complete! Run "npm run dev" to start the game.');

// Check if URL is still the default
if (currentUrl === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
  console.log('\n⚠️  Warning: You still need to configure your Google Apps Script URL!');
  console.log('   Update src/config.ts with your deployed web app URL.');
}
