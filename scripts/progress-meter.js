#!/usr/bin/env node
/**
 * 視覚的進捗表示スクリプト
 * 
 * 用途: docs/tasks/ から進捗を集計し、
 * コマンドラインでの記号を用いた装飾・メーターを提供する
 * 
 * 使用方法:
 *   node scripts/progress-meter.js [--project-root <path>] [--format <text|json>]
 */

const fs = require('fs');
const path = require('path');
const { loadTasks } = require('./progress-dashboard');

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

function createProgressBar(percentage, width = 20) {
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

function formatProgressMeterForChat(tasks, projectRoot) {
  // チャット上で表示するためのコンパクトな形式
  const doneCount = tasks.filter(t => t.status === 'DONE').length;
  const totalCount = tasks.length;
  const overallProgress = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
  
  const lines = [];
  lines.push(`📊 進捗: ${createProgressBar(overallProgress, 15)} ${overallProgress}% (${doneCount}/${totalCount})`);
  return lines.join('\n');
}

function formatProgressMeter(tasks, projectRoot) {
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
  
  const highProgress = highTasks.length > 0 ? Math.round((highDone / highTasks.length) * 100) : 0;
  const mediumProgress = mediumTasks.length > 0 ? Math.round((mediumDone / mediumTasks.length) * 100) : 0;
  const lowProgress = lowTasks.length > 0 ? Math.round((lowDone / lowTasks.length) * 100) : 0;
  
  // 最近の完了タスク（日付順）
  const recentDone = tasks
    .filter(t => t.status === 'DONE')
    .sort((a, b) => {
      const aDate = a.created ? new Date(a.created) : new Date(0);
      const bDate = b.created ? new Date(b.created) : new Date(0);
      return bDate - aDate;
    })
    .slice(0, 5);
  
  const lines = [];
  
  lines.push('');
  lines.push('📊 プロジェクト進捗');
  lines.push('━'.repeat(40));
  lines.push(`全体進捗: ${createProgressBar(overallProgress)} ${overallProgress}%`);
  lines.push(`完了タスク: ${doneCount}/${totalCount}`);
  lines.push(`進行中: ${inProgressCount}`);
  lines.push(`未着手: ${openCount}`);
  if (blockedCount > 0) {
    lines.push(`ブロック: ${blockedCount}`);
  }
  lines.push('');
  
  // 優先度別進捗
  if (highTasks.length > 0 || mediumTasks.length > 0 || lowTasks.length > 0) {
    lines.push('🎯 優先度別進捗');
    if (highTasks.length > 0) {
      lines.push(`High:   ${createProgressBar(highProgress)} ${highProgress}% (${highDone}/${highTasks.length})`);
    }
    if (mediumTasks.length > 0) {
      lines.push(`Medium: ${createProgressBar(mediumProgress)} ${mediumProgress}% (${mediumDone}/${mediumTasks.length})`);
    }
    if (lowTasks.length > 0) {
      lines.push(`Low:    ${createProgressBar(lowProgress)} ${lowProgress}% (${lowDone}/${lowTasks.length})`);
    }
    lines.push('');
  }
  
  // 最近の完了タスク
  if (recentDone.length > 0) {
    lines.push('📈 最近の完了タスク');
    for (const task of recentDone) {
      const date = task.created ? task.created.split('T')[0] : '（日付不明）';
      const objective = task.objective ? (task.objective.length > 50 ? task.objective.substring(0, 50) + '...' : task.objective) : '（目的未記載）';
      lines.push(`- ${task.id}: ${objective} (${date})`);
    }
    lines.push('');
  }
  
  // 状態別サマリ
  lines.push('📋 状態別サマリ');
  lines.push(`✅ 完了: ${doneCount}`);
  lines.push(`🔄 進行中: ${inProgressCount}`);
  lines.push(`📝 未着手: ${openCount}`);
  if (blockedCount > 0) {
    lines.push(`🚫 ブロック: ${blockedCount}`);
  }
  lines.push('');
  
  return lines.join('\n');
}

function formatProgressMeterJson(tasks, projectRoot) {
  const doneCount = tasks.filter(t => t.status === 'DONE').length;
  const inProgressCount = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const openCount = tasks.filter(t => t.status === 'OPEN').length;
  const blockedCount = tasks.filter(t => t.status === 'BLOCKED').length;
  const totalCount = tasks.length;
  const overallProgress = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
  
  const highTasks = tasks.filter(t => t.priority === 'High');
  const mediumTasks = tasks.filter(t => t.priority === 'Medium');
  const lowTasks = tasks.filter(t => t.priority === 'Low');
  
  const highDone = highTasks.filter(t => t.status === 'DONE').length;
  const mediumDone = mediumTasks.filter(t => t.status === 'DONE').length;
  const lowDone = lowTasks.filter(t => t.status === 'DONE').length;
  
  const highProgress = highTasks.length > 0 ? Math.round((highDone / highTasks.length) * 100) : 0;
  const mediumProgress = mediumTasks.length > 0 ? Math.round((mediumDone / mediumTasks.length) * 100) : 0;
  const lowProgress = lowTasks.length > 0 ? Math.round((lowDone / lowTasks.length) * 100) : 0;
  
  const recentDone = tasks
    .filter(t => t.status === 'DONE')
    .sort((a, b) => {
      const aDate = a.created ? new Date(a.created) : new Date(0);
      const bDate = b.created ? new Date(b.created) : new Date(0);
      return bDate - aDate;
    })
    .slice(0, 5)
    .map(t => ({
      id: t.id,
      objective: t.objective || '（目的未記載）',
      date: t.created ? t.created.split('T')[0] : '（日付不明）'
    }));
  
  return JSON.stringify({
    overall: {
      progress: overallProgress,
      done: doneCount,
      inProgress: inProgressCount,
      open: openCount,
      blocked: blockedCount,
      total: totalCount
    },
    byPriority: {
      high: {
        progress: highProgress,
        done: highDone,
        total: highTasks.length
      },
      medium: {
        progress: mediumProgress,
        done: mediumDone,
        total: mediumTasks.length
      },
      low: {
        progress: lowProgress,
        done: lowDone,
        total: lowTasks.length
      }
    },
    recentDone: recentDone
  }, null, 2);
}

function main() {
  const projectRoot = parseArg('--project-root', null) || findProjectRoot();
  const format = parseArg('--format', 'text');
  
  // タスクを読み込み
  const tasks = loadTasks(projectRoot);
  
  if (format === 'json') {
    console.log(formatProgressMeterJson(tasks, projectRoot));
  } else {
    console.log(formatProgressMeter(tasks, projectRoot));
  }
}

if (require.main === module) {
  main();
}

module.exports = { formatProgressMeter, formatProgressMeterJson, formatProgressMeterForChat, createProgressBar };
