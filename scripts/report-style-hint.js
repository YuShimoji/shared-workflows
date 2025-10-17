const fs = require('fs');
const path = require('path');

function loadConfig() {
  const configPath = path.join(process.cwd(), 'REPORT_CONFIG.yml');
  if (!fs.existsSync(configPath)) {
    return null;
  }
  const text = fs.readFileSync(configPath, 'utf-8');
  let yaml;
  try {
    yaml = require('yaml');
  } catch (_err) {
    yaml = null;
  }
  if (yaml) {
    const parsed = yaml.parse(text) || {};
    return normalizeConfig(parsed);
  }
  return parseFallback(text);
}

function normalizeConfig(raw) {
  const config = {
    default_style: raw.default_style || undefined,
    banned_phrases: Array.isArray(raw.banned_phrases) ? raw.banned_phrases.slice() : [],
    style_presets: raw.style_presets ? { ...raw.style_presets } : {},
  };
  Object.keys(config.style_presets).forEach((name) => {
    const preset = config.style_presets[name] || {};
    const headers = Array.isArray(preset.headers) ? preset.headers.slice() : [];
    const notes = typeof preset.notes === 'string' ? preset.notes : '';
    config.style_presets[name] = { headers, notes };
  });
  return config;
}

function parseFallback(text) {
  const config = { banned_phrases: [], style_presets: {} };
  const defaultMatch = text.match(/^default_style:\s*([^\s#]+)/m);
  if (defaultMatch) {
    config.default_style = defaultMatch[1].trim();
  }
  const bannedSection = text.match(/banned_phrases:\s*([\s\S]*?)(?:^\S|\s*$)/m);
  if (bannedSection) {
    const bannedMatches = bannedSection[1].match(/-\s*(.+)/g);
    if (bannedMatches) {
      config.banned_phrases = bannedMatches.map((line) => line.replace(/-\s*/, '').trim());
    }
  }
  const presetsSection = text.match(/style_presets:\s*([\s\S]*)/m);
  if (presetsSection) {
    const block = presetsSection[1];
    const presetRegex = /^\s{2}([A-Za-z0-9_]+):\s*([\s\S]*?)(?=^\s{2}[A-Za-z0-9_]+:\s*|\s*$)/gm;
    let match;
    while ((match = presetRegex.exec(block)) !== null) {
      const name = match[1];
      const body = match[2];
      const headers = [];
      const headerMatches = body.match(/^\s{6}-\s*(.+)$/gm);
      if (headerMatches) {
        headerMatches.forEach((h) => {
          headers.push(h.replace(/^\s{6}-\s*/, '').trim());
        });
      }
      let notes = '';
      const notesMatch = body.match(/^\s{4}notes:\s*>-\s*([\s\S]*)/m);
      if (notesMatch) {
        notes = notesMatch[1]
          .split(/\r?\n/)
          .map((line) => line.replace(/^\s{6}/, '').trimEnd())
          .join('\n')
          .trim();
      }
      config.style_presets[name] = { headers, notes };
    }
  }
  return config;
}

function readAIContextStyle() {
  const contextPath = path.join(process.cwd(), 'AI_CONTEXT.md');
  if (!fs.existsSync(contextPath)) return null;
  const text = fs.readFileSync(contextPath, 'utf-8');
  const match = text.match(/report_style\s*[:=]\s*(.+)/i);
  return match ? match[1].trim() : null;
}

function resolveStyle(config, overrideStyle) {
  if (overrideStyle && config.style_presets[overrideStyle]) {
    return overrideStyle;
  }
  if (config.default_style && config.style_presets[config.default_style]) {
    return config.default_style;
  }
  const firstPreset = Object.keys(config.style_presets)[0];
  if (firstPreset) {
    return firstPreset;
  }
  return overrideStyle || config.default_style || 'standard';
}

function buildHint(config, style) {
  const preset = config.style_presets[style] || { headers: [], notes: '' };
  const lines = [];
  lines.push(`# Report Style Hint`);
  lines.push(`- **Selected style**: ${style}`);
  if (preset.headers.length) {
    lines.push(`- **Suggested headers**: ${preset.headers.join(', ')}`);
  }
  if (preset.notes) {
    lines.push('\n## Notes');
    lines.push(preset.notes);
  }
  if (config.banned_phrases.length) {
    lines.push('\n## Banned phrases');
    config.banned_phrases.forEach((phrase) => {
      lines.push(`- ${phrase}`);
    });
  }
  lines.push('\n## Reminder');
  lines.push('- Include purpose, current status, and next actions in a way that fits the selected style.');
  return lines.join('\n');
}

function main() {
  const config = loadConfig();
  if (!config) {
    console.error('REPORT_CONFIG.yml not found.');
    process.exit(1);
  }
  const overrideStyle = process.argv[2] || readAIContextStyle();
  const style = resolveStyle(config, overrideStyle);
  const hint = buildHint(config, style);
  const outputPath = path.join(process.cwd(), 'REPORT_HINT.md');
  fs.writeFileSync(outputPath, hint, 'utf-8');
  console.log(`Report hint generated for style: ${style}`);
}

main();
