// scripts/detect-project-type.js - 新規作成
const fs = require('fs');
const path = require('path');

function detectType(cwd = process.cwd()) {
  if (fs.existsSync(path.join(cwd, 'package.json'))) return 'web';
  if (fs.existsSync(path.join(cwd, 'Assets'))) return 'unity';
  return 'standard';
}

module.exports = detectType;

if (require.main === module) {
  console.log(detectType());
}
