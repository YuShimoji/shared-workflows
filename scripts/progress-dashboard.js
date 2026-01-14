#!/usr/bin/env node
/**
 * 進捗ダッシュボード生成スクリプト
 * 
 * 用途: docs/tasks/ と docs/HANDOVER.md、AI_CONTEXT.md から進捗を集計し、
 * アイデアと実装度合いを対照できる視覚的な表を生成する
 * 
 * 使用方法:
 *   node scripts/progress-dashboard.js [--project-root <path>] [--output <path>]
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
      owner: null,
      created: null,
      report: null
    };
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('Status:')) {
        task.status = line.split(':')[1].trim();
      } else if (line.startsWith('Tier:')) {
        task.tier = line.split(':')[1].trim();
        // Tierから優先度を推定
        if (task.tier === '1') {
          task.priority = 'Low';
        } else if (task.tier === '2') {
          task.priority = 'Medium';
        } else if (task.tier === '3') {
          task.priority = 'High';
        }
      } else if (line.startsWith('Owner:')) {
        task.owner = line.split(':')[1].trim();
      } else if (line.startsWith('Created:')) {
        task.created = line.split(':')[1].trim();
      } else if (line.startsWith('Report:')) {
        task.report = line.split(':')[1].trim();
      } else if (line.startsWith('## Objective')) {
        const objectiveLines = [];
        for (let j = i + 1; j < lines.length && !lines[j].trim().startsWith('##'); j++) {
          if (lines[j].trim() && !lines[j].trim().startsWith('-')) {
            objectiveLines.push(lines[j].trim());
          } else if (lines[j].trim().startsWith('-')) {
            objectiveLines.push(lines[j].trim().substring(1).trim());
          }
        }
        task.objective = objectiveLines.join(' ').substring(0, 100) + (objectiveLines.join(' ').length > 100 ? '...' : '');
      }
    }
    
    // 進捗率の計算
    if (task.status === 'DONE') {
      task.progress = 100;
    } else if (task.status === 'IN_PROGRESS') {
      task.progress = 50;
    } else if (task.status === 'BLOCKED') {
      task.progress = 25;
    } else if (task.status === 'OPEN') {
      task.progress = 0;
    } else {
      task.progress = 0;
    }
    
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
      if (task) {
        tasks.push(task);
      }
    }
  }
  
  return tasks;
}

function parseHandover(handoverPath) {
  try {
    if (!fs.existsSync(handoverPath)) {
      return { progress: [] };
    }
    
    const content = fs.readFileSync(handoverPath, 'utf8');
    const lines = content.split(/\r?\n/);
    
    const progress = [];
    let inProgressSection = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line === '## 進捗') {
        inProgressSection = true;
        continue;
      }
      
      if (inProgressSection && line.startsWith('##')) {
        break;
      }
      
      if (inProgressSection && line.startsWith('- **TASK_')) {
        const match = line.match(/- \*\*(TASK_\w+)\*\*: (\w+) — (.+)/);
        if (match) {
          progress.push({
            taskId: match[1],
            status: match[2],
            description: match[3]
          });
        }
      }
    }
    
    return { progress };
  } catch (error) {
    console.error(`Error parsing ${handoverPath}: ${error.message}`);
    return { progress: [] };
  }
}

function parseBacklog(contextPath) {
  try {
    if (!fs.existsSync(contextPath)) {
      return [];
    }
    
    const content = fs.readFileSync(contextPath, 'utf8');
    const lines = content.split(/\r?\n/);
    
    const backlog = [];
    let inBacklogSection = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line === '## Backlog（将来提案）' || line === '## バックログ') {
        inBacklogSection = true;
        continue;
      }
      
      if (inBacklogSection && line.startsWith('##')) {
        break;
      }
      
      if (inBacklogSection && line.startsWith('- [ ]')) {
        const item = line.substring(5).trim();
        backlog.push({
          idea: item,
          priority: 'Low', // デフォルト
          status: '未着手',
          progress: 0
        });
      }
    }
    
    return backlog;
  } catch (error) {
    console.error(`Error parsing ${contextPath}: ${error.message}`);
    return [];
  }
}

function generateDashboard(tasks, handover, backlog, projectRoot) {
  const now = new Date();
  const timestamp = now.toISOString().replace(/T/, ' ').substring(0, 19) + '+09:00';
  
  // 統計情報
  const doneCount = tasks.filter(t => t.status === 'DONE').length;
  const inProgressCount = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const openCount = tasks.filter(t => t.status === 'OPEN').length;
  const blockedCount = tasks.filter(t => t.status === 'BLOCKED').length;
  const totalCount = tasks.length;
  const overallProgress = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
  
  // 優先度別統計
  const highTasks = tasks.filter(t => t.priority === 'High');
  const mediumTasks = tasks.filter(t => t.priority === 'Medium');
  const lowTasks = tasks.filter(t => t.priority === 'Low');
  
  const highDone = highTasks.filter(t => t.status === 'DONE').length;
  const mediumDone = mediumTasks.filter(t => t.status === 'DONE').length;
  const lowDone = lowTasks.filter(t => t.status === 'DONE').length;
  
  const lines = [];
  
  lines.push('# プロジェクト進捗ダッシュボード');
  lines.push('');
  lines.push(`**最終更新**: ${timestamp}`);
  lines.push('');
  
  // 全体サマリ
  lines.push('## 全体サマリ');
  lines.push('');
  lines.push(`- 完了タスク: ${doneCount}/${totalCount}`);
  lines.push(`- 進行中: ${inProgressCount}`);
  lines.push(`- 未着手: ${openCount}`);
  lines.push(`- ブロック: ${blockedCount}`);
  lines.push(`- 全体進捗: ${overallProgress}%`);
  lines.push('');
  
  // 優先度別進捗
  if (highTasks.length > 0 || mediumTasks.length > 0 || lowTasks.length > 0) {
    lines.push('## 優先度別進捗');
    lines.push('');
    if (highTasks.length > 0) {
      lines.push(`- **High**: ${highDone}/${highTasks.length} 完了 (${Math.round((highDone / highTasks.length) * 100)}%)`);
    }
    if (mediumTasks.length > 0) {
      lines.push(`- **Medium**: ${mediumDone}/${mediumTasks.length} 完了 (${Math.round((mediumDone / mediumTasks.length) * 100)}%)`);
    }
    if (lowTasks.length > 0) {
      lines.push(`- **Low**: ${lowDone}/${lowTasks.length} 完了 (${Math.round((lowDone / lowTasks.length) * 100)}%)`);
    }
    lines.push('');
  }
  
  // 進捗一覧（タスク）
  lines.push('## 進捗一覧（タスク）');
  lines.push('');
  lines.push('| アイデア/機能 | 優先度 | 状態 | 進捗 | 担当 | タスクID |');
  lines.push('|------------|--------|------|------|------|----------|');
  
  // タスクを優先度順にソート
  const priorityOrder = { High: 3, Medium: 2, Low: 1 };
  tasks.sort((a, b) => {
    const aPriority = priorityOrder[a.priority] || 0;
    const bPriority = priorityOrder[b.priority] || 0;
    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }
    return a.id.localeCompare(b.id);
  });
  
  for (const task of tasks) {
    const objective = task.objective || '（目的未記載）';
    const priority = task.priority || 'Unknown';
    const status = task.status || 'UNKNOWN';
    const progress = `${task.progress}%`;
    const owner = task.owner || '-';
    const taskId = task.id;
    
    lines.push(`| ${objective} | ${priority} | ${status} | ${progress} | ${owner} | ${taskId} |`);
  }
  
  lines.push('');
  
  // バックログ（アイデア）
  if (backlog.length > 0) {
    lines.push('## バックログ（アイデア）');
    lines.push('');
    lines.push('| アイデア/機能 | 優先度 | 状態 | 進捗 | 担当 | タスクID |');
    lines.push('|------------|--------|------|------|------|----------|');
    
    for (const item of backlog) {
      lines.push(`| ${item.idea} | ${item.priority} | ${item.status} | ${item.progress}% | - | - |`);
    }
    
    lines.push('');
  }
  
  // 最近の完了タスク
  const recentDone = tasks
    .filter(t => t.status === 'DONE')
    .sort((a, b) => {
      const aDate = a.created ? new Date(a.created) : new Date(0);
      const bDate = b.created ? new Date(b.created) : new Date(0);
      return bDate - aDate;
    })
    .slice(0, 5);
  
  if (recentDone.length > 0) {
    lines.push('## 最近の完了タスク');
    lines.push('');
    for (const task of recentDone) {
      const date = task.created ? task.created.split('T')[0] : '（日付不明）';
      lines.push(`- ${task.id}: ${task.objective || '（目的未記載）'} (${date})`);
    }
    lines.push('');
  }
  
  return lines.join('\n');
}

function main() {
  const projectRoot = parseArg('--project-root', null) || findProjectRoot();
  const outputPath = parseArg('--output', path.join(projectRoot, 'docs', 'PROGRESS_DASHBOARD.md'));
  
  console.log(`Project root: ${projectRoot}`);
  console.log(`Output path: ${outputPath}`);
  
  // タスクを読み込み
  const tasks = loadTasks(projectRoot);
  console.log(`Loaded ${tasks.length} tasks`);
  
  // HANDOVERを読み込み
  const handoverPath = path.join(projectRoot, 'docs', 'HANDOVER.md');
  const handover = parseHandover(handoverPath);
  
  // AI_CONTEXTからバックログを読み込み
  const contextPath = path.join(projectRoot, 'AI_CONTEXT.md');
  const backlog = parseBacklog(contextPath);
  console.log(`Loaded ${backlog.length} backlog items`);
  
  // ダッシュボードを生成
  const dashboard = generateDashboard(tasks, handover, backlog, projectRoot);
  
  // 出力
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  fs.writeFileSync(outputPath, dashboard, 'utf8');
  
  console.log(`Dashboard generated: ${outputPath}`);
}

if (require.main === module) {
  main();
}

module.exports = { loadTasks, parseHandover, parseBacklog, generateDashboard };
