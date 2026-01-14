const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { resolveSharedWorkflowsPath } = require('./utils/sw-path');

function runCommand(cmd, cwd) {
  try {
    return execSync(cmd, { cwd, encoding: 'utf8' });
  } catch {
    return '';
  }
}

function detectGitRoot(cwd) {
  // まず git rev-parse を試行
  const output = runCommand('git rev-parse --show-toplevel', cwd);
  const root = (output || '').trim();
  if (root) {
    return root;
  }

  // git rev-parse が失敗した場合、親ディレクトリを遡って .git ディレクトリを探す
  let currentDir = path.resolve(cwd || process.cwd());
  const rootPath = path.parse(currentDir).root; // Windows: 'C:\', Unix: '/'

  while (currentDir !== rootPath) {
    const gitDir = path.join(currentDir, '.git');
    try {
      const stat = fs.statSync(gitDir);
      if (stat.isDirectory() || stat.isFile()) {
        // .git がディレクトリまたはファイル（worktree/submodule の場合）の場合
        return currentDir;
      }
    } catch {
      // .git が存在しない場合は次の親ディレクトリへ
    }
    currentDir = path.dirname(currentDir);
  }

  return null;
}

function parseGitLog(repoPath) {
  const log = runCommand('git log --oneline -10', repoPath);
  return /error|fail|exception/i.test(log);
}

function extractSection(content, header) {
  const regex = new RegExp(`## ${header}\\s*\\r?\\n([\\s\\S]*?)(?=\\n## |\\n$)`, 'i');
  const match = content.match(regex);
  return match ? match[1].trim() : '';
}

function ensureOrchestratorSections(reportContent) {
  // Orchestrator report formats:
  // - Legacy: State/Strategy/Tickets/Next/Proposals/Outlook/Verification/Integration Notes
  // - Current (Driver-based): 現状/次のアクション/ガイド/メタプロンプト再投入条件/改善提案（New Feature Proposal）(+ Verification/Integration Notes)
  const legacyRequired = [
    'State',
    'Strategy',
    'Tickets',
    'Next',
    'Proposals',
    'Outlook',
    'Verification',
    'Integration Notes'
  ];

  const currentRequired = [
    '現状',
    '次のアクション',
    'ガイド',
    'メタプロンプト再投入条件',
    '改善提案（New Feature Proposal）',
    'Verification',
    'Integration Notes'
  ];

  const errors = [];
  const warnings = [];

  function hasAll(headers) {
    return headers.every(h => extractSection(reportContent, h));
  }

  // Prefer current format; fallback to legacy for backward compatibility
  const usesCurrent = hasAll(currentRequired);
  const usesLegacy = hasAll(legacyRequired);

  const requiredHeaders = usesCurrent ? currentRequired : legacyRequired;
  if (!usesCurrent && !usesLegacy) {
    // Provide targeted missing list for current format (since it is the recommended one)
    const missingCurrent = currentRequired.filter(h => !extractSection(reportContent, h));
    errors.push(
      `Orchestratorレポートの形式が不正です。推奨フォーマット（現状/次のアクション/ガイド/メタプロンプト再投入条件/改善提案 + Verification/Integration Notes）が不足しています: ${missingCurrent.join(', ')}`
    );
  } else {
    for (const header of requiredHeaders) {
      const section = extractSection(reportContent, header);
      if (!section) {
        errors.push(`Orchestratorレポートに必須セクション '${header}' がありません`);
      } else if (!section.replace(/[-*\s]/g, '').length) {
        warnings.push(`Orchestratorレポートの '${header}' セクションが空です`);
      }
    }
  }

  // Legacy-only: Outlook checks
  const outlookSection = extractSection(reportContent, 'Outlook');
  if (outlookSection) {
    const hasShort = /Short-term/i.test(outlookSection);
    const hasMid = /Mid-term/i.test(outlookSection);
    const hasLong = /Long-term/i.test(outlookSection);
    if (!hasShort || !hasMid || !hasLong) {
      errors.push('Outlook セクションに Short/Mid/Long のいずれかが欠けています');
    }
  }

  // Legacy-only: Tickets checks
  const ticketsSection = extractSection(reportContent, 'Tickets');
  if (ticketsSection && !/- /.test(ticketsSection)) {
    warnings.push('Tickets セクションに箇条書きがありません（完了内容や最後の作業を記述してください）');
  }

  const verificationSection = extractSection(reportContent, 'Verification');
  if (verificationSection && !/git status|node|npm/i.test(verificationSection)) {
    warnings.push('Verification セクションにコマンド実行結果が見当たりません');
  }

  // Current-only: require a stable user reply template in 次のアクション (to avoid "one-off" endings)
  if (usesCurrent) {
    const nextAction = extractSection(reportContent, '次のアクション');
    const hasCompletionJudgement = /完了判定/i.test(nextAction);
    const hasUserReplyTemplate =
      /ユーザー返信テンプレ/i.test(nextAction) ||
      /【次に私（ユーザー）が返す内容】/i.test(nextAction) ||
      /選択肢1|選択肢2|選択肢3/.test(nextAction);

    if (!hasCompletionJudgement || !hasUserReplyTemplate) {
      errors.push(
        "次のアクション に『ユーザー返信テンプレ（完了判定 + 選択肢1-3）』がありません。EVERY_SESSION.md の終了時テンプレに合わせて追記してください。"
      );
    }
  }

  return { errors, warnings };
}

