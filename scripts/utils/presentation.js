const fs = require('fs');
const path = require('path');

let resolveSharedWorkflowsPath;
try {
  ({ resolveSharedWorkflowsPath } = require('./sw-path'));
} catch (e) {
  resolveSharedWorkflowsPath = (relativePath, options = {}) => {
    const projectRoot = path.resolve(options.projectRoot || process.cwd());
    return { path: path.join(projectRoot, relativePath), projectRoot, swRoot: null };
  };
}

function readJsonSafe(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function loadPresentationConfig(options = {}) {
  const projectRoot = path.resolve(options.projectRoot || process.cwd());
  const resolved = resolveSharedWorkflowsPath(path.join('data', 'presentation.json'), {
    projectRoot,
    preferSwRoot: true,
  });

  const config = resolved.path ? readJsonSafe(resolved.path) : null;
  if (config) {
    return { config, sourcePath: resolved.path };
  }

  return {
    config: {
      version: 1,
      policy: {
        no_emoji: true,
        allowed_symbols: {
          rating: { filled: '★', empty: '☆' },
          progress_bar: { filled: '■', empty: '□' },
        },
      },
      progress: { default_width: 20, chat_width: 15 },
      recommendation: {
        max_level: 3,
        format: { 3: '★★★', 2: '★★☆', 1: '★☆☆' },
      },
      task_types: {
        blocked: { label: '[BLOCKED]' },
        ui: { label: '[UI]' },
        test: { label: '[TEST]' },
        bugfix: { label: '[BUG]' },
        docs: { label: '[DOCS]' },
        refactor: { label: '[REFACTOR]' },
        feature: { label: '[FEATURE]' },
        cicd: { label: '[CI/CD]' },
        task: { label: '[TASK]' },
      },
    },
    sourcePath: null,
  };
}

function clampPercent(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function createProgressBar(percentage, width, config) {
  const pct = clampPercent(percentage);
  const barWidth = Number.isFinite(width) ? width : 20;
  const filled = Math.round((pct / 100) * barWidth);
  const empty = Math.max(0, barWidth - filled);

  const filledCh =
    config?.policy?.allowed_symbols?.progress_bar?.filled ||
    config?.policy?.allowed_symbols?.progressBar?.filled ||
    '■';
  const emptyCh =
    config?.policy?.allowed_symbols?.progress_bar?.empty ||
    config?.policy?.allowed_symbols?.progressBar?.empty ||
    '□';

  return String(filledCh).repeat(filled) + String(emptyCh).repeat(empty);
}

function formatRecommendation(level, config) {
  const lv = Math.max(1, Math.min(3, parseInt(level, 10) || 1));
  const fmt = config?.recommendation?.format || {};
  return fmt[String(lv)] || fmt[lv] || (lv === 3 ? '★★★' : lv === 2 ? '★★☆' : '★☆☆');
}

function getTaskTypeLabel(type, config) {
  const key = String(type || 'task');
  const label = config?.task_types?.[key]?.label;
  return label || '[TASK]';
}

module.exports = {
  loadPresentationConfig,
  createProgressBar,
  formatRecommendation,
  getTaskTypeLabel,
  clampPercent,
};
