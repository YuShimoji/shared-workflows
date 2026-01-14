#!/usr/bin/env node
/**
 * テスト手順生成スクリプト
 * 
 * 用途: Workerレポートの `## Verification` セクションを解析し、
 * 手動テストと自動テストを分離して、ユーザー向けのステップバイステップ手順を生成する
 * 
 * 使用方法:
 *   node scripts/generate-test-steps.js <REPORT_PATH> [--output <path>] [--project-root <path>]
 */

const fs = require('fs');
const path = require('path');

function parseArg(flag, defaultValue) {
  const args = process.argv.slice(2);
  const index = args.indexOf(flag);
  if (index === -1) return defaultValue;
  return args[index + 1];
}

function hasFlag(flag) {
  return process.argv.slice(2).includes(flag);
}

function findProjectRoot(startPath = process.cwd()) {
  let current = path.resolve(startPath);
  while (current !== path.dirname(current)) {
    if (fs.existsSync(path.join(current, 'docs', 'tasks'))) {
      return current;
    }
    current = path.dirname(current);
  }
  return startPath;
}

function parseReport(reportPath) {
  try {
    const content = fs.readFileSync(reportPath, 'utf8');
    const lines = content.split(/\r?\n/);
    
    const report = {
      ticket: null,
      timestamp: null,
      actor: null,
      verification: {
        manual: [],
        automated: []
      }
    };
    
    let inVerificationSection = false;
    let currentStep = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // メタ情報の抽出
      if (line.startsWith('**Ticket**:')) {
        report.ticket = line.split(':')[1].trim();
      } else if (line.startsWith('**Timestamp**:')) {
        report.timestamp = line.split(':')[1].trim();
      } else if (line.startsWith('**Actor**:')) {
        report.actor = line.split(':')[1].trim();
      }
      
      // Verificationセクションの解析
      if (line === '## Verification' || line === '## 検証') {
        inVerificationSection = true;
        continue;
      }
      
      if (inVerificationSection && line.startsWith('##')) {
        break;
      }
      
      if (inVerificationSection) {
        // `<cmd>=<result>` 形式の検出（`node scripts/...` や `git status` など）
        const cmdMatch = line.match(/^[-*]\s*`([^`]+)`(?:[:=]|\s+→)?\s*(.+)$/);
        if (cmdMatch) {
          const cmd = cmdMatch[1];
          const result = cmdMatch[2].trim();
          
          // 手動テストか自動テストかの判定
          // ユーザー操作が必要なコマンド（例: sw-doctor, ブラウザ操作など）は手動
          // スクリプト実行（例: report-validator, finalize-phase）は自動
          const isManual = isManualTest(cmd);
          
          if (isManual) {
            report.verification.manual.push({
              cmd: cmd,
              result: result,
              estimatedTime: estimateTime(cmd)
            });
          } else {
            report.verification.automated.push({
              cmd: cmd,
              result: result
            });
          }
        }
        
        // 実装内容の確認などの手動確認項目
        if (line.includes('実装内容の確認') || line.includes('動作確認') || line.includes('手動')) {
          report.verification.manual.push({
            cmd: line,
            result: '（手動確認が必要）',
            estimatedTime: 3
          });
        }
        
        // ステップ形式の検出（例: "### ステップ1: ..."）
        const stepMatch = line.match(/^###\s*(ステップ\d+|Step\s*\d+):\s*(.+)$/i);
        if (stepMatch) {
          currentStep = {
            number: stepMatch[1],
            title: stepMatch[2],
            instructions: [],
            expectedResult: null
          };
          report.verification.manual.push(currentStep);
        }
        
        // ステップ内の指示の検出
        if (currentStep && line.match(/^\d+\./)) {
          currentStep.instructions.push(line);
        }
        
        // 期待される結果の検出
        if (currentStep && (line.includes('期待') || line.includes('Expected'))) {
          currentStep.expectedResult = line;
        }
      }
    }
    
    return report;
  } catch (error) {
    console.error(`Error parsing ${reportPath}: ${error.message}`);
    return null;
  }
}

function isManualTest(cmd) {
  // 手動テストの判定ロジック
  // ユーザー操作が必要なコマンドを手動テストと判定
  
  const manualKeywords = [
    'sw-doctor',
    'sw-update-check',
    'apply-cursor-rules',
    'session-end-check',
    'ブラウザ',
    'ブラウザ操作',
    'UI',
    '画面',
    '手動',
    'manual',
    'git status', // git status は手動確認が必要
    '確認',
    '検証'
  ];
  
  const automatedKeywords = [
    'report-validator',
    'finalize-phase',
    'orchestrator-audit',
    'git commit',
    'git push',
    'npm',
    'test',
    'jest',
    'mocha'
  ];
  
  const lowerCmd = cmd.toLowerCase();
  
  // 手動テストキーワードが含まれている場合は手動
  if (manualKeywords.some(keyword => lowerCmd.includes(keyword))) {
    return true;
  }
  
  // 自動テストキーワードが含まれている場合は自動
  if (automatedKeywords.some(keyword => lowerCmd.includes(keyword))) {
    return false;
  }
  
  // git status は手動
  if (lowerCmd.includes('git status')) {
    return true;
  }
  
  // デフォルトは手動テスト（ユーザー確認が必要なコマンドが多いため）
  return true;
}

function estimateTime(cmd) {
  // コマンドから所要時間を推定（分単位）
  const lowerCmd = cmd.toLowerCase();
  
  if (lowerCmd.includes('sw-doctor')) {
    return 2;
  } else if (lowerCmd.includes('sw-update-check')) {
    return 1;
  } else if (lowerCmd.includes('apply-cursor-rules')) {
    return 1;
  } else if (lowerCmd.includes('session-end-check')) {
    return 1;
  } else if (lowerCmd.includes('ブラウザ') || lowerCmd.includes('ui')) {
    return 5;
  } else {
    return 2; // デフォルト
  }
}

function generateTestSteps(report, projectRoot) {
  const now = new Date();
  const timestamp = now.toISOString().replace(/T/, ' ').substring(0, 19) + '+09:00';
  
  const taskId = report.ticket ? path.basename(report.ticket, '.md') : 'UNKNOWN';
  const totalTime = report.verification.manual.reduce((sum, item) => {
    return sum + (item.estimatedTime || 2);
  }, 0);
  
  const lines = [];
  
  lines.push('# 手動テスト手順（ユーザー実行）');
  lines.push('');
  lines.push('## 概要');
  lines.push(`- 対象タスク: ${taskId}`);
  lines.push(`- 推定所要時間: ${totalTime}分`);
  lines.push(`- 実行者: ユーザー`);
  lines.push(`- 生成日時: ${timestamp}`);
  lines.push('');
  
  // 手動テストステップ
  if (report.verification.manual.length > 0) {
    let stepNumber = 1;
    for (const item of report.verification.manual) {
      if (item.cmd) {
        // コマンド形式
        lines.push(`## ステップ${stepNumber}: ${item.cmd}（所要時間: ${item.estimatedTime || 2}分）`);
        lines.push(`1. \`${item.cmd}\` を実行`);
        lines.push(`2. 期待される結果: ${item.result}`);
        lines.push('');
        stepNumber++;
      } else if (item.title) {
        // ステップ形式（既に構造化されている）
        lines.push(`## ステップ${stepNumber}: ${item.title}`);
        if (item.instructions.length > 0) {
          for (const instruction of item.instructions) {
            lines.push(instruction);
          }
        }
        if (item.expectedResult) {
          lines.push(`期待される結果: ${item.expectedResult}`);
        }
        lines.push('');
        stepNumber++;
      }
    }
  } else {
    lines.push('## 手動テストステップ');
    lines.push('');
    lines.push('（手動テストステップは検出されませんでした）');
    lines.push('');
  }
  
  // 自動テスト結果
  if (report.verification.automated.length > 0) {
    lines.push('## 自動テスト結果（AI実行済み）');
    lines.push('');
    for (const item of report.verification.automated) {
      const status = item.result.includes('✅') || item.result.includes('PASS') || item.result.includes('OK') ? '✅ PASS' : '❌ FAIL';
      lines.push(`- \`${item.cmd}\`: ${status}`);
    }
    lines.push('');
  }
  
  // 注意事項
  lines.push('## 注意事項');
  lines.push('');
  lines.push('- 各ステップを順番に実行してください');
  lines.push('- エラーが発生した場合は、エラーメッセージを記録してください');
  lines.push('- 環境依存の情報がある場合は、事前に確認してください');
  lines.push('');
  
  return lines.join('\n');
}

