// scripts/detect-project-type.js - 新規作成
const fs = require('fs');
const path = require('path');

function detectType() {
  if (fs.existsSync('package.json')) return 'web';
  if (fs.existsSync('Assets/')) return 'unity';
  return 'standard';
}

console.log(detectType());
