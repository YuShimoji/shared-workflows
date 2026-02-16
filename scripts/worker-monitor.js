const fs = require('fs');
const path = require('path');

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

function writeFileSafe(filePath, content) {
  try {
    fs.writeFileSync(filePath, content);
  } catch (err) {
    console.error(`Failed to write ${filePath}:`, err);
  }
}

function parseKeyLine(content, key) {
  const re = new RegExp(`^${key}\\s*:\\s*(.*)$`, 'im');
  const m = content.match(re);
  return m ? m[1].trim() : '';
}

function updateWorkerStatus(aiContextPath, workerName, newStatus) {
  const content = readFileSafe(aiContextPath);
  if (!content) return;
  const workerLine = parseKeyLine(content, 'Worker完了ステータス');
  if (!workerLine) return;
  const workers = workerLine.split(',').map(w => w.trim());
  const updatedWorkers = workers.map(worker => {
    const parts = worker.split(',');
    const nameStatus = parts[0].trim();
    const [name] = nameStatus.split(':').map(s => s.trim());
    if (name === workerName) {
      return `${workerName}: ${newStatus}${parts.slice(1).join(', ')}`;
    }
    return worker;
  });
  const newWorkerLine = updatedWorkers.join(', ');
  const newContent = content.replace(/Worker完了ステータス\s*:\s*.*/i, `Worker完了ステータス: ${newWorkerLine}`);
  writeFileSafe(aiContextPath, newContent);
}

function monitorWorkers(aiContextPath, checkInterval = 60000) { // デフォルト1分間隔
  const intervalId = setInterval(() => {
    const content = readFileSafe(aiContextPath);
    if (!content) {
      clearInterval(intervalId);
      return;
    }
    const asyncMode = parseKeyLine(content, 'async_mode');
    const isAsync = asyncMode && asyncMode.toLowerCase() === 'true';
    const workerLine = parseKeyLine(content, 'Worker完了ステータス');
    if (!workerLine) return;
    const workers = workerLine.split(',').map(w => w.trim());
    let allCompleted = true;
    for (const worker of workers) {
      const parts = worker.split(',');
      const [nameStatus, priority, timeoutStr] = parts.map(p => p.trim());
      const [name, status] = nameStatus.split(':').map(s => s.trim());
      const _prio = priority ? priority.split(':')[1].trim() : 'critical';
      const timeout = timeoutStr ? parseInt(timeoutStr.split(':')[1].trim()) || 30 : 30;
      if (status === 'pending') {
        // 仮定: タイムアウトチェック（実際は開始時間が必要）
        if (timeout <= 0) {
          updateWorkerStatus(aiContextPath, name, 'error');
          console.log(`Worker ${name} timed out.`);
        } else {
          allCompleted = false;
        }
      }
    }
    if (allCompleted && !isAsync) {
      console.log('All critical workers completed.');
      clearInterval(intervalId);
    }
  }, checkInterval);
  return intervalId;
}

function main() {
  const aiContextPath = process.argv[2] || path.join(process.cwd(), 'AI_CONTEXT.md');
  monitorWorkers(aiContextPath);
  console.log('Worker monitor started. Press Ctrl+C to stop.');
}

if (require.main === module) {
  main();
}

module.exports = { monitorWorkers, updateWorkerStatus };
