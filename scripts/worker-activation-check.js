const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function parseArg(flag, defaultValue = null) {
  const args = process.argv.slice(2);
  const idx = args.indexOf(flag);
  if (idx === -1) return defaultValue;
  const value = args[idx + 1];
  if (!value || value.startsWith('--')) return defaultValue;
  return value;
}

function hasFlag(flag) {
  return process.argv.slice(2).includes(flag);
}

function fileExists(p) {
  if (!p) return false;
  try {
    return fs.existsSync(p);
  } catch {
    return false;
  }
}

function runGit(args) {
  return spawnSync('git', args, { encoding: 'utf8' });
}

function normalizePath(p) {
  return p.replace(/\\/g, '/');
}

function listTaskFiles(tasksDir) {
  try {
    return fs
      .readdirSync(tasksDir)
      .filter((name) => /^TASK_.*\.md$/i.test(name))
      .map((name) => path.join(tasksDir, name));
  } catch {
    return [];
  }
}

function parseTaskStatus(taskPath) {
  try {
    const text = fs.readFileSync(taskPath, 'utf8');
    const m = text.match(/^Status:\s*(.+)$/m);
    return m ? m[1].trim().toUpperCase() : '';
  } catch {
    return '';
  }
}

function main() {
  if (hasFlag('--help')) {
    console.log('Usage: node scripts/worker-activation-check.js [options]');
    console.log('');
    console.log('Options:');
    console.log('  --ticket <path>         Target ticket (docs/tasks/TASK_*.md)');
    console.log('  --worker-prompt <path>  Target worker prompt (docs/inbox/WORKER_PROMPT_*.md)');
    console.log('  --project-root <path>   Project root (default: cwd)');
    return;
  }

  const projectRoot = path.resolve(parseArg('--project-root', process.cwd()));

  const ticketArg = parseArg('--ticket', null);
  const workerPromptArg = parseArg('--worker-prompt', null);
  const ticketPath = ticketArg ? path.resolve(projectRoot, ticketArg) : null;
  const workerPromptPath = workerPromptArg ? path.resolve(projectRoot, workerPromptArg) : null;

  const blockers = [];
  const warnings = [];

  const inside = runGit(['rev-parse', '--is-inside-work-tree']);
  if (inside.status !== 0 || inside.stdout.trim() !== 'true') {
    warnings.push('git worktree ではありません（git状態の検証をスキップ）。');
  } else {
    const unmerged = runGit(['diff', '--name-only', '--diff-filter=U']);
    if (unmerged.status === 0 && unmerged.stdout.trim().length > 0) {
      blockers.push('Unmerged paths が検出されました（git diff --diff-filter=U）。');
    }

    const markers = runGit(['grep', '-nE', '^(<<<<<<<|=======|>>>>>>>)']);
    if (markers.status === 0) {
      blockers.push('Conflict markers が検出されました（<<<<<<< / ======= / >>>>>>>）。');
    }

    const status = runGit(['status', '--porcelain']);
    if (status.status === 0 && status.stdout.trim().length > 0) {
      warnings.push('未コミット差分があります（起動は可能だが、差分の扱いをチケットに明記推奨）。');
    }
  }

  if (ticketPath && !fileExists(ticketPath)) {
    blockers.push(`チケットが存在しません: ${normalizePath(path.relative(projectRoot, ticketPath))}`);
  }

  if (workerPromptPath && !fileExists(workerPromptPath)) {
    blockers.push(`Worker Prompt が存在しません: ${normalizePath(path.relative(projectRoot, workerPromptPath))}`);
  }

  const tasksDir = path.join(projectRoot, 'docs', 'tasks');
  const taskFiles = listTaskFiles(tasksDir);
  const activeStatuses = new Set(['OPEN', 'IN_PROGRESS', 'BLOCKED']);
  const activeTasks = taskFiles
    .map((p) => ({ p, status: parseTaskStatus(p) }))
    .filter((t) => activeStatuses.has(t.status));

  const inProgress = activeTasks.filter((t) => t.status === 'IN_PROGRESS');
  if (inProgress.length > 1) {
    warnings.push(`IN_PROGRESS が複数あります (${inProgress.length})。起動は可能だが、担当境界の再確認を推奨。`);
  }

  const inboxDir = path.join(projectRoot, 'docs', 'inbox');
  try {
    const inboxReports = fs
      .readdirSync(inboxDir)
      .filter((name) => /^REPORT_.*\.md$/i.test(name));
    if (inboxReports.length > 0) {
      warnings.push(`docs/inbox に REPORT が残っています (${inboxReports.length})。統合/アーカイブは Worker タスクとして切り出し可。`);
    }
  } catch {
    warnings.push('docs/inbox が存在しません。必要なら作成してください。');
  }

  const go = blockers.length === 0;
  console.log('Worker Activation Check');
  console.log(`- ProjectRoot: ${normalizePath(projectRoot)}`);
  if (ticketArg) console.log(`- Ticket: ${ticketArg}`);
  if (workerPromptArg) console.log(`- WorkerPrompt: ${workerPromptArg}`);
  console.log('');

  if (go) {
    console.log('Result: GO');
  } else {
    console.log('Result: NO-GO');
  }

  if (blockers.length > 0) {
    console.log('\nBlockers:');
    blockers.forEach((b) => console.log(`- ${b}`));
  }

  if (warnings.length > 0) {
    console.log('\nWarnings:');
    warnings.forEach((w) => console.log(`- ${w}`));
  }

  console.log('\nNext:');
  if (go) {
    console.log('- Worker を起動してください（準備作業が残っていても、prepチケット化して進める）。');
  } else {
    console.log('- Blocker を解消してください。重い場合は Blocker 解消自体を Tier 1 チケット化して Worker に割り当ててください。');
  }

  if (!go) {
    process.exitCode = 2;
  }
}

main();
