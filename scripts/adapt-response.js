const fs = require('fs');
const path = require('path');

function loadFeedbackLog() {
  const logPath = path.join(process.cwd(), 'AI_FEEDBACK_LOG.md');
  if (!fs.existsSync(logPath)) {
    return [];
  }
  const text = fs.readFileSync(logPath, 'utf-8');
  const lines = text.split(/\r?\n/);
  const logs = [];
  let currentLog = null;
  lines.forEach((line) => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;
    if (line.startsWith('## ')) {
      if (currentLog) logs.push(currentLog);
      currentLog = { timestamp: '', model: '', creativity_score: 0, clarity_score: 0, good_points: '', bad_points: '', suggestions: '' };
      return;
    }
    if (!currentLog) return;
    if (line.startsWith('- Timestamp:')) {
      currentLog.timestamp = line.replace('- Timestamp:', '').trim();
    } else if (line.startsWith('- Model:')) {
      currentLog.model = line.replace('- Model:', '').trim();
    } else if (line.startsWith('- Creativity Score:')) {
      currentLog.creativity_score = parseInt(line.replace('- Creativity Score:', '').trim()) || 0;
    } else if (line.startsWith('- Clarity Score:')) {
      currentLog.clarity_score = parseInt(line.replace('- Clarity Score:', '').trim()) || 0;
    } else if (line.startsWith('- Good Points:')) {
      currentLog.good_points = line.replace('- Good Points:', '').trim();
    } else if (line.startsWith('- Bad Points:')) {
      currentLog.bad_points = line.replace('- Bad Points:', '').trim();
    } else if (line.startsWith('- Suggestions:')) {
      currentLog.suggestions = line.replace('- Suggestions:', '').trim();
    }
  });
  if (currentLog) logs.push(currentLog);
  return logs;
}

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
    return parsed;
  }
  return { adaptation: { score_threshold: { creativity: 7, clarity: 7 }, fallback_style: 'standard' } };
}

function analyzeLogs(logs, config) {
  if (logs.length === 0) return { recommended_style: config.adaptation.fallback_style, adjustments: ['No feedback available. Using fallback style.'] };

  const avgCreativity = logs.reduce((sum, log) => sum + log.creativity_score, 0) / logs.length;
  const avgClarity = logs.reduce((sum, log) => sum + log.clarity_score, 0) / logs.length;
  const thresholdCreativity = config.adaptation.score_threshold.creativity;
  const thresholdClarity = config.adaptation.score_threshold.clarity;

  let recommendedStyle = config.adaptation.fallback_style;
  const adjustments = [];

  if (avgCreativity < thresholdCreativity) {
    adjustments.push('Increase creativity: Suggest more alternative ideas and metaphors.');
    recommendedStyle = 'creative';
  } else if (avgCreativity > thresholdCreativity + 1) {
    adjustments.push('Creativity is high; maintain or add more innovative triggers.');
  }

  if (avgClarity < thresholdClarity) {
    adjustments.push('Improve clarity: Use more structured formats and avoid ambiguous phrases.');
    recommendedStyle = 'standard';
  } else if (avgClarity > thresholdClarity + 1) {
    adjustments.push('Clarity is strong; experiment with narrative or creative styles.');
  }

  const commonSuggestions = logs.map((log) => log.suggestions).filter((s) => s);
  if (commonSuggestions.length > 0) {
    adjustments.push('Common suggestions: ' + commonSuggestions.join('; '));
  }

  return { recommended_style: recommendedStyle, adjustments };
}

function buildHint(analysis) {
  const lines = [];
  lines.push('# Adaptation Hint');
  lines.push('');
  lines.push(`## Recommended Style: ${analysis.recommended_style}`);
  lines.push('');
  lines.push('## Adjustments');
  analysis.adjustments.forEach((adj) => lines.push(`- ${adj}`));
  lines.push('');
  lines.push('## Next Steps');
  lines.push('- Apply the recommended style in `AI_CONTEXT.md`.');
  lines.push('- Update `REPORT_CONFIG.yml` if needed for project-specific tuning.');
  return lines.join('\n');
}

function main() {
  const logs = loadFeedbackLog();
  const config = loadConfig();
  if (!config) {
    console.error('REPORT_CONFIG.yml not found.');
    process.exit(1);
  }
  const analysis = analyzeLogs(logs, config);
  const hint = buildHint(analysis);
  const outputPath = path.join(process.cwd(), 'ADAPTATION_HINT.md');
  fs.writeFileSync(outputPath, hint, 'utf-8');
  console.log(`Adaptation hint generated. Recommended style: ${analysis.recommended_style}`);
}

main();