function checkFileStates(reportContent, projectRoot) {
  const changesSection = reportContent.match(/## Changes\n([\s\S]*?)(?=\n## |\n$)/);
  if (!changesSection) return { errors: [], warnings: [] };

  const errors = [];
  const warnings = [];

  const lines = changesSection[1].split('\n').filter(line => line.trim());
  for (const line of lines) {
    const match = line.match(/- \[([^\]]+)\]: (.+)/);
    if (match) {
      const file = match[1];
      const desc = match[2];
      const fullPath = path.join(projectRoot, file);
      if (!fs.existsSync(fullPath)) {
        errors.push(`変更ファイルが存在しません: ${file}`);
      }
      if (desc.includes('error') || desc.includes('fail')) {
        warnings.push(`変更記述にエラーが含まれています: ${line}`);
      }
    }
  }
  return { errors, warnings };
}

function generateSuggestions(errors, warnings) {
  const suggestions = [];
  if (errors.length) {
    suggestions.push('エラーを修正してから再報告してください。');
  }
  if (warnings.length) {
    suggestions.push('警告を考慮して報告を改善してください。');
  }
  if (errors.some(e => e.includes('完了を主張'))) {
    suggestions.push('完了主張時はエラーログを添付し、実際の状態を確認してください。');
  }
  return suggestions;
}

function extractListSection(text, key) {
  const lines = text.split(/\r?\n/);
  const result = [];
  let capturing = false;
  let baseIndent = 0;

  for (const line of lines) {
    const indent = line.match(/^\s*/)[0].length;
    const trimmed = line.trim();

    if (!capturing) {
      if (trimmed.startsWith(`${key}:`)) {
        capturing = true;
        baseIndent = indent;
      }
      continue;
    }

    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    if (indent <= baseIndent) break;

    if (trimmed.startsWith('- ')) {
      result.push(trimmed.slice(2).trim());
    }
  }

  return result;
}

function extractStylePresets(text) {
  const lines = text.split(/\r?\n/);
  const presets = {};
  let capturing = false;
  let current = null;
  let baseIndent = 0;
  let inHeaders = false;

  for (const line of lines) {
    const indent = line.match(/^\s*/)[0].length;
    const trimmed = line.trim();

    if (!capturing) {
      if (trimmed.startsWith('style_presets:')) {
        capturing = true;
        baseIndent = indent;
      }
      continue;
    }

    if (!trimmed) continue;

    if (indent <= baseIndent && !trimmed.startsWith('-')) {
      break;
    }

    if (indent === baseIndent + 2 && trimmed.endsWith(':')) {
      current = trimmed.slice(0, -1).trim();
      presets[current] = { headers: [] };
      inHeaders = false;
      continue;
    }

    if (indent === baseIndent + 4 && trimmed.startsWith('headers:')) {
      inHeaders = true;
      continue;
    }

    if (inHeaders) {
      if (trimmed.startsWith('- ')) {
        presets[current].headers.push(trimmed.slice(2).trim());
        continue;
      } else if (!trimmed.startsWith('#')) {
        inHeaders = false;
      }
    }
  }

  return presets;
}

