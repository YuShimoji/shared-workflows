const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getArgValue(flag) {
  const index = process.argv.indexOf(flag);
  if (index !== -1 && index + 1 < process.argv.length) {
    return process.argv[index + 1];
  }
  return null;
}

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

function writeFileSafe(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}

function collectTaskFiles(tasksDir) {
  if (!fs.existsSync(tasksDir)) {
    console.warn(`[todo-sync] tasks directory not found: ${tasksDir}`);
    return [];
  }

  return fs
    .readdirSync(tasksDir)
    .filter(name => /^TASK_.*\.md$/i.test(name))
    .map(name => path.join(tasksDir, name));
}

function parseTask(filePath) {
  const content = readFileSafe(filePath);
  if (!content) {
    return null;
  }

  const titleMatch = content.match(/^#\s*Task:\s*(.+)$/m);
  const statusMatch = content.match(/^Status:\s*(.+)$/m);

  if (!titleMatch || !statusMatch) {
    return null;
  }

  return {
    title: titleMatch[1].trim(),
    status: statusMatch[1].trim(),
    relativePath: path.relative(process.cwd(), filePath).replace(/\\/g, '/'),
  };
}

function normalizeStatus(status) {
  const normalized = status.toUpperCase();
  if (normalized === 'OPEN' || normalized === 'PENDING') return 'pending';
  if (normalized === 'IN_PROGRESS') return 'in_progress';
  if (normalized === 'BLOCKED') return 'blocked';
  if (normalized === 'DONE') return 'done';
  return 'pending';
}

function replaceSection(content, headingRegex, newBody) {
  const regex = new RegExp(`(${headingRegex}\\s*\\n)([\\s\\S]*?)(?=\\n###\\s|\\n##\\s|$)`, 'i');
  if (!regex.test(content)) {
    return null;
  }
  return content.replace(regex, (_, prefix) => `${prefix}${newBody}\n`);
}

function buildTodoLines(tasks) {
  if (!tasks.length) {
    return '- [done] 未完了タスクなし（docs/tasks/ に OPEN / IN_PROGRESS なし）';
  }

  return tasks
    .map(task => {
      const status = normalizeStatus(task.status);
      const statusLabel = status === 'blocked' ? 'pending' : status;
      const note = status === 'blocked' ? ' (BLOCKED - 要確認)' : '';
      return `- [${statusLabel}] ${task.title}${note} (ref: ${task.relativePath}, Status: ${task.status})`;
    })
    .join('\n');
}

function syncAiContext(aiContextPath, todoLines, dryRun) {
  const content = readFileSafe(aiContextPath);
  if (!content) {
    console.warn(`[todo-sync] AI_CONTEXT not found: ${aiContextPath}`);
    return;
  }

  const updated = replaceSection(content, '###\\s*短期（Next）', todoLines);
  if (!updated) {
    console.warn('[todo-sync] Heading "### 短期（Next）" not found. No changes applied.');
    return;
  }

  if (dryRun) {
    console.log('--- AI_CONTEXT preview (Next section) ---');
    console.log(todoLines);
    console.log('--- end preview ---');
    return;
  }

  writeFileSafe(aiContextPath, updated);
  console.log(`[todo-sync] Updated ${aiContextPath} (Next section).`);
}

function syncTodoList(tasks) {
  if (!Array.isArray(tasks)) return;

  try {
    execSync('todo_list clear-all', { stdio: 'ignore' });
  } catch {
    console.warn('[todo-sync] todo_list clear-all failed or unavailable.');
  }

  tasks.forEach(task => {
    const status = normalizeStatus(task.status);
    const content = `${task.title} (${task.relativePath})`;
    const priority = 'medium';
    let command = `todo_list add --content "${content.replace(/"/g, '\\"')}" --priority ${priority}`;
    if (status === 'in_progress') {
      command += ' --status in_progress';
    } else if (status === 'pending') {
      command += ' --status pending';
    } else if (status === 'blocked') {
      command += ' --status pending';
    } else {
      command += ' --status completed';
    }

    try {
      execSync(command, { stdio: 'ignore' });
    } catch (err) {
      console.warn(`[todo-sync] Failed to add todo_list item: ${content}`, err.message);
    }
  });
}

function main() {
  const aiContextPath =
    getArgValue('--ai-context') || path.join(process.cwd(), 'AI_CONTEXT.md');
  const tasksDir =
    getArgValue('--tasks-dir') || path.join(process.cwd(), 'docs', 'tasks');
  const dryRun = process.argv.includes('--dry-run');

  const taskFiles = collectTaskFiles(tasksDir);
  const tasks = taskFiles
    .map(parseTask)
    .filter(Boolean)
    .filter(task => {
      const status = normalizeStatus(task.status);
      return status === 'pending' || status === 'in_progress' || status === 'blocked';
    });

  const todoLines = buildTodoLines(tasks);
  syncAiContext(aiContextPath, todoLines, dryRun);
  syncTodoList(tasks);

  console.log('[todo-sync] Tasks to mirror in todo_list (Windsurf UI):');
  if (tasks.length === 0) {
    console.log('  - 全タスク完了');
  } else {
    tasks.forEach(task => {
      const status = normalizeStatus(task.status);
      console.log(`  - [${status}] ${task.title} (${task.relativePath})`);
    });
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
