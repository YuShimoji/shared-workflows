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
  const lines = text.split(/\r?\n/);

  let section = null;
  let currentPreset = null;
  let presetSubsection = null;
  let notesIndent = null;
  let notesBuffer = [];

  function ensurePreset(name) {
    if (!config.style_presets[name]) {
      config.style_presets[name] = { headers: [], notes: '' };
    }
  }

  function flushNotes() {
    if (!currentPreset) return;
    if (notesBuffer.length === 0) return;
    const value = notesBuffer.join('\n').replace(/\s+$/g, '').trim();
    if (!value) return;
    ensurePreset(currentPreset);
    config.style_presets[currentPreset].notes = value;
    notesBuffer = [];
    notesIndent = null;
  }

  for (let i = 0; i < lines.length; i += 1) {
    const raw = lines[i];
    if (!raw) continue;

    const trimmedEnd = raw.trimEnd();
    const noIndent = trimmedEnd.trimStart();
    if (!noIndent || noIndent.startsWith('#')) continue;

    const indent = raw.match(/^\s*/)[0].length;

    if (indent === 0) {
      if (presetSubsection === 'notes') flushNotes();
      presetSubsection = null;
      currentPreset = null;

      const defaultStyleMatch = noIndent.match(/^default_style:\s*([^\s#]+)\s*$/);
      if (defaultStyleMatch) {
        config.default_style = defaultStyleMatch[1].trim();
        section = null;
        continue;
      }
      if (/^banned_phrases:\s*$/.test(noIndent)) {
        section = 'banned_phrases';
        continue;
      }
      if (/^style_presets:\s*$/.test(noIndent)) {
        section = 'style_presets';
        continue;
      }
      section = null;
      continue;
    }

    if (section === 'banned_phrases') {
      const match = noIndent.match(/^-\s+(.+)$/);
      if (match) {
        config.banned_phrases.push(match[1].trim());
      }
      continue;
    }

    if (section !== 'style_presets') {
      continue;
    }

    if (presetSubsection === 'notes') {
      if (notesIndent === null) {
        notesIndent = indent;
      }
      if (indent >= notesIndent) {
        notesBuffer.push(raw.slice(notesIndent).trimEnd());
        continue;
      }
      flushNotes();
      presetSubsection = null;
      notesIndent = null;
      notesBuffer = [];
      i -= 1;
      continue;
    }

    if (indent === 2) {
      const presetMatch = noIndent.match(/^([A-Za-z0-9_]+):\s*$/);
      if (presetMatch) {
        currentPreset = presetMatch[1];
        ensurePreset(currentPreset);
        presetSubsection = null;
      }
      continue;
    }

    if (!currentPreset) {
      continue;
    }

    if (indent === 4) {
      const keyMatch = noIndent.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
      if (!keyMatch) {
        presetSubsection = null;
        continue;
      }
      const key = keyMatch[1];
      const rest = (keyMatch[2] || '').trim();

      if (key === 'headers') {
        presetSubsection = 'headers';
        continue;
      }
      if (key === 'notes') {
        if (rest && rest !== '>-' && rest !== '>' && rest !== '|' && rest !== '|-') {
          ensurePreset(currentPreset);
          config.style_presets[currentPreset].notes = rest;
          presetSubsection = null;
          continue;
        }
        presetSubsection = 'notes';
        notesIndent = null;
        notesBuffer = [];
        continue;
      }
      presetSubsection = null;
      continue;
    }

    if (presetSubsection === 'headers') {
      const headerMatch = noIndent.match(/^-\s+(.+)$/);
      if (headerMatch) {
        ensurePreset(currentPreset);
        config.style_presets[currentPreset].headers.push(headerMatch[1].trim());
      }
    }
  }

  if (presetSubsection === 'notes') flushNotes();

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