function loadReportConfig(configPath) {
  const text = fs.readFileSync(configPath, 'utf8');
  const config = {};

  const defaultStyleMatch = text.match(/default_style:\s*([A-Za-z0-9_]+)/);
  config.default_style = defaultStyleMatch ? defaultStyleMatch[1] : 'standard';

  const strictMatch = text.match(/strict_mode:\s*(true|false)/i);
  config.strict_mode = strictMatch ? strictMatch[1].toLowerCase() === 'true' : true;

  config.banned_phrases = extractListSection(text, 'banned_phrases');
  config.style_presets = extractStylePresets(text);

  return config;
}

function validateReport(reportPath, configPath, projectRoot) {
  const reportContent = fs.readFileSync(reportPath, 'utf8');
  const config = loadReportConfig(configPath);

  let warnings = [];
  let errors = [];

  // Strict mode check
  if (config.strict_mode) {
    const isHandover =
      path.basename(reportPath).toLowerCase() === 'handover.md' ||
      /Type\s*:\s*Handover/i.test(reportContent);
    const selectedStyleName =
      isHandover && config.style_presets.handover
        ? 'handover'
        : config.default_style;
    const style = config.style_presets[selectedStyleName];
    if (style) {
      function validateHeaders(content, profileName, profile) {
        const requiredHeaders = profile.headers;
        const missingHeaders = [];
        
        // handoverプロファイルでは標準ヘッダーチェックをスキップ
        if (profileName === 'handover') {
          return { missingHeaders: [], suggestions: [] };
        }
        
        for (const header of requiredHeaders) {
          if (!content.includes(`## ${header}`)) {
            missingHeaders.push(header);
          }
        }
        return { missingHeaders, suggestions: [] };
      }
      const headerChecks = validateHeaders(reportContent, selectedStyleName, style);
      warnings.push(...headerChecks.missingHeaders.map(header => `必須ヘッダー '${header}' がありません`));
    }
  }

  // Banned phrases check
  for (const phrase of config.banned_phrases || []) {
    if (reportContent.includes(phrase)) {
      errors.push(`禁止フレーズ '${phrase}' が含まれています`);
    }
  }

  const typeMatch = reportContent.match(/Type\s*:\s*(.*)/i);
  const reportType = typeMatch ? typeMatch[1].trim() : '';
  if (/Orchestrator/i.test(reportType)) {
    const orchestrationChecks = ensureOrchestratorSections(reportContent);
    errors.push(...orchestrationChecks.errors);
    warnings.push(...orchestrationChecks.warnings);
  }

  // Virtual error detection with log check
  const hasErrorIndicators = /error|fail|exception/i.test(reportContent);
  const claimsCompletion = /完了しました|向上されました/i.test(reportContent);

  if (claimsCompletion && hasErrorIndicators) {
    errors.push('完了を主張しているが、エラー指標が見つかりました');
  }

  if (claimsCompletion && parseGitLog(projectRoot)) {
    errors.push('完了を主張しているが、Gitログにエラーが見つかりました');
  }

  // Git log check
  if (parseGitLog(projectRoot)) {
    warnings.push('Gitログにエラーが見つかりました。');
  }

  // File states check
  const fileChecks = checkFileStates(reportContent, projectRoot);
  errors.push(...fileChecks.errors);
  warnings.push(...fileChecks.warnings);

  const suggestions = generateSuggestions(errors, warnings);
  const isValid = errors.length === 0;

  console.log(`Validation for ${reportPath}:`);
  if (errors.length) {
    console.log('Errors:', errors);
  }
  if (warnings.length) {
    console.log('Warnings:', warnings);
  }
  if (suggestions.length) {
    console.log('Suggestions:', suggestions);
  }
  if (isValid) {
    console.log('OK');
  }

  return { errors, warnings, suggestions, isValid };
}

