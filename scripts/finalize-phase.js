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

function updateTaskReferences(docsDir) {
  const tasksDir = path.join(docsDir, 'tasks');
  const reportsDir = path.join(docsDir, 'reports');
  
  if (!fs.existsSync(tasksDir)) return 0;

  const taskFiles = fs.readdirSync(tasksDir).filter(f => /^TASK_.*\.md$/i.test(f));
  let updatedCount = 0;

  for (const taskFile of taskFiles) {
    const taskPath = path.join(tasksDir, taskFile);
    let content = readFileSafe(taskPath);
    if (!content) continue;

    // Regex to capture "Report: docs/inbox/REPORT_..."
    // We strictly match the prefix to avoid false positives
    const reportLineRegex = /^(Report\s*:\s*)(docs\/inbox\/(REPORT_.*\.md))\s*$/m;
    const match = content.match(reportLineRegex);

    if (match) {
      const prefix = match[1];
      const inboxPathRel = match[2];
      const reportName = match[3];
      
      const inboxPathAbs = path.join(docsDir, 'inbox', reportName);
      const reportsPathAbs = path.join(docsDir, 'reports', reportName);

      // Update if:
      // 1. File is NOT in inbox (already moved or missing)
      // 2. File IS in reports (exists)
      if (!fs.existsSync(inboxPathAbs) && fs.existsSync(reportsPathAbs)) {
        const newPathRel = `docs/reports/${reportName}`;
        content = content.replace(reportLineRegex, `${prefix}${newPathRel}`);
        writeFileSafe(taskPath, content);
        console.log(`Updated reference in ${taskFile}: ${inboxPathRel} -> ${newPathRel}`);
        updatedCount++;
      }
    }
  }
  return updatedCount;
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

function extractWorkerReportInfo(reportPath) {
  const content = readFileSafe(reportPath);
  if (!content) return null;

  const info = {
    file: path.basename(reportPath),
    ticket: null,
    changes: null,
    handover: null,
    summary: null
  };

  // Extract Ticket from header (e.g., **Ticket**: docs/tasks/TASK_008_WorkerReportAutoIntegration.md or **Ticket**: TASK_005_ReportAudit.md)
  const ticketMatch = content.match(/\*\*Ticket\*\*:\s*(.+?)(?:\n|$)/i);
  if (ticketMatch) {
    let ticketValue = ticketMatch[1].trim();
    // If ticket is just a filename without path, try to construct the path
    if (!ticketValue.includes('/') && !ticketValue.includes('\\')) {
      // Assume it's in docs/tasks/ if it starts with TASK_
      if (/^TASK_/.test(ticketValue)) {
        ticketValue = `docs/tasks/${ticketValue}`;
      }
    }
    info.ticket = ticketValue;
  }

  // Extract Changes summary from header (e.g., **Changes**: <変更量要約>)
  const changesHeaderMatch = content.match(/\*\*Changes\*\*:\s*(.+?)(?:\n|$)/i);
  if (changesHeaderMatch) {
    info.changes = changesHeaderMatch[1].trim();
  }

  // Extract Changes section content
  const changesSectionMatch = content.match(/## Changes\s*\n([\s\S]*?)(?=\n## |$)/i);
  if (changesSectionMatch) {
    const changesContent = changesSectionMatch[1].trim();
    // Take first few lines as summary if header Changes is not available
    if (!info.changes && changesContent) {
      const lines = changesContent.split('\n').filter(l => l.trim()).slice(0, 3);
      info.changes = lines.join('; ').replace(/^-\s*/, '').substring(0, 100);
    }
  }

  // Extract Handover section
  const handoverMatch = content.match(/## Handover\s*\n([\s\S]*?)(?=\n## |$)/i);
  if (handoverMatch) {
    info.handover = handoverMatch[1].trim();
  }

  // Generate summary from ticket and changes
  if (info.ticket || info.changes) {
    const parts = [];
    if (info.ticket) {
      const ticketName = path.basename(info.ticket, '.md');
      parts.push(ticketName);
    }
    if (info.changes) {
      parts.push(info.changes);
    }
    info.summary = parts.join(': ');
  }

  return info;
}

function integrateWorkerReports(handoverPath, reportsDir) {
  if (!fs.existsSync(handoverPath)) {
    console.warn(`HANDOVER.md not found: ${handoverPath}`);
    return 0;
  }

  if (!fs.existsSync(reportsDir)) {
    console.warn(`Reports directory not found: ${reportsDir}`);
    return 0;
  }

  // Find Worker reports (REPORT_TASK_*.md)
  const files = fs.readdirSync(reportsDir);
  const workerReports = files.filter(f => /^REPORT_TASK_.*\.md$/i.test(f));
  
  if (workerReports.length === 0) {
    console.log('No Worker reports found in docs/reports/');
    return 0;
  }

  // Extract info from each Worker report
  const reportInfos = [];
  for (const reportFile of workerReports) {
    const reportPath = path.join(reportsDir, reportFile);
    const info = extractWorkerReportInfo(reportPath);
    if (info && (info.ticket || info.changes || info.handover)) {
      reportInfos.push(info);
    }
  }

  if (reportInfos.length === 0) {
    console.log('No valid Worker report information found.');
    return 0;
  }

  // Read HANDOVER.md
  let content = readFileSafe(handoverPath);
  if (!content) {
    console.warn('Could not read HANDOVER.md');
    return 0;
  }

  const lines = content.split(/\r?\n/);
  const integrationSectionIndex = lines.findIndex((line) => 
    line.trim() === '## 統合レポート'
  );

  if (integrationSectionIndex === -1) {
    console.warn('HANDOVER.md に「## 統合レポート」セクションが見つかりません。');
    return 0;
  }

  // Find the end of the integration section (next ## section or end of file)
  let sectionEndIndex = integrationSectionIndex + 1;
  while (sectionEndIndex < lines.length && !lines[sectionEndIndex].trim().startsWith('## ')) {
    sectionEndIndex++;
  }

  // Build new integration entries
  const newEntries = [];
  for (const info of reportInfos) {
    const entryParts = [];
    
    // File reference
    const reportPathRel = `docs/reports/${info.file}`;
    entryParts.push(`- ${reportPathRel}`);
    
    // Ticket reference if available
    if (info.ticket) {
      entryParts.push(`  - Ticket: ${info.ticket}`);
    }
    
    // Changes summary
    if (info.changes) {
      entryParts.push(`  - Changes: ${info.changes}`);
    }
    
    // Handover notes if available
    if (info.handover) {
      const handoverLines = info.handover.split('\n')
        .filter(l => l.trim())
        .map(l => {
          const trimmed = l.trim();
          // If already starts with -, keep it; otherwise add -
          if (trimmed.startsWith('-')) {
            return `  ${trimmed}`;
          }
          return `  - ${trimmed}`;
        })
        .slice(0, 5); // Limit to first 5 lines
      if (handoverLines.length > 0) {
        // Remove "Handover:" prefix if present in first line
        const firstLine = handoverLines[0].replace(/^  - Handover:\s*/i, '  - ');
        entryParts.push(firstLine);
        if (handoverLines.length > 1) {
          entryParts.push(...handoverLines.slice(1));
        }
      }
    }
    
    newEntries.push(entryParts.join('\n'));
  }

  // Check if entries already exist (simple check by file name)
  const existingContent = lines.slice(integrationSectionIndex + 1, sectionEndIndex).join('\n');
  const newEntriesToAdd = newEntries.filter(entry => {
    const fileNameMatch = entry.match(/docs\/reports\/(REPORT_TASK_.*\.md)/);
    if (!fileNameMatch) return true;
    const fileName = fileNameMatch[1];
    return !existingContent.includes(fileName);
  });

  if (newEntriesToAdd.length === 0) {
    console.log('All Worker reports are already integrated in HANDOVER.md');
    return 0;
  }

  // Insert new entries after the section header
  const insertIndex = integrationSectionIndex + 1;
  // Ensure there's a blank line after the header if needed
  if (insertIndex < lines.length && lines[insertIndex].trim() !== '') {
    lines.splice(insertIndex, 0, '');
    sectionEndIndex++;
  }
  
  // Insert new entries
  const entriesToInsert = newEntriesToAdd.join('\n\n');
  lines.splice(insertIndex, 0, entriesToInsert);

  // Write back
  writeFileSafe(handoverPath, lines.join('\n'));
  console.log(`Integrated ${newEntriesToAdd.length} Worker report(s) into HANDOVER.md`);
  
  return newEntriesToAdd.length;
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

      // 1.5 Update Task References (Self-healing)
      const updatedTasks = updateTaskReferences(docsDir);
      if (updatedTasks > 0) {
        console.log(`Updated references in ${updatedTasks} task files.`);
      }

      // 1.6 Integrate Worker Reports into HANDOVER.md
      const handoverPath = path.join(docsDir, 'HANDOVER.md');
      const integrated = integrateWorkerReports(handoverPath, reportsDir);
      if (integrated > 0) {
        console.log(`Integrated ${integrated} Worker report(s) into HANDOVER.md`);
      }
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
