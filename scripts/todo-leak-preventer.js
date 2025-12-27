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

  // AI_CONTEXT.mdからBacklogセクションを抽出
  const backlogMatch = content.match(/## Backlog[^\n]*\n([\s\S]*?)(?=\n## |\Z)/i);
  if (!backlogMatch) {
    console.log('Warning: Backlog section not found in AI_CONTEXT.md.');
    return;
  }

  const backlogContent = backlogMatch[1];
  const todos = backlogContent.split('\n').filter(line => /^\s*-\s*\[/.test(line));
  const incompleteTasks = [];

  for (const todo of todos) {
    // 形式: "- [ ] task content" (未完了) または "- [x] task content" (完了)
    const match = todo.match(/^\s*-\s*\[(.)\]\s*(.+)/);
    if (match) {
      const checkbox = match[1];
      const task = match[2];
      // [ ] は未完了、[x] または [X] は完了
      if (checkbox === ' ') {
        incompleteTasks.push(task);
      }
    }
  }

  if (incompleteTasks.length > 0) {
    console.log('Warning: Incomplete tasks in Backlog:');
    incompleteTasks.forEach(task => console.log(`  - ${task}`));
    // 自律調整: 完了条件をチェック（例: スクリプト実行）
    checkCompletionConditions(incompleteTasks);
  } else {
    console.log('All Backlog tasks completed.');
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
