const { spawnSync } = require('child_process');
const path = require('path');

function runScript(scriptPath, args = [], options = {}) {
  const { noFail = false } = options;
  const result = spawnSync(process.execPath, [path.join(__dirname, scriptPath), ...args], {
    stdio: 'inherit',
  });

  if (result.error) {
    if (noFail) {
      console.warn(`Warning: ${scriptPath} error: ${result.error.message}`);
      return;
    }
    throw result.error;
  }

  if (result.status !== 0) {
    if (noFail) {
      console.warn(`Warning: ${scriptPath} exited with status ${result.status}`);
      return;
    }
    throw new Error(`${scriptPath} exited with status ${result.status}`);
  }
}

function runGit(args) {
  const result = spawnSync('git', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  if (result.error) {
    throw result.error;
  }

  return result;
}

function checkGitConflictState() {
  const inside = runGit(['rev-parse', '--is-inside-work-tree']);
  if (inside.status !== 0 || inside.stdout.trim() !== 'true') {
    return;
  }

  const unmerged = runGit(['diff', '--name-only', '--diff-filter=U']);
  if (unmerged.status !== 0) {
    throw new Error(`git diff --name-only --diff-filter=U exited with status ${unmerged.status}`);
  }
  if (unmerged.stdout.trim().length > 0) {
    throw new Error('Unmerged paths detected (diff-filter=U). Resolve conflicts before proceeding.');
  }

  const markers = runGit(['grep', '-nE', '^(<<<<<<<|=======|>>>>>>>)']);
  if (markers.status === 0) {
    throw new Error('Conflict markers detected (<<<<<<< / ======= / >>>>>>>). Resolve before proceeding.');
  }
  if (markers.status !== 1) {
    throw new Error(`git grep conflict markers exited with status ${markers.status}`);
  }
}

function main() {
  console.log('Running shared workflow diagnostics...');

  try {
    runScript('detect-project-type.js', [], { noFail: true });
    runScript('report-style-hint.js', [], { noFail: true });
    runScript('creativity-booster.js', [], { noFail: true });
    runScript('adapt-response.js', [], { noFail: true });
    runScript('todo-sync.js', ['--dry-run'], { noFail: true });
    runScript('todo-leak-preventer.js', [], { noFail: true });

    checkGitConflictState();

    console.log('All shared workflow scripts executed successfully.');
  } catch (e) {
    console.error(`Fatal error: ${e.message}`);
    process.exit(1);
  }
}

main();
