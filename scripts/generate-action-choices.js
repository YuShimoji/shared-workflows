#!/usr/bin/env node
/**
 * 次のアクション選択肢生成スクリプト
 * 
 * 用途: docs/tasks/ からOPEN/IN_PROGRESSタスクを読み込み、
 * 優先度と依存関係を考慮して選択肢を生成する
 * 
 * 使用方法:
 *   node scripts/generate-action-choices.js [--project-root <path>] [--format <text|json>]
 */

const fs = require('fs');
const path = require('path');
const { requireSharedWorkflowsPath } = require('./utils/sw-path');

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

function detectTaskType(task) {
  // タスクの性質を判定
  const text = `${task.objective || ''} ${task.context || ''}`.toLowerCase();
  
  // ブロッカー
  if (task.status === 'BLOCKED') {
    return { icon: '🚫', label: 'ブロッカー', type: 'blocked' };
  }
  
  // UI関連
  if (text.includes('ui') || text.includes('画面') || text.includes('ブラウザ') || 
      text.includes('インターフェース') || text.includes('interface') || 
      text.includes('ユーザー') || text.includes('user') || text.includes('ux')) {
    return { icon: '🎨', label: 'UI', type: 'ui' };
  }
  
  // テスト関連
  if (text.includes('テスト') || text.includes('test') || text.includes('検証') || 
      text.includes('verification') || text.includes('テストケース') || 
      text.includes('test case')) {
    return { icon: '🧪', label: 'テスト', type: 'test' };
  }
  
  // バグ修正
  if (text.includes('バグ') || text.includes('bug') || text.includes('修正') || 
      text.includes('fix') || text.includes('不具合') || text.includes('エラー') || 
      text.includes('error')) {
    return { icon: '🐛', label: 'バグ修正', type: 'bugfix' };
  }
  
  // ドキュメント
  if (text.includes('ドキュメント') || text.includes('documentation') || 
      text.includes('readme') || text.includes('docs') || text.includes('文書') || 
      text.includes('テンプレート') || text.includes('template')) {
    return { icon: '📝', label: 'ドキュメント', type: 'docs' };
  }
  
  // リファクタリング
  if (text.includes('リファクタ') || text.includes('refactor') || 
      text.includes('整理') || text.includes('改善') || text.includes('最適化')) {
    return { icon: '🔧', label: 'リファクタリング', type: 'refactor' };
  }
  
  // 機能実装
  if (text.includes('実装') || text.includes('implement') || text.includes('機能') || 
      text.includes('feature') || text.includes('追加') || text.includes('add')) {
    return { icon: '✨', label: '機能実装', type: 'feature' };
  }
  
  // CI/CD
  if (text.includes('ci') || text.includes('cd') || text.includes('パイプライン') || 
      text.includes('pipeline') || text.includes('ワークフロー') || text.includes('workflow')) {
    return { icon: '⚙️', label: 'CI/CD', type: 'cicd' };
  }
  
  // デフォルト
  return { icon: '📋', label: 'タスク', type: 'task' };
}

function parseTaskFile(taskPath) {
  try {
    const content = fs.readFileSync(taskPath, 'utf8');
    const lines = content.split(/\r?\n/);
    
    const task = {
      id: path.basename(taskPath, '.md'),
      status: 'UNKNOWN',
      tier: null,
      priority: null,
      objective: null,
      context: null,
      focusArea: null
    };
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('Status:')) {
        task.status = line.split(':')[1].trim();
      } else if (line.startsWith('Tier:')) {
        task.tier = line.split(':')[1].trim();
      } else if (line.startsWith('## Objective')) {
        const objectiveLines = [];
        for (let j = i + 1; j < lines.length && !lines[j].trim().startsWith('##'); j++) {
          if (lines[j].trim()) {
            objectiveLines.push(lines[j].trim());
          }
        }
        task.objective = objectiveLines.join(' ');
      } else if (line.startsWith('## Context')) {
        const contextLines = [];
        for (let j = i + 1; j < lines.length && !lines[j].trim().startsWith('##'); j++) {
          if (lines[j].trim()) {
            contextLines.push(lines[j].trim());
          }
        }
        task.context = contextLines.join(' ');
      } else if (line.startsWith('## Focus Area')) {
        const focusLines = [];
        for (let j = i + 1; j < lines.length && !lines[j].trim().startsWith('##'); j++) {
          if (lines[j].trim()) {
            focusLines.push(lines[j].trim());
          }
        }
        task.focusArea = focusLines.join(' ');
      }
    }
    
    // 優先度の推定（Tierから）
    if (task.tier === '1') {
      task.priority = 'Low';
    } else if (task.tier === '2') {
      task.priority = 'Medium';
    } else if (task.tier === '3') {
      task.priority = 'High';
    }
    
    // タスクタイプの判定
    task.taskType = detectTaskType(task);
    
    return task;
  } catch (error) {
    console.error(`Error parsing ${taskPath}: ${error.message}`);
    return null;
  }
}

