const fs = require('fs');
const path = require('path');

// Read the wrangler_template.toml file
const templatePath = path.join(__dirname, 'wrangler_template.toml');
let wranglerContent = fs.readFileSync(templatePath, 'utf8');

// Read ACCOUNT_ID from environmental variables
const accountId = process.env.ACCOUNT_ID;

if (!accountId) {
  console.error('ACCOUNT_ID is not set in the environment variables');
  process.exit(1);
}

// Replace ACCOUNT_ID in the content
wranglerContent = wranglerContent.replace('ACCOUNT_ID', `"${accountId}"`);

// Write the modified content to wrangler.toml
const outputPath = path.join(__dirname, 'wrangler.toml');
fs.writeFileSync(outputPath, wranglerContent);

console.log('wrangler.toml has been created with the updated ACCOUNT_ID');
