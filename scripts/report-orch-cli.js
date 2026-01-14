const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
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

function formatParts(date, offsetMinutes) {
  const shifted = new Date(date.getTime() + offsetMinutes * 60000);
  const year = shifted.getUTCFullYear();
  const month = String(shifted.getUTCMonth() + 1).padStart(2, '0');
  const day = String(shifted.getUTCDate()).padStart(2, '0');
  const hour = String(shifted.getUTCHours()).padStart(2, '0');
  const minute = String(shifted.getUTCMinutes()).padStart(2, '0');
  const second = String(shifted.getUTCSeconds()).padStart(2, '0');
  return { year, month, day, hour, minute, second };
}

function formatIsoWithOffset(date, offsetMinutes) {
  const parts = formatParts(date, offsetMinutes);
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const abs = Math.abs(offsetMinutes);
  const offsetHour = String(Math.floor(abs / 60)).padStart(2, '0');
  const offsetMin = String(abs % 60).padStart(2, '0');
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}${sign}${offsetHour}:${offsetMin}`;
}

function formatFilename(date, offsetMinutes) {
  const parts = formatParts(date, offsetMinutes);
  return `${parts.year}${parts.month}${parts.day}_${parts.hour}${parts.minute}`;
}

function applyTemplate(content, replacements) {
  let result = content;
  for (const [token, value] of Object.entries(replacements)) {
    const re = new RegExp(token, 'g');
    result = result.replace(re, value);
  }
  return result;
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function normalizePath(p) {
  return p.replace(/\\/g, '/');
}

function runValidator(reportPath, projectRoot) {
  try {
    const { path: validatorPath } = requireSharedWorkflowsPath(
      path.join('scripts', 'report-validator.js'),
      { projectRoot, preferSwRoot: true }
    );
    const { path: configPath } = requireSharedWorkflowsPath(
      'REPORT_CONFIG.yml',
      { projectRoot, preferSwRoot: true }
    );

    console.log(`Running validator for ${reportPath}`);
    execSync(`node "${validatorPath}" "${reportPath}" "${configPath}" "${projectRoot}"`, {
      stdio: 'inherit'
    });
  } catch (error) {
    console.log(`Validator を実行できませんでした: ${error.message}`);
  }
}

function updateHandoverLatest(handoverPath, reportPath, summary) {
  if (!fs.existsSync(handoverPath)) {
    throw new Error(`HANDOVER が見つかりません: ${handoverPath}`);
  }
  const content = fs.readFileSync(handoverPath, 'utf8');
  const lines = content.split(/\r?\n/);
  const headerIndex = lines.findIndex((line) => line.trim() === '## Latest Orchestrator Report');
  if (headerIndex === -1) {
    throw new Error('HANDOVER.md に「## Latest Orchestrator Report」セクションが見つかりません。');
  }

  const fileLine = `- File: ${reportPath}`;
  const summaryLine = `- Summary: ${summary || 'State: see report'}`;

  function upsertLine(startsWithText, newValue) {
    const existingIndex = lines.findIndex((line, idx) => idx > headerIndex && line.trim().startsWith(startsWithText));
    if (existingIndex !== -1) {
      lines[existingIndex] = newValue;
      return;
    }
    lines.splice(headerIndex + 1, 0, newValue);
  }

  upsertLine('- File:', fileLine);
  upsertLine('- Summary:', summaryLine);

  fs.writeFileSync(handoverPath, lines.join('\n'));
  console.log(`Updated ${normalizePath(path.relative(process.cwd(), handoverPath))} with latest report info.`);
}

function updateAiContext(contextPath, timestamp, progressPercent, workerStatus) {
  if (!fs.existsSync(contextPath)) {
    console.warn(`Warning: AI_CONTEXT が見つかりません: ${contextPath}`);
    return;
  }
  let content = fs.readFileSync(contextPath, 'utf8');

  // Update Timestamp
  // Match: "- **最終更新**: <timestamp>" or "最終更新: <timestamp>"
  const timestampRe = /(- \*\*最終更新\*\*|最終更新)\s*:\s*[^\n]*/m;
  if (timestampRe.test(content)) {
    content = content.replace(timestampRe, (match, p1) => {
      // Keep the prefix (either "- **最終更新**" or "最終更新") and update timestamp
      return `${p1}: ${timestamp}`;
    });
  }

  // Update Progress if provided
  if (progressPercent !== undefined) {
    // Match: "- **進捗**: 100%（説明文）" or "進捗: 100%（説明文）"
    const progressRe = /(- \*\*進捗\*\*|進捗)\s*:\s*\d+%[^\n]*/m;
    if (progressRe.test(content)) {
      content = content.replace(progressRe, (match, p1) => {
        // Keep the prefix (either "- **進捗**" or "進捗") and update percentage
        return `${p1}: ${progressPercent}%`;
      });
    } else {
      // Progress field doesn't exist, add it after "現在のミッション" section
      const missionSectionMatch = content.match(/(## 現在のミッション[\s\S]*?)(\n## |$)/);
      if (missionSectionMatch) {
        const missionContent = missionSectionMatch[1];
        // Check if progress line already exists in mission section
        if (!/進捗\s*:/.test(missionContent)) {
          // Add progress line before the closing of mission section
          const newProgressLine = `- **進捗**: ${progressPercent}%\n`;
          content = content.replace(missionSectionMatch[0], `${missionContent}\n${newProgressLine}${missionSectionMatch[2]}`);
        }
      }
    }
  }

  // Update Worker Status if provided
  if (workerStatus) {
    const workerStatusSectionHeader = '## Worker完了ステータス';
    // 既存セクションの検出（改行コードを考慮して柔軟に）
    const sectionMatch = content.match(/## Worker完了ステータス[\r\n]+([\s\S]*?)(?=\n## |$)/);
    const newEntry = `- ${workerStatus}`;

    if (sectionMatch) {
      const currentBody = sectionMatch[1];
      const lines = currentBody.split(/\r?\n/).filter(l => l.trim().length > 0);
      const [workerName] = workerStatus.split(':');
      
      let updated = false;
      const newLines = lines.map(line => {
        if (line.includes(`- ${workerName}:`)) {
          updated = true;
          return newEntry;
        }
        return line;
      });

      if (!updated) {
        newLines.push(newEntry);
      }

      const newSectionContent = `${workerStatusSectionHeader}\n\n${newLines.join('\n')}\n\n`;
      content = content.replace(sectionMatch[0], newSectionContent.trimEnd() + '\n\n');
    } else {
      // Create section before Backlog or at the end
      const backlogHeader = '## Backlog';
      const newSection = `${workerStatusSectionHeader}\n\n${newEntry}\n\n`;
      
      // Backlogヘッダーを検索（行頭マッチを推奨）
      const backlogMatch = content.match(/^## Backlog/m);
      if (backlogMatch) {
        content = content.replace(backlogMatch[0], `${newSection}${backlogMatch[0]}`);
      } else {
        content = content.trimEnd() + '\n\n' + newSection;
      }
    }
  }

  fs.writeFileSync(contextPath, content, 'utf8');
  console.log(`Updated ${normalizePath(path.relative(process.cwd(), contextPath))} basics.`);
}

function main() {
  if (hasFlag('--help')) {
    console.log(`Usage: node scripts/report-orch-cli.js [options]

