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
  --handover-path <path>   Custom HANDOVER path (default: docs/HANDOVER.md)
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
}

main();
