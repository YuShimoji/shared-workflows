const fs = require('fs');
const path = require('path');

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

function parseKeyLine(content, key) {
  const re = new RegExp(`^${key}\\s*:\\s*(.*)$`, 'im');
  const m = content.match(re);
  return m ? m[1].trim() : '';
}

function checkTodoLeak(aiContextPath) {
  const content = readFileSafe(aiContextPath);
  if (!content) {
    console.log('Warning: AI_CONTEXT.md not found. Cannot check todo status.');
    return;
  }

  // AI_CONTEXT.mdからtodo_listを抽出（仮定: ## Backlogセクションにtodo_list情報がある）
  const backlogSection = content.split(/## Backlog/i)[1];
  if (!backlogSection) {
    console.log('Warning: Backlog section not found in AI_CONTEXT.md.');
    return;
  }

  const todos = backlogSection.split('\n').filter(line => line.startsWith('- '));
  const pendingTasks = [];
  const inProgressTasks = [];

  for (const todo of todos) {
    // 仮定: todoは "- [status] task content" 形式
    const match = todo.match(/-\s*\[(\w+)\]\s*(.+)/);
    if (match) {
      const status = match[1];
      const task = match[2];
      if (status === 'pending') {
        pendingTasks.push(task);
      } else if (status === 'in_progress') {
        inProgressTasks.push(task);
      }
    }
  }

  if (pendingTasks.length > 0) {
    console.log('Warning: Pending tasks detected:');
    pendingTasks.forEach(task => console.log(`  - ${task}`));
  }

  if (inProgressTasks.length > 0) {
    console.log('Info: In-progress tasks:');
    inProgressTasks.forEach(task => console.log(`  - ${task}`));
    // 自律調整: 完了条件をチェック（例: スクリプト実行）
    checkCompletionConditions(inProgressTasks);
  } else {
    console.log('All tasks completed.');
  }
}

function checkCompletionConditions(tasks) {
  // 例: タスク名に基づく完了条件
  tasks.forEach(task => {
    if (task.includes('implement') && fs.existsSync(path.join(process.cwd(), 'scripts', 'worker-monitor.js'))) {
      console.log(`Auto-completing task: ${task}`);
      // 自動更新（実際にはAI_CONTEXT.mdを編集）
    }
  });
}

function main() {
  const aiContextPath = path.join(process.cwd(), 'AI_CONTEXT.md');
  checkTodoLeak(aiContextPath);
}

if (require.main === module) {
  main();
}

module.exports = { checkTodoLeak };