Options:
  --mode <mode>            Report mode (default: orchestration)
  --issue <text>           Related Issue/PR text (default: N/A)
  --actor <name>           Actor name (default: Cascade)
  --timestamp <ISO>        ISO8601 string for Timestamp header
  --tz-offset <minutes>    Offset minutes for timestamp/file naming (default: 540 = +09:00)
  --skip-validate          Skip automatic report validation
  --output <path>          Custom output path (default: docs/inbox/REPORT_ORCH_<timestamp>.md)
  --sync-handover          Update docs/HANDOVER.md Latest Orchestrator Report section
  --sync-context           Update AI_CONTEXT.md basic info (Timestamp, Progress)
  --handover-path <path>   Custom HANDOVER path (default: docs/HANDOVER.md)
  --context-path <path>    Custom AI_CONTEXT path (default: AI_CONTEXT.md)
  --progress <percent>     Progress percentage to set in AI_CONTEXT.md (e.g. 65)
  --worker-status <text>   Append worker status to AI_CONTEXT.md (e.g. "worker_name: completed")
  --summary <text>         Summary text when syncing HANDOVER
`);
    return;
  }

  const root = process.cwd();
  const { path: templatePath } = requireSharedWorkflowsPath(
    path.join('templates', 'ORCHESTRATOR_REPORT_TEMPLATE.md'),
    { projectRoot: root, preferSwRoot: true }
  );

  let template = fs.readFileSync(templatePath, 'utf8');
  const tzOffset = parseInt(parseArg('--tz-offset', '540'), 10);
  const now = new Date();

  const isoTimestamp = parseArg('--timestamp', formatIsoWithOffset(now, tzOffset));
  const fileId = formatFilename(now, tzOffset);
  const defaultOutput = path.join(root, 'docs', 'inbox', `REPORT_ORCH_${fileId}.md`);
  const outputPath = parseArg('--output', defaultOutput);

  if (fs.existsSync(outputPath)) {
    throw new Error(`出力先 ${outputPath} は既に存在します。--output で別名を指定してください。`);
  }

  const actor = parseArg('--actor', 'Cascade');
  const mode = parseArg('--mode', 'orchestration');
  const issue = parseArg('--issue', 'N/A');

  const summary = parseArg('--summary', '');
  const syncHandover = hasFlag('--sync-handover');
  const handoverPath = parseArg('--handover-path', path.join(root, 'docs', 'HANDOVER.md'));

  const syncContext = hasFlag('--sync-context');
  const contextPath = parseArg('--context-path', path.join(root, 'AI_CONTEXT.md'));
  const progressPercent = parseArg('--progress', undefined);
  const workerStatus = parseArg('--worker-status', undefined);

  const replacements = {
    '<ISO8601>': isoTimestamp,
    '<mode>': mode,
    '<関連Issue/PR>': issue,
    '<Issue/PR>': issue,
    '<progress_summary>': '',
    'Cascade': actor
  };

  template = applyTemplate(template, replacements);

  if (!template.includes('## 概要') && !template.includes('## 現状') && !template.includes('## 次のアクション')) {
    template =
`## 概要
- <概要を記載>

## 現状
- <現状詳細を記載>

## 次のアクション
- <次のアクションを記載>

${template}`;
  }

  const content = template;
  ensureDir(outputPath);
  fs.writeFileSync(outputPath, content, 'utf8');
  console.log(`Created ${path.relative(root, outputPath)}`);

  if (!hasFlag('--skip-validate')) {
    runValidator(outputPath, root);
  }

  if (syncHandover) {
    const relativeReportPath = normalizePath(path.relative(root, outputPath));
    updateHandoverLatest(handoverPath, relativeReportPath, summary);
  }

  if (syncContext) {
    updateAiContext(contextPath, isoTimestamp, progressPercent, workerStatus);
  }
}

main();
