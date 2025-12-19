const fs = require('fs');
const path = require('path');

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

function listFilesSafe(dirPath) {
  try {
    return fs.readdirSync(dirPath);
  } catch {
    return [];
  }
}

function parseKeyLine(content, key) {
  const re = new RegExp(`^${key}\\s*:\\s*(.*)$`, 'im');
  const m = content.match(re);
  return m ? m[1].trim() : '';
}

function main() {
  const args = new Set(process.argv.slice(2));
  const noFail = args.has('--no-fail');

  const root = process.cwd();
  const docsDir = path.join(root, 'docs');
  const tasksDir = path.join(docsDir, 'tasks');
  const inboxDir = path.join(docsDir, 'inbox');
  const handoverPath = path.join(docsDir, 'HANDOVER.md');

  const anomalies = [];
  const warnings = [];

  const taskFiles = listFilesSafe(tasksDir).filter((f) => /^TASK_.*\.md$/i.test(f));
  const tasks = new Map();

  for (const file of taskFiles) {
    const full = path.join(tasksDir, file);
    const content = readFileSafe(full);
    if (!content) continue;
    const status = (parseKeyLine(content, 'Status') || '').toUpperCase();
    const report = parseKeyLine(content, 'Report');
    tasks.set(file, { file, full, status, report });

    if (status === 'DONE' || status === 'BLOCKED') {
      if (!report) {
        anomalies.push(`${status} チケットに Report がありません: docs/tasks/${file}`);
      } else {
        const reportPath = path.isAbsolute(report) ? report : path.join(root, report);
        if (!fs.existsSync(reportPath)) {
          anomalies.push(`チケットの Report 参照先が存在しません: docs/tasks/${file} -> ${report}`);
        }
      }
    }
  }

  const reportFiles = listFilesSafe(inboxDir).filter((f) => /^REPORT_.*\.md$/i.test(f));

  for (const file of reportFiles) {
    const full = path.join(inboxDir, file);
    const content = readFileSafe(full);
    if (!content) continue;

    const ticket = parseKeyLine(content, 'Ticket');
    const ticketMatch = ticket.match(/TASK_[^\s/\\]+\.md/i);
    if (!ticketMatch) {
      anomalies.push(`REPORT の Ticket が不正/不明です: docs/inbox/${file} (Ticket: ${ticket || '<empty>'})`);
      continue;
    }

    const ticketFile = ticketMatch[0];
    const task = tasks.get(ticketFile);
    if (!task) {
      anomalies.push(`REPORT に対応するチケットが見つかりません: docs/inbox/${file} -> docs/tasks/${ticketFile}`);
      continue;
    }

    if (task.status !== 'DONE') {
      anomalies.push(`REPORT はあるがチケットが DONE ではありません: docs/tasks/${ticketFile} (Status: ${task.status || '<empty>'})`);
    }

    if (task.report && task.report !== `docs/inbox/${file}`) {
      warnings.push(`チケットの Report が REPORT ファイル名と一致しません: docs/tasks/${ticketFile} (Report: ${task.report}, Actual: docs/inbox/${file})`);
    }
  }

  const handover = readFileSafe(handoverPath);
  if (handover) {
    const activeTasksSection = handover.split(/\n## Active Tasks\n/i)[1] || '';
    const activeLines = activeTasksSection.split(/\n## /)[0].trim();
    const looksPlaceholder = /\|\s*-\s*\|\s*-\s*\|\s*-\s*\|\s*-\s*\|/.test(activeLines);

    const hasOpen = Array.from(tasks.values()).some((t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS' || t.status === 'BLOCKED');
    if (hasOpen && looksPlaceholder) {
      warnings.push('HANDOVER.md の Active Tasks がプレースホルダのままです（未完了チケットあり）。');
    }

    if (!/GitHubAutoApprove\s*:\s*(true|false)/i.test(handover)) {
      warnings.push('HANDOVER.md に GitHubAutoApprove: true/false が見つかりません。');
    }
  }

  console.log('Orchestrator Audit Results');
  console.log(`- tasks: ${taskFiles.length}`);
  console.log(`- reports: ${reportFiles.length}`);

  if (warnings.length > 0) {
    console.log('\nWarnings:');
    for (const w of warnings) console.log(`- ${w}`);
  }

  if (anomalies.length > 0) {
    console.log('\nAnomalies:');
    for (const a of anomalies) console.log(`- ${a}`);

    if (!noFail) {
      process.exitCode = 2;
      return;
    }
  }

  console.log('\nOK');
}

main();