function main() {
  const reportPath = process.argv[2];
  if (!reportPath) {
    console.error('Usage: node scripts/generate-test-steps.js <REPORT_PATH> [--output <path>] [--project-root <path>]');
    process.exit(1);
  }
  
  if (!fs.existsSync(reportPath)) {
    console.error(`Report file not found: ${reportPath}`);
    process.exit(1);
  }
  
  const projectRoot = parseArg('--project-root', null) || findProjectRoot();
  const outputPath = parseArg('--output', path.join(projectRoot, 'docs', `TEST_MANUAL_${path.basename(reportPath, '.md')}.md`));
  
  console.log(`Report path: ${reportPath}`);
  console.log(`Output path: ${outputPath}`);
  
  // レポートを解析
  const report = parseReport(reportPath);
  if (!report) {
    console.error('Failed to parse report');
    process.exit(1);
  }
  
  // テスト手順を生成
  const testSteps = generateTestSteps(report, projectRoot);
  
  // 出力
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  fs.writeFileSync(outputPath, testSteps, 'utf8');
  
  console.log(`Test steps generated: ${outputPath}`);
  console.log(`Manual tests: ${report.verification.manual.length}`);
  console.log(`Automated tests: ${report.verification.automated.length}`);
}

if (require.main === module) {
  main();
}

module.exports = { parseReport, generateTestSteps, isManualTest, estimateTime };