function appendValidationResultsToReport(reportPath, validationResults) {
  const { errors, warnings, suggestions, isValid } = validationResults;
  let content = fs.readFileSync(reportPath, 'utf8');

  // 検証結果をフォーマット
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const status = isValid ? '✅ OK' : '❌ Errors found';
  
  let validationOutput = `- \`node scripts/report-validator.js\` (${timestamp}): ${status}`;
  
  if (errors.length > 0) {
    validationOutput += `\n  - Errors: ${errors.length}`;
    errors.forEach(err => {
      validationOutput += `\n    - ${err}`;
    });
  }
  
  if (warnings.length > 0) {
    validationOutput += `\n  - Warnings: ${warnings.length}`;
    warnings.forEach(warn => {
      validationOutput += `\n    - ${warn}`;
    });
  }
  
  if (suggestions.length > 0) {
    validationOutput += `\n  - Suggestions:`;
    suggestions.forEach(sugg => {
      validationOutput += `\n    - ${sugg}`;
    });
  }

  // ## Verification セクションを検出
  const verificationRegex = /(## Verification\s*\r?\n)([\s\S]*?)(?=\n## |$)/i;
  const match = content.match(verificationRegex);

  if (match) {
    // 既存の検証結果を検出（report-validator.js の実行結果を探す）
    const existingSection = match[2];
    const validatorResultRegex = /- `node scripts\/report-validator\.js`[^\n]*(?:\n(?:  - |    - )[^\n]*)*/;
    
    // 次のセクションの開始位置を取得
    const sectionEnd = match.index + match[0].length;
    const remainingContent = content.substring(sectionEnd);
    const nextSectionMatch = remainingContent.match(/^\n## /);
    
    if (validatorResultRegex.test(existingSection)) {
      // 既存の検証結果を置き換え
      const newSection = existingSection.replace(validatorResultRegex, validationOutput);
      const replacement = match[1] + newSection;
      content = content.substring(0, match.index) + replacement + remainingContent;
    } else {
      // 既存の検証結果がない場合は追記
      const newSection = existingSection.trim() 
        ? `${existingSection.trim()}\n${validationOutput}`
        : validationOutput;
      const replacement = match[1] + newSection;
      content = content.substring(0, match.index) + replacement + remainingContent;
    }
  } else {
    // ## Verification セクションが存在しない場合は作成
    // Integration Notes の前に追加、なければ最後に追加
    const integrationNotesRegex = /(## Integration Notes\s*\r?\n)/i;
    if (integrationNotesRegex.test(content)) {
      content = content.replace(integrationNotesRegex, `## Verification\n\n${validationOutput}\n\n$1`);
    } else {
      content = content.trimEnd() + `\n\n## Verification\n\n${validationOutput}\n`;
    }
  }

  fs.writeFileSync(reportPath, content, 'utf8');
  console.log(`検証結果をレポートに追記しました: ${reportPath}`);
}

function hasFlag(flag) {
  return process.argv.slice(2).includes(flag);
}

const args = process.argv.slice(2);
const appendToReport = hasFlag('--append-to-report');

// --append-to-report オプションを除いた引数を取得
const filteredArgs = args.filter(arg => arg !== '--append-to-report');

const reportPathArg = filteredArgs[0];
const configPathArg = filteredArgs[1];
const projectRootArg = filteredArgs[2];

if (!reportPathArg) {
  console.error('Usage: node scripts/report-validator.js <reportPath> [configPath] [projectRoot] [--append-to-report]');
  process.exit(1);
}

const resolvedReportPath = path.resolve(reportPathArg);
const reportDir = path.dirname(resolvedReportPath);
const resolvedProjectRoot = projectRootArg
  ? path.resolve(projectRootArg)
  : detectGitRoot(reportDir) || detectGitRoot(process.cwd()) || reportDir;

function resolveConfigPath(inputPath, projectRoot) {
  if (inputPath) {
    const absolute = path.resolve(inputPath);
    if (fs.existsSync(absolute)) {
      return absolute;
    }
  }

  const fallback = resolveSharedWorkflowsPath('REPORT_CONFIG.yml', {
    projectRoot,
    preferSwRoot: true
  });

  if (fallback.path && fs.existsSync(fallback.path)) {
    return fallback.path;
  }

  throw new Error('REPORT_CONFIG.yml が見つかりませんでした。プロジェクトルートか shared-workflows の配置を確認してください。');
}

const resolvedConfigPath = resolveConfigPath(configPathArg, resolvedProjectRoot);

try {
  const validationResults = validateReport(resolvedReportPath, resolvedConfigPath, resolvedProjectRoot);
  
  if (appendToReport) {
    appendValidationResultsToReport(resolvedReportPath, validationResults);
  }
  
  process.exit(validationResults.isValid ? 0 : 1);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
