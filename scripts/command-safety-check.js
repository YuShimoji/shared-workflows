const fs = require('fs');
const path = require('path');

// 安全なコマンドパターンを定義
const SAFE_PATTERNS = [
  /^git\s+(status|log|diff|show)/,
  /^npm\s+(install|test|run\s+\w+)/,
  /^node\s+scripts\//,
  /^echo\s+/,
  /^ls\s+/,
  /^pwd$/,
  /^which\s+/,
  /^cat\s+/,
  /^grep\s+/,
  /^find\s+/,
];

// 危険なコマンドパターンを定義
const DANGEROUS_PATTERNS = [
  /^rm\s+/,
  /^del\s+/,
  /^shutdown\s+/,
  /^reboot\s+/,
  /^sudo\s+/,
  /^chmod\s+777/,
  /^curl\s+.*\|\s*bash/,
  /^wget\s+.*\|\s*bash/,
];

function isSafeCommand(command) {
  const cmd = command.trim();
  // 危険パターンにマッチしたらfalse
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(cmd)) {
      return false;
    }
  }
  // 安全パターンにマッチしたらtrue
  for (const pattern of SAFE_PATTERNS) {
    if (pattern.test(cmd)) {
      return true;
    }
  }
  // それ以外は確認が必要
  return null;
}

function main() {
  const command = process.argv[2];
  if (!command) {
    console.error('Usage: node command-safety-check.js "<command>"');
    process.exit(1);
  }

  const safe = isSafeCommand(command);
  if (safe === true) {
    console.log('SAFE: コマンドは安全と判定されました。自動実行可能です。');
    process.exit(0);
  } else if (safe === false) {
    console.log('DANGEROUS: コマンドは危険と判定されました。実行を拒否します。');
    process.exit(2);
  } else {
    console.log('UNKNOWN: コマンドの安全性が不明です。確認が必要です。');
    process.exit(1);
  }
}

module.exports = { isSafeCommand };

if (require.main === module) {
  main();
}