function loadTasks(projectRoot) {
  const tasksDir = path.join(projectRoot, 'docs', 'tasks');
  if (!fs.existsSync(tasksDir)) {
    return [];
  }
  
  const tasks = [];
  const files = fs.readdirSync(tasksDir);
  
  for (const file of files) {
    if (file.endsWith('.md') && file.startsWith('TASK_')) {
      const taskPath = path.join(tasksDir, file);
      const task = parseTaskFile(taskPath);
      if (task && (task.status === 'OPEN' || task.status === 'IN_PROGRESS')) {
        tasks.push(task);
      }
    }
  }
  
  return tasks;
}

function generateActionChoices(tasks) {
  // 優先度でソート（High > Medium > Low）
  const priorityOrder = { High: 3, Medium: 2, Low: 1 };
  tasks.sort((a, b) => {
    const aPriority = priorityOrder[a.priority] || 0;
    const bPriority = priorityOrder[b.priority] || 0;
    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }
    // 同じ優先度の場合は、IN_PROGRESSを優先
    if (a.status === 'IN_PROGRESS' && b.status !== 'IN_PROGRESS') {
      return -1;
    }
    if (b.status === 'IN_PROGRESS' && a.status !== 'IN_PROGRESS') {
      return 1;
    }
    return 0;
  });
  
  const recommended = [];
  const others = [];
  
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const choice = {
      number: i + 1,
      taskId: task.id,
      priority: task.priority,
      status: task.status,
      objective: task.objective || '（目的未記載）',
      taskType: task.taskType || { icon: '📋', label: 'タスク', type: 'task' },
      recommendation: i < 2 ? (i === 0 ? '⭐⭐⭐' : '⭐⭐') : '⭐'
    };
    
    if (i < 2) {
      recommended.push(choice);
    } else {
      others.push(choice);
    }
  }
  
  return { recommended, others, allTasks: tasks };
}

function formatAsText(choices, allTasks) {
  const lines = [];
  
  if (choices.recommended.length === 0 && choices.others.length === 0) {
    lines.push('### 推奨アクション');
    lines.push('');
    lines.push('（現在、OPEN/IN_PROGRESS のタスクがありません）');
    lines.push('');
    return lines.join('\n');
  }
  
  lines.push('### 推奨アクション');
  for (const choice of choices.recommended) {
    const typeInfo = choice.taskType || { icon: '📋', label: 'タスク' };
    lines.push(`${choice.number}) ${typeInfo.icon} ${choice.recommendation} 「選択肢${choice.number}を実行して」: [${typeInfo.label}] ${choice.objective} - 優先度: ${choice.priority}, 状態: ${choice.status}`);
  }
  
  if (choices.others.length > 0) {
    lines.push('');
    lines.push('### その他の選択肢');
    for (const choice of choices.others) {
      const typeInfo = choice.taskType || { icon: '📋', label: 'タスク' };
      lines.push(`${choice.number}) ${typeInfo.icon} ${choice.recommendation} 「選択肢${choice.number}を実行して」: [${typeInfo.label}] ${choice.objective} - 優先度: ${choice.priority}, 状態: ${choice.status}`);
    }
  }
  
  if (allTasks.length > 0) {
    lines.push('');
    lines.push('### 現在積み上がっているタスクとの連携');
    for (let i = 0; i < Math.min(2, allTasks.length); i++) {
      const task = allTasks[i];
      lines.push(`- 選択肢${i + 1}を実行すると、${task.id}（優先度: ${task.priority}）の前提条件が整います`);
    }
  }
  
  return lines.join('\n');
}

function formatAsJson(choices, allTasks) {
  return JSON.stringify({
    recommended: choices.recommended,
    others: choices.others,
    taskRelationships: allTasks.map((task, index) => ({
      choiceNumber: index + 1,
      taskId: task.id,
      priority: task.priority,
      status: task.status,
      relationship: index < 2 ? '前提条件が整う' : '並行して進められる'
    }))
  }, null, 2);
}

function main() {
  const projectRoot = parseArg('--project-root', null) || findProjectRoot();
  const format = parseArg('--format', 'text');
  
  const tasks = loadTasks(projectRoot);
  const choices = generateActionChoices(tasks);
  
  if (format === 'json') {
    console.log(formatAsJson(choices, tasks));
  } else {
    console.log(formatAsText(choices, tasks));
  }
}

if (require.main === module) {
  main();
}

module.exports = { loadTasks, generateActionChoices, formatAsText, formatAsJson };
