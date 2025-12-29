const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Utility Functions
function getArgValue(flag) {
  const index = process.argv.indexOf(flag);
  if (index !== -1 && index + 1 < process.argv.length) {
    return process.argv[index + 1];
  }
  return null;
}

function runCommand(command, options = {}) {
  try {
    const stdio = options.quiet ? 'ignore' : 'inherit';
    execSync(command, { stdio, encoding: 'utf8', ...options });
    return true;
  } catch (error) {
    if (!options.quiet) {
      console.error(`Command failed: ${command}`);
      console.error(error.message);
    }
    return false;
  }
}

function ensureDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.log(`Creating directory: ${dirPath}`);
    fs.mkdirSync(dirPath, { recursive: true });
  }
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

// Core Operations
function moveReports(inboxDir, reportsDir) {
  if (!fs.existsSync(inboxDir)) {
    console.warn(`Inbox directory not found: ${inboxDir}`);
    return 0;
  }

  ensureDirectory(reportsDir);

  const files = fs.readdirSync(inboxDir);
  const reportFiles = files.filter(f => /^REPORT_.*\.md$/i.test(f));
  let movedCount = 0;

  for (const file of reportFiles) {
    const srcPath = path.join(inboxDir, file);
    const destPath = path.join(reportsDir, file);
    
    if (fs.existsSync(destPath)) {
      console.warn(`Skipping duplicate (already exists in reports): ${file}`);
      continue;
    }

    fs.renameSync(srcPath, destPath);
    console.log(`Moved: ${file} -> docs/reports/`);
    movedCount++;
  }

  // Verification
  const remaining = fs.readdirSync(inboxDir).filter(f => /^REPORT_.*\.md$/i.test(f));
  if (remaining.length > 0) {
    throw new Error(`Failed to move all reports. Remaining: ${remaining.join(', ')}`);
  }

  return movedCount;
}

function updateAiContext(root, workerName) {
  if (!workerName) return;

  const contextPath = path.join(root, 'AI_CONTEXT.md');
  let content = readFileSafe(contextPath);
  if (!content) {
    console.warn('AI_CONTEXT.md not found, skipping update.');
    return;
  }

  // Normalization: Ensure clean section for update
  const statusLine = `- ${workerName}: completed`;
  
  if (content.includes(statusLine)) {
    console.log(`AI_CONTEXT.md already contains status for ${workerName}`);
    return;
  }

  const workerSectionRegex = /## Worker完了ステータス\n([\s\S]*?)(?=\n##|$)/;
  const match = content.match(workerSectionRegex);

  if (match) {
    const currentList = match[1].trim();
    const newList = currentList ? `${currentList}\n${statusLine}` : statusLine;
    content = content.replace(workerSectionRegex, `## Worker完了ステータス\n\n${newList}`);
    console.log(`Updated AI_CONTEXT.md with ${workerName}: completed`);
  } else {
    // Append section if missing (before Backlog or end)
    const backlogIndex = content.indexOf('## Backlog');
    const newSection = `## Worker完了ステータス\n\n${statusLine}\n\n`;
    
    if (backlogIndex !== -1) {
      content = content.slice(0, backlogIndex) + newSection + content.slice(backlogIndex);
    } else {
      content += `\n${newSection}`;
    }
    console.log(`Created Worker Status section in AI_CONTEXT.md`);
  }

  writeFileSafe(contextPath, content);
}

function verifySystemHealth() {
  console.log('Running system health check...');
  if (!runCommand('node scripts/sw-doctor.js --profile shared-orch-doctor --format text', { quiet: true })) {
    throw new Error('System health check failed. Please run sw-doctor.js to investigate.');
  }
  console.log('System health check passed.');
}

function updateGit(commitMessage) {
  console.log('Staging all changes...');
  if (!runCommand('git add .')) return false;

  try {
    execSync('git diff --cached --quiet');
    console.log('No changes to commit.');
    return true;
  } catch (e) {
    // Changes exist
  }

  console.log(`Committing with message: "${commitMessage}"`);
  return runCommand(`git commit -m "${commitMessage}"`);
}

function main() {
  const root = process.cwd();
  const docsDir = path.join(root, 'docs');
  const inboxDir = path.join(docsDir, 'inbox');
  const reportsDir = path.join(docsDir, 'reports');

  const commitMsg = getArgValue('--commit') || 'chore: finalize phase';
  const workerName = getArgValue('--worker-complete');
  const dryRun = process.argv.includes('--dry-run');

  console.log('=== Finalize Phase Automation (Enhanced) ===\n');

  try {
    // 1. Archive Reports
    if (!dryRun) {
      const moved = moveReports(inboxDir, reportsDir);
      console.log(`\nArchived ${moved} reports.`);
    }

    // 2. Update AI Context
    if (!dryRun && workerName) {
      updateAiContext(root, workerName);
    }

    // 3. Health Check
    if (!dryRun) {
      verifySystemHealth();
    }

    // 4. Git Commit
    if (!dryRun) {
      updateGit(commitMsg);
    }

    console.log('\n=== Phase Finalization Complete ===');
    console.log('Ready to push.');

  } catch (error) {
    console.error('\n❌ Finalization Failed:');
    console.error(error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
