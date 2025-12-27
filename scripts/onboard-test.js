const fs = require('fs');
const path = require('path');

// サブモジュール存在チェック
function checkSubmodule() {
  const submodulePath = path.join(__dirname, '../.shared-workflows');
  return fs.existsSync(submodulePath);
}

// 必須ファイルチェック
function checkRequiredFiles() {
  const requiredFiles = [
    'docs/windsurf_workflow/OPEN_HERE.md',
    'docs/windsurf_workflow/ORCHESTRATOR_PROTOCOL.md',
    'AI_CONTEXT.md'
  ];
  
  return requiredFiles.every(file => {
    const filePath = path.join(__dirname, '../', file);
    return fs.existsSync(filePath);
  });
}

// オンボーディングテスト実行
function runOnboardingTest() {
  const hasSubmodule = checkSubmodule();
  const hasRequiredFiles = checkRequiredFiles();
  
  console.log('\n===== オンボーディングテスト結果 =====');
  console.log(`サブモジュール状態: ${hasSubmodule ? 'OK' : 'MISSING (フォールバック適用)'}`);
  console.log(`必須ファイル状態: ${hasRequiredFiles ? 'OK' : 'CRITICAL ERROR'}`);
  
  if (!hasRequiredFiles) {
    console.error('\nエラー: 必須ファイルが不足しています');
    process.exit(1);
  }
  
  console.log('\nオンボーディング検証完了');
}

runOnboardingTest();
