const fs = require('fs');
const path = require('path');

function normalizeStyle(style) {
  if (!style) return null;
  return String(style).trim().toLowerCase();
}

function loadConfig() {
  const configPath = path.join(process.cwd(), 'REPORT_CONFIG.yml');
  if (!fs.existsSync(configPath)) {
    console.error('REPORT_CONFIG.yml not found.');
    process.exit(1);
  }

  const raw = fs.readFileSync(configPath, 'utf-8');
  let yaml;
  try {
    yaml = require('yaml');
  } catch (_err) {
    yaml = null;
  }

  if (yaml) {
    const parsed = yaml.parse(raw) || {};
    return normalizeParsedConfig(parsed);
  }

  return parseFallback(raw);
}

function normalizeParsedConfig(parsed) {
  const defaultStyle = normalizeStyle(parsed.default_style) || 'standard';
  const triggersRaw = parsed.creativity_triggers || {};
  const triggers = {};

  Object.keys(triggersRaw).forEach((key) => {
    const normalizedKey = normalizeStyle(key) || key;
    const list = Array.isArray(triggersRaw[key]) ? triggersRaw[key] : [];
    const cleaned = list
      .filter((item) => typeof item === 'string' && item.trim())
      .map((item) => item.trim());
    if (cleaned.length) {
      triggers[normalizedKey] = cleaned;
    }
  });

  if (!Array.isArray(triggers.default)) {
    triggers.default = [];
  }

  return { defaultStyle, triggers };
}

function parseFallback(text) {
  const defaultMatch = text.match(/^default_style:\s*([^\s#]+)/m);
  const defaultStyle = normalizeStyle(defaultMatch ? defaultMatch[1] : 'standard') || 'standard';
  const triggers = {};

  const lines = text.split(/\r?\n/);
  let inSection = false;
  let currentKey = null;

  lines.forEach((line) => {
    if (/^creativity_triggers:\s*$/.test(line)) {
      inSection = true;
      currentKey = null;
      return;
    }
    if (inSection && /^\S/.test(line)) {
      inSection = false;
      currentKey = null;
      return;
    }
    if (!inSection) {
      return;
    }
    if (/^\s{2}[A-Za-z0-9_]+:\s*$/.test(line)) {
      currentKey = normalizeStyle(line.trim().replace(/:$/, ''));
      if (!triggers[currentKey]) {
        triggers[currentKey] = [];
      }
      return;
    }
    if (currentKey && /^\s{4}-\s*/.test(line)) {
      const value = line.replace(/^\s{4}-\s*/, '').trim();
      if (value) {
        triggers[currentKey].push(value);
      }
    }
  });

  if (!Array.isArray(triggers.default)) {
    triggers.default = [];
  }

  return { defaultStyle, triggers };
}

function resolveStyle(config, requested) {
  const requestedStyle = normalizeStyle(requested);
  if (requestedStyle && config.triggers[requestedStyle]) {
    return requestedStyle;
  }

  const defaultStyle = normalizeStyle(config.defaultStyle);
  if (defaultStyle && config.triggers[defaultStyle]) {
    return defaultStyle;
  }

  if (config.triggers.default && config.triggers.default.length) {
    return 'default';
  }

  const available = Object.keys(config.triggers).filter((key) => key !== 'default');
  if (available.length) {
    return available[0];
  }

  return 'default';
}

function pickTriggers(config, style) {
  const base = Array.isArray(config.triggers.default) ? config.triggers.default : [];
  const styleList = style === 'default' ? [] : Array.isArray(config.triggers[style]) ? config.triggers[style] : [];
  const combined = [...base, ...styleList];
  const unique = [...new Set(combined)];

  if (unique.length <= 3) {
    return unique;
  }

  const shuffled = unique
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  return shuffled.slice(0, 3);
}

function buildHint(style, suggestions, triggersMap) {
  const lines = [];
  lines.push('# Creativity Hint');
  lines.push('');
  lines.push(`- **Target style**: ${style}`);
  lines.push(`- **Generated at**: ${new Date().toISOString()}`);
  lines.push('');

  lines.push('## Suggested triggers for this session');
  if (suggestions.length) {
    suggestions.forEach((trigger) => lines.push(`- ${trigger}`));
  } else {
    lines.push('- (No triggers available. Consider updating `REPORT_CONFIG.yml`.)');
  }
  lines.push('');

  const coreList = Array.isArray(triggersMap.default) ? triggersMap.default : [];
  if (coreList.length) {
    lines.push('## Core triggers (always available)');
    coreList.forEach((trigger) => lines.push(`- ${trigger}`));
    lines.push('');
  }

  const styleList = style === 'default' ? [] : Array.isArray(triggersMap[style]) ? triggersMap[style] : [];
  const filteredStyleList = styleList.filter((item) => !coreList.includes(item));
  if (filteredStyleList.length) {
    lines.push(`## Additional triggers for ${style}`);
    filteredStyleList.forEach((trigger) => lines.push(`- ${trigger}`));
    lines.push('');
  }

  lines.push('## Next actions');
  lines.push('- Apply at least one suggested trigger in the next AI-human interaction.');
  lines.push('- Update `AI_CONTEXT.md` with the chosen triggers and style.');
  lines.push('- Refine `REPORT_CONFIG.yml` if new triggers are needed.');

  return lines.join('\n');
}

function readAIContextStyle() {
  const contextPath = path.join(process.cwd(), 'AI_CONTEXT.md');
  if (!fs.existsSync(contextPath)) {
    return null;
  }
  const text = fs.readFileSync(contextPath, 'utf-8');
  const match = text.match(/report_style\s*[:=]\s*([^\r\n]+)/i);
  return match ? match[1].trim() : null;
}

function main() {
  const config = loadConfig();
  const requestedStyle = process.argv[2] || readAIContextStyle();
  const style = resolveStyle(config, requestedStyle);
  const suggestions = pickTriggers(config, style);
  const hint = buildHint(style, suggestions, config.triggers);
  const outputPath = path.join(process.cwd(), 'CREATIVITY_HINT.md');
  fs.writeFileSync(outputPath, hint, 'utf-8');
  console.log(`Creativity hint generated for style: ${style}`);
}

module.exports = {
  normalizeStyle,
  loadConfig,
  normalizeParsedConfig,
  parseFallback,
  resolveStyle,
  pickTriggers,
  buildHint,
  readAIContextStyle,
  main,
};

if (require.main === module) {
  main();
}
