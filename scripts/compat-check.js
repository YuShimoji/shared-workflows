#!/usr/bin/env node
/**
 * compat-check.js — 互換性ゲート（Breaking Change 検知）
 *
 * 親プロジェクトが依存する重要ファイル/ディレクトリの存在を検証し、
 * サブモジュール更新時に破壊的変更を早期検知する。
 *
 * Usage:
 *   node scripts/compat-check.js [--format text|json] [--manifest <path>]
 *
 * Exit codes:
 *   0 = all critical paths present
 *   1 = one or more critical paths missing (breaking change detected)
 */

const fs = require('fs');
const path = require('path');

// ---------- デフォルトマニフェスト ----------
// severity: "critical" = 欠損時に exit 1, "recommended" = 警告のみ
const DEFAULT_MANIFEST = [
  // prompts — 親プロジェクトが毎回参照
  { path: 'prompts/every_time/ORCHESTRATOR_DRIVER.txt', severity: 'critical' },
  { path: 'prompts/every_time/WORKER_METAPROMPT.txt',   severity: 'critical' },
  { path: 'prompts/first_time/PROJECT_KICKSTART.txt',   severity: 'critical' },
  { path: 'prompts/global/WINDSURF_GLOBAL_RULES.txt',   severity: 'critical' },

  // data — 表示ポリシー SSOT
  { path: 'data/presentation.json', severity: 'critical' },

  // docs — 協調開発ルール SSOT
  { path: 'docs/Windsurf_AI_Collab_Rules_latest.md', severity: 'critical' },
  { path: 'docs/windsurf_workflow/EVERY_SESSION.md',  severity: 'critical' },
  { path: 'docs/windsurf_workflow/OPEN_HERE.md',      severity: 'critical' },

  // scripts — 運用で頻繁に呼ばれるもの
  { path: 'scripts/sw-doctor.js',          severity: 'critical' },
  { path: 'scripts/ensure-ssot.js',        severity: 'critical' },
  { path: 'scripts/sw-update-check.js',    severity: 'recommended' },
  { path: 'scripts/report-validator.js',   severity: 'recommended' },
  { path: 'scripts/orchestrator-audit.js', severity: 'recommended' },

  // templates — 親プロジェクトのオンボーディング
  { path: 'templates/TASK_TICKET_TEMPLATE.md', severity: 'recommended' },
  { path: 'templates/DESIGN_PRINCIPLES.md',    severity: 'recommended' },

  // config
  { path: '.editorconfig',  severity: 'recommended' },
  { path: '.gitattributes', severity: 'recommended' },
];

// ---------- CLI パース ----------
function parseArgs(argv) {
  const args = argv.slice(2);
  const opts = { format: 'text', manifestPath: null };
  for (let i = 0; i < args.length; i++) {
    if ((args[i] === '--format' || args[i] === '-f') && args[i + 1]) {
      opts.format = args[i + 1]; i++;
    } else if (args[i].startsWith('--format=')) {
      opts.format = args[i].split('=')[1];
    } else if (args[i] === '--manifest' && args[i + 1]) {
      opts.manifestPath = args[i + 1]; i++;
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log(`Usage: node compat-check.js [--format text|json] [--manifest <path>]

Options:
  --format   Output format: text (default) or json
  --manifest Path to a custom manifest JSON file (array of {path, severity})
  --help     Show this help
`);
      process.exit(0);
    }
  }
  if (!['text', 'json'].includes(opts.format)) opts.format = 'text';
  return opts;
}

// ---------- マニフェスト読み込み ----------
function loadManifest(manifestPath) {
  if (!manifestPath) return DEFAULT_MANIFEST;
  try {
    const raw = fs.readFileSync(manifestPath, 'utf8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error('manifest must be a JSON array');
    return parsed.map(item => ({
      path: item.path,
      severity: item.severity || 'critical',
    }));
  } catch (e) {
    console.error(`Failed to load manifest: ${e.message}`);
    process.exit(2);
  }
}

// ---------- チェック実行 ----------
function runCheck(swRoot, manifest) {
  const results = [];
  let criticalMissing = 0;
  let recommendedMissing = 0;

  for (const entry of manifest) {
    const fullPath = path.join(swRoot, entry.path);
    const exists = fs.existsSync(fullPath);
    const status = exists ? 'OK' : 'MISSING';

    if (!exists) {
      if (entry.severity === 'critical') criticalMissing++;
      else recommendedMissing++;
    }

    results.push({
      path: entry.path,
      severity: entry.severity,
      status,
    });
  }

  return { results, criticalMissing, recommendedMissing };
}

// ---------- 出力 ----------
function printText(checkResult) {
  console.log('=== shared-workflows Compatibility Check ===\n');

  const critical = checkResult.results.filter(r => r.severity === 'critical');
  const recommended = checkResult.results.filter(r => r.severity === 'recommended');

  console.log('--- Critical Paths ---');
  for (const r of critical) {
    const icon = r.status === 'OK' ? 'OK' : 'MISSING';
    console.log(`  [${icon}] ${r.path}`);
  }

  console.log('\n--- Recommended Paths ---');
  for (const r of recommended) {
    const icon = r.status === 'OK' ? 'OK' : 'MISSING';
    console.log(`  [${icon}] ${r.path}`);
  }

  console.log('');
  if (checkResult.criticalMissing > 0) {
    console.log(`FAIL: ${checkResult.criticalMissing} critical path(s) missing — this is a BREAKING CHANGE.`);
    console.log('  親プロジェクトの更新前にこれらのパスを復元するか、メジャーバージョンを上げてください。');
  } else if (checkResult.recommendedMissing > 0) {
    console.log(`WARN: ${checkResult.recommendedMissing} recommended path(s) missing — minor impact.`);
  } else {
    console.log('PASS: All paths present. Safe to update submodule.');
  }
}

function printJson(checkResult) {
  const payload = {
    compatible: checkResult.criticalMissing === 0,
    summary: {
      total: checkResult.results.length,
      criticalMissing: checkResult.criticalMissing,
      recommendedMissing: checkResult.recommendedMissing,
    },
    results: checkResult.results,
  };
  process.stdout.write(JSON.stringify(payload, null, 2) + '\n');
}

// ---------- main ----------
function main() {
  const opts = parseArgs(process.argv);
  const swRoot = path.resolve(__dirname, '..');
  const manifest = loadManifest(opts.manifestPath);

  const checkResult = runCheck(swRoot, manifest);

  if (opts.format === 'json') {
    printJson(checkResult);
  } else {
    printText(checkResult);
  }

  process.exit(checkResult.criticalMissing > 0 ? 1 : 0);
}

if (require.main === module) {
  main();
}

module.exports = { runCheck, loadManifest, DEFAULT_MANIFEST };
