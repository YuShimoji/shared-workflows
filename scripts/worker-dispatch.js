#!/usr/bin/env node
/**
 * worker-dispatch.js
 *
 * チケットパスを引数に取り、WORKER_PROMPT_TEMPLATE ベースで
 * Worker 起動用プロンプトを自動生成する。
 *
 * Usage:
 *   node scripts/worker-dispatch.js --ticket docs/tasks/TASK_007.md
 *   node scripts/worker-dispatch.js --ticket docs/tasks/TASK_007.md --unity
 *   node scripts/worker-dispatch.js --ticket docs/tasks/TASK_007.md --dry-run
 *   node scripts/worker-dispatch.js --ticket docs/tasks/TASK_007.md --output docs/inbox/WORKER_PROMPT_TASK_007.md
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// --- Argument parsing ---
const args = process.argv.slice(2);
const flags = {};
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--ticket' && args[i + 1]) {
    flags.ticket = args[++i];
  } else if (args[i] === '--unity') {
    flags.unity = true;
  } else if (args[i] === '--dry-run') {
    flags.dryRun = true;
  } else if (args[i] === '--output' && args[i + 1]) {
    flags.output = args[++i];
  } else if (args[i] === '--help' || args[i] === '-h') {
    console.log(`Usage: node worker-dispatch.js --ticket <TICKET_PATH> [--unity] [--dry-run] [--output <PATH>]

Options:
  --ticket <PATH>   チケットファイルのパス (必須)
  --unity           Unity版テンプレートを使用
  --dry-run         生成内容の表示のみ（クリップボードにコピーしない）
  --output <PATH>   生成したプロンプトをファイルに保存
  --help, -h        ヘルプ表示`);
    process.exit(0);
  }
}

if (!flags.ticket) {
  console.error('Error: --ticket <TICKET_PATH> is required.');
  process.exit(1);
}

// --- Resolve paths ---
const scriptDir = __dirname;
const repoRoot = path.resolve(scriptDir, '..');

function resolveFromProject(relPath) {
  // Try project root first, then shared-workflows submodule path
  const candidates = [
    path.resolve(process.cwd(), relPath),
    path.resolve(process.cwd(), '.shared-workflows', relPath),
    path.resolve(repoRoot, relPath),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

// --- Read ticket ---
const ticketPath = resolveFromProject(flags.ticket);
if (!ticketPath) {
  console.error(`Error: Ticket not found: ${flags.ticket}`);
  process.exit(1);
}
const ticketContent = fs.readFileSync(ticketPath, 'utf8');

// --- Parse ticket fields ---
function extractField(content, fieldName) {
  const regex = new RegExp(`^${fieldName}:\\s*(.+)$`, 'mi');
  const match = content.match(regex);
  return match ? match[1].trim() : '';
}

function extractSection(content, sectionName) {
  const regex = new RegExp(`^## ${sectionName}\\s*\\n([\\s\\S]*?)(?=^## |$)`, 'mi');
  const match = content.match(regex);
  return match ? match[1].trim() : '';
}

const ticket = {
  status: extractField(ticketContent, 'Status'),
  tier: extractField(ticketContent, 'Tier'),
  branch: extractField(ticketContent, 'Branch'),
  owner: extractField(ticketContent, 'Owner'),
  report: extractField(ticketContent, 'Report'),
  objective: extractSection(ticketContent, 'Objective'),
  context: extractSection(ticketContent, 'Context'),
  focusArea: extractSection(ticketContent, 'Focus Area'),
  forbiddenArea: extractSection(ticketContent, 'Forbidden Area'),
  constraints: extractSection(ticketContent, 'Constraints'),
  dod: extractSection(ticketContent, 'DoD'),
  notes: extractSection(ticketContent, 'Notes'),
};

// --- Determine template ---
const templateRelPath = flags.unity
  ? 'docs/windsurf_workflow/WORKER_PROMPT_TEMPLATE_UNITY.md'
  : 'docs/windsurf_workflow/WORKER_PROMPT_TEMPLATE.md';

// // const templatePath = resolveFromProject(templateRelPath);

// --- Derive report target ---
const ticketBasename = path.basename(flags.ticket, '.md');
// // const taskId = ticketBasename.replace(/^TASK_/, '');
const isoDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
const reportTarget = `docs/inbox/REPORT_${ticketBasename}_${isoDate}.md`;

// --- Generate prompt ---
const prompt = `# Worker Prompt: ${ticketBasename}

## 参照
- チケット: ${flags.ticket}
- SSOT: docs/Windsurf_AI_Collab_Rules_latest.md（無ければ .shared-workflows/docs/ を参照）
- HANDOVER: docs/HANDOVER.md
- Worker Metaprompt: .shared-workflows/prompts/every_time/WORKER_METAPROMPT.txt

## 前提
- Tier: ${ticket.tier || '<未設定>'}
- Branch: ${ticket.branch || '<未設定>'}
- Report Target: ${reportTarget}
- GitHubAutoApprove: docs/HANDOVER.md の記述を参照

## 境界
- Focus Area: ${ticket.focusArea || '<未設定>'}
- Forbidden Area: ${ticket.forbiddenArea || '<未設定>'}

## 目的
${ticket.objective || '<チケットに記載なし>'}

## DoD
${ticket.dod || '<チケットに記載なし>'}

## 制約
${ticket.constraints || '<チケットに記載なし>'}

## 停止条件
- Forbidden Area に触れないと解決できない
- 仕様仮定が3件以上
- 依存追加 / 外部通信が必要で GitHubAutoApprove=true が未確認
- 破壊的操作が必要
- SSOT が取得できない${flags.unity ? `
- Unity固有: ProjectSettings/, Packages/ の変更が必要
- Unity固有: Unity Editor起動が必要な長時間待機` : ''}

## 納品先
- ${reportTarget}

---
Worker Metaprompt の Phase 0〜Phase 4 に従って実行してください。
チャット報告は固定3セクション（結果 / 変更マップ / 次の選択肢）で出力してください。
`;

// --- Output ---
console.log('--- Generated Worker Prompt ---');
console.log(prompt);
console.log('-------------------------------');

if (flags.output) {
  const outputPath = path.resolve(process.cwd(), flags.output);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, prompt, 'utf8');
  console.log(`Saved to: ${flags.output}`);
}

if (!flags.dryRun && !flags.output) {
  // Try to copy to clipboard
  try {
    if (process.platform === 'win32') {
      execSync('clip', { input: prompt });
      console.log('Copied to clipboard (clip).');
    } else if (process.platform === 'darwin') {
      execSync('pbcopy', { input: prompt });
      console.log('Copied to clipboard (pbcopy).');
    } else {
      // Linux: try xclip
      execSync('xclip -selection clipboard', { input: prompt });
      console.log('Copied to clipboard (xclip).');
    }
  } catch {
    console.log('Clipboard copy failed. Use --output to save to file instead.');
  }
}

if (flags.dryRun) {
  console.log('(dry-run: clipboard copy skipped)');
}
