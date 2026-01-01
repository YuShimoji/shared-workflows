const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

let doctorProfiles;
try {
  doctorProfiles = require('./utils/doctor-profiles');
} catch (e) {
  console.warn('Warning: doctor-profiles.js not found. Using minimal profiles.');
  doctorProfiles = {
    'shared-orch-doctor': {
      description: 'Default doctor profile',
      checks: ['env.*', 'script.*', 'audit.*', 'dev-check.*'],
      severityPolicy: { ERROR: 'fail', WARN: 'warn', OK: 'pass' },
      runAudit: true,
      runDevCheck: true
    }
  };
}

let resolveSharedWorkflowsPath, detectSwRoot;
try {
  ({ resolveSharedWorkflowsPath, detectSwRoot } = require('./utils/sw-path'));
} catch (e) {
  console.warn('Warning: sw-path.js not found. Using fallback path resolution.');
  detectSwRoot = (projectRoot) => {
    const candidates = [
      path.join(projectRoot || process.cwd(), '.shared-workflows'),
      path.join(projectRoot || process.cwd(), 'shared-workflows'),
      path.resolve(__dirname, '..', '..')
    ];
    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) return candidate;
    }
    return null;
  };
  resolveSharedWorkflowsPath = (relativePath, options = {}) => {
    const projectRoot = path.resolve(options.projectRoot || process.cwd());
    return { path: path.join(projectRoot, relativePath), projectRoot, swRoot: null };
  };
}

function parseCliArgs(argv) {
  const args = argv.slice(2);
  const options = {
    format: 'text',
    profile: 'shared-orch-doctor',
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--format' && i + 1 < args.length) {
      options.format = args[i + 1];
      i++;
    } else if (arg.startsWith('--format=')) {
      options.format = arg.split('=')[1];
    } else if (arg === '--profile' && i + 1 < args.length) {
      options.profile = args[i + 1];
      i++;
    } else if (arg.startsWith('--profile=')) {
      options.profile = arg.split('=')[1];
    }
  }

  if (!['text', 'json'].includes(options.format)) {
    options.format = 'text';
  }

  return options;
}

function createCheckResult(id, severity, message, context = {}) {
  return { id, severity, message, context };
}

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

function runCommand(cmd, args = [], options = {}) {
  const result = spawnSync(cmd, args, {
    encoding: 'utf8',
    stdio: options.stdio || ['ignore', 'pipe', 'pipe'],
    ...options
  });
  return result;
}

function checkEnvironment(projectRoot, options = {}) {
  const quiet = options.quiet === true;
  if (!quiet) {
    console.log('=== Environment Check ===\n');
  }

  const issues = [];
  const warnings = [];
  const results = [];

  // Check shared-workflows
  const swRoot = detectSwRoot(projectRoot);
  if (swRoot) {
    if (!quiet) {
      console.log(` shared-workflows detected: ${swRoot}`);
    }
    results.push(
      createCheckResult('env.sw-root', 'OK', `shared-workflows detected: ${swRoot}`, { swRoot })
    );
  } else {
    const msg = 'shared-workflows not found. Fallback to docs/ for SSOT files.';
    warnings.push(msg);
    results.push(createCheckResult('env.sw-root', 'WARN', msg));
  }

  // Check required directories
  const requiredDirs = ['docs', 'docs/tasks', 'docs/inbox'];
  for (const dir of requiredDirs) {
    const fullPath = path.join(projectRoot, dir);
    if (fs.existsSync(fullPath)) {
      if (!quiet) {
        console.log(` ${dir} exists`);
      }
      results.push(
        createCheckResult('env.required-dir', 'OK', `${dir} exists`, { dir, path: fullPath })
      );
    } else {
      const msg = `${dir} directory missing`;
      issues.push(msg);
      results.push(
        createCheckResult('env.required-dir', 'ERROR', msg, { dir, path: fullPath })
      );
    }
  }

  // Check required files
  const requiredFiles = ['AI_CONTEXT.md', 'docs/HANDOVER.md', 'REPORT_CONFIG.yml'];
  for (const file of requiredFiles) {
    const fullPath = path.join(projectRoot, file);
    if (fs.existsSync(fullPath)) {
      if (!quiet) {
        console.log(` ${file} exists`);
      }
      results.push(
        createCheckResult('env.required-file', 'OK', `${file} exists`, { file, path: fullPath })
      );
    } else {
      const msg = `${file} not found`;
      warnings.push(msg);
      results.push(
        createCheckResult('env.required-file', 'WARN', msg, { file, path: fullPath })
      );
    }
  }

  // Check SSOT files (latest is REQUIRED, others are legacy/optional)
  const ssotFiles = [
    { file: 'docs/Windsurf_AI_Collab_Rules_latest.md', required: true },
    { file: 'docs/Windsurf_AI_Collab_Rules_v2.0.md', required: false },
    { file: 'docs/Windsurf_AI_Collab_Rules_v1.1.md', required: false }
  ];

  for (const item of ssotFiles) {
    const file = item.file;
    const fullPath = path.join(projectRoot, file);
    if (fs.existsSync(fullPath)) {
      if (!quiet) {
        console.log(` SSOT ${file} exists`);
      }
      results.push(
        createCheckResult('env.ssot-file', 'OK', `SSOT ${file} exists`, { file, path: fullPath })
      );
    } else {
      const severity = item.required ? 'ERROR' : 'WARN';
      const msg = `SSOT ${file} not found${item.required ? ' (REQUIRED)' : ' (Legacy/Optional)'}`;
      if (item.required) issues.push(msg);
      else warnings.push(msg);
      
      results.push(
        createCheckResult('env.ssot-file', severity, msg, { file, path: fullPath })
      );
    }
  }

  return { issues, warnings, swRoot, results };
}

function checkScripts(projectRoot, swRoot, options = {}) {
  const quiet = options.quiet === true;
  if (!quiet) {
    console.log('\n=== Script Availability ===\n');
  }

  const issues = [];
  const warnings = [];
  const results = [];

  const scripts = [
    'scripts/orchestrator-audit.js',
    'scripts/report-validator.js',
    'scripts/ensure-ssot.js',
    'scripts/dev-check.js',
    'scripts/todo-sync.js',
  ];

  for (const script of scripts) {
    const projectPath = path.join(projectRoot, script);
    const swPath = swRoot ? path.join(swRoot, script) : null;

    if (fs.existsSync(projectPath)) {
      if (!quiet) {
        console.log(` ${script} (project)`);
      }
      results.push(
        createCheckResult('script.available', 'OK', `${script} available in project`, {
          script,
          location: 'project',
          path: projectPath,
        })
      );
    } else if (swPath && fs.existsSync(swPath)) {
      if (!quiet) {
        console.log(` ${script} (shared-workflows)`);
      }
      results.push(
        createCheckResult('script.available', 'OK', `${script} available in shared-workflows`, {
          script,
          location: 'shared-workflows',
          path: swPath,
        })
      );
    } else {
      const msg = `${script} not found in project or shared-workflows`;
      warnings.push(msg);
      results.push(
        createCheckResult('script.available', 'WARN', msg, {
          script,
          location: 'none',
        })
      );
    }
  }

  return { issues, warnings, results };
}

function checkWorkflowAssets(projectRoot, swRoot, options = {}) {
  const quiet = options.quiet === true;
  if (!quiet) {
    console.log('\n=== Workflow Assets (Driver/Rules) ===\n');
  }

  const issues = [];
  const warnings = [];
  const results = [];

  // In shared-workflows (submodule) we expect these to exist to support the new architecture.
  const expectedInSw = [
    'prompts/every_time/ORCHESTRATOR_DRIVER.txt',
    'prompts/orchestrator/modules/00_core.md',
    'scripts/apply-cursor-rules.ps1',
    'templates/.cursorrules',
    'templates/.cursor/rules.md',
  ];

  if (swRoot) {
    for (const rel of expectedInSw) {
      const p = path.join(swRoot, rel);
      if (fs.existsSync(p)) {
        results.push(createCheckResult('workflow.sw-asset', 'OK', `shared-workflows asset OK: ${rel}`, { path: p }));
      } else {
        const msg = `shared-workflows asset missing (likely outdated submodule): ${rel}`;
        warnings.push(msg);
        results.push(createCheckResult('workflow.sw-asset', 'WARN', msg, { path: p }));
      }
    }
  } else {
    const msg = 'shared-workflows not found; cannot verify Driver/modules/assets in submodule.';
    warnings.push(msg);
    results.push(createCheckResult('workflow.sw-asset', 'WARN', msg));
  }

  // In the consumer project root, recommend rules files for stability (non-fatal).
  const recommendedInProject = [
    '.cursorrules',
    '.cursor/rules.md',
  ];
  for (const rel of recommendedInProject) {
    const p = path.join(projectRoot, rel);
    if (fs.existsSync(p)) {
      results.push(createCheckResult('workflow.project-rules', 'OK', `recommended rules file present: ${rel}`, { path: p }));
    } else {
      const msg = `recommended rules file missing: ${rel} (run apply-cursor-rules.ps1 to improve stability)`;
      warnings.push(msg);
      results.push(createCheckResult('workflow.project-rules', 'WARN', msg, { path: p }));
    }
  }

  // “Long work stop” proxy: stale MISSION_LOG when IN_PROGRESS.
  const missionLogPath = path.join(projectRoot, '.cursor', 'MISSION_LOG.md');
  if (fs.existsSync(missionLogPath)) {
    const stat = fs.statSync(missionLogPath);
    const ageMinutes = (Date.now() - stat.mtimeMs) / 60000;
    const content = readFileSafe(missionLogPath) || '';
    const looksInProgress = /IN_PROGRESS/i.test(content);
    if (looksInProgress && ageMinutes > 60) {
      const msg = `MISSION_LOG.md is stale (${Math.round(ageMinutes)} min) while IN_PROGRESS; possible context loss/stuck session`;
      warnings.push(msg);
      results.push(createCheckResult('workflow.mission-log', 'WARN', msg, { path: missionLogPath, ageMinutes: Math.round(ageMinutes) }));
    } else {
      results.push(createCheckResult('workflow.mission-log', 'OK', 'MISSION_LOG.md present', { path: missionLogPath, ageMinutes: Math.round(ageMinutes) }));
    }
  } else {
    const msg = 'MISSION_LOG.md not found (optional but recommended for long tasks stability)';
    warnings.push(msg);
    results.push(createCheckResult('workflow.mission-log', 'WARN', msg, { path: missionLogPath }));
  }

  return { issues, warnings, results };
}

function runAudit(projectRoot, swRoot, options = {}) {
  const quiet = options.quiet === true;
  if (!quiet) {
    console.log('\n=== Running Orchestrator Audit ===\n');
  }

  const results = [];

  const auditPath = path.join(projectRoot, 'scripts/orchestrator-audit.js');
  const swAuditPath = swRoot ? path.join(swRoot, 'scripts/orchestrator-audit.js') : null;

  let scriptPath = null;
  if (fs.existsSync(auditPath)) {
    scriptPath = auditPath;
  } else if (swAuditPath && fs.existsSync(swAuditPath)) {
    scriptPath = swAuditPath;
  } else {
    const msg = 'orchestrator-audit.js not found. Skipping audit.';
    if (!quiet) {
      console.warn(msg);
    }
    results.push(createCheckResult('audit.available', 'WARN', msg));
    return { issues: [], warnings: ['orchestrator-audit.js not available'], results };
  }

  const result = runCommand(process.execPath, [scriptPath, '--no-fail'], {
    cwd: projectRoot,
    stdio: quiet ? 'ignore' : 'inherit',
  });

  if (result.status !== 0) {
    const msg = `orchestrator-audit.js exited with status ${result.status}`;
    results.push(createCheckResult('audit.run', 'WARN', msg, { status: result.status }));
    return { issues: [], warnings: [msg], results };
  }

  results.push(createCheckResult('audit.run', 'OK', 'orchestrator-audit.js completed successfully'));
  return { issues: [], warnings: [], results };
}

function runDevCheck(projectRoot, options = {}) {
  const quiet = options.quiet === true;
  if (!quiet) {
    console.log('\n=== Running Dev Check ===\n');
  }

  const results = [];

  const devCheckPath = path.join(projectRoot, 'scripts/dev-check.js');
  if (!fs.existsSync(devCheckPath)) {
    const msg = 'dev-check.js not found. Skipping dev check.';
    if (!quiet) {
      console.warn(msg);
    }
    results.push(createCheckResult('dev-check.available', 'WARN', msg));
    return { issues: [], warnings: ['dev-check.js not available'], results };
  }

  const result = runCommand(process.execPath, [devCheckPath], {
    cwd: projectRoot,
    stdio: quiet ? 'ignore' : 'inherit',
  });

  if (result.status !== 0) {
    const msg = `dev-check.js exited with status ${result.status}`;
    results.push(createCheckResult('dev-check.run', 'WARN', msg, { status: result.status }));
    return { issues: [], warnings: [msg], results };
  }

  results.push(createCheckResult('dev-check.run', 'OK', 'dev-check.js completed successfully'));
  return { issues: [], warnings: [], results };
}

function runReportValidation(projectRoot, options = {}) {
  const quiet = options.quiet === true;
  if (!quiet) {
    console.log('\n=== Running Report Validation ===\n');
  }

  const results = [];
  const handoverPath = path.join(projectRoot, 'docs/HANDOVER.md');

  if (!fs.existsSync(handoverPath)) {
    const msg = 'docs/HANDOVER.md not found. Skipping report validation.';
    if (!quiet) {
      console.warn(msg);
    }
    results.push(createCheckResult('report.handover', 'WARN', msg));
    return { issues: [], warnings: [msg], results };
  }

  const validatorPath = path.join(projectRoot, 'scripts/report-validator.js');
  const swValidatorPath = detectSwRoot(projectRoot) ? path.join(detectSwRoot(projectRoot), 'scripts/report-validator.js') : null;
  let scriptPath = null;

  if (fs.existsSync(validatorPath)) {
    scriptPath = validatorPath;
  } else if (swValidatorPath && fs.existsSync(swValidatorPath)) {
    scriptPath = swValidatorPath;
  } else {
    const msg = 'report-validator.js not found. Skipping report validation.';
    if (!quiet) {
      console.warn(msg);
    }
    results.push(createCheckResult('report.validator', 'WARN', msg));
    return { issues: [], warnings: [msg], results };
  }

  const result = runCommand(process.execPath, [scriptPath, handoverPath, 'REPORT_CONFIG.yml', projectRoot], {
    cwd: projectRoot,
    stdio: quiet ? 'ignore' : 'inherit',
  });

  if (result.status !== 0) {
    const msg = `report-validator.js exited with status ${result.status}`;
    results.push(createCheckResult('report.validation', 'WARN', msg, { status: result.status }));
    return { issues: [], warnings: [msg], results };
  }

  results.push(createCheckResult('report.validation', 'OK', 'HANDOVER.md validation passed'));
  return { issues: [], warnings: [], results };
}

function runTodoCheck(projectRoot, options = {}) {
  const quiet = options.quiet === true;
  if (!quiet) {
    console.log('\n=== Running Todo Check ===\n');
  }

  const results = [];
  const aiContextPath = path.join(projectRoot, 'AI_CONTEXT.md');

  if (!fs.existsSync(aiContextPath)) {
    const msg = 'AI_CONTEXT.md not found. Skipping todo check.';
    if (!quiet) {
      console.warn(msg);
    }
    results.push(createCheckResult('todo.context', 'WARN', msg));
    return { issues: [], warnings: [msg], results };
  }

  const todoPath = path.join(projectRoot, 'scripts/todo-leak-preventer.js');
  if (!fs.existsSync(todoPath)) {
    const msg = 'todo-leak-preventer.js not found. Skipping todo check.';
    if (!quiet) {
      console.warn(msg);
    }
    results.push(createCheckResult('todo.preventer', 'WARN', msg));
    return { issues: [], warnings: [msg], results };
  }

  const result = runCommand(process.execPath, [todoPath], {
    cwd: projectRoot,
    stdio: quiet ? 'ignore' : 'inherit',
  });

  if (result.status !== 0) {
    const msg = `todo-leak-preventer.js exited with status ${result.status}`;
    results.push(createCheckResult('todo.check', 'WARN', msg, { status: result.status }));
    return { issues: [], warnings: [msg], results };
  }

  results.push(createCheckResult('todo.check', 'OK', 'AI_CONTEXT.md todo check passed'));
  return { issues: [], warnings: [], results };
}

function suggestRepairs(allIssues, allWarnings) {
  console.log('\n=== Repair Suggestions ===\n');

  if (allIssues.length === 0 && allWarnings.length === 0) {
    console.log(' No issues detected. System is healthy.');
    return;
  }

  if (allIssues.length > 0) {
    console.log('Critical Issues:');
    for (const issue of allIssues) {
      console.log(`  - ${issue}`);
    }
    console.log('\nRecommended Actions:');
    console.log('  1. Run: git submodule sync --recursive');
    console.log('  2. Run: git submodule update --init --recursive --remote');
    console.log('  3. Run: node scripts/ensure-ssot.js --no-fail');
    console.log('  4. Create missing directories: docs/tasks docs/inbox');
    console.log('  5. Create missing files from templates (AI_CONTEXT.md, HANDOVER.md)');
  }

  if (allWarnings.length > 0) {
    console.log('\nWarnings:');
    for (const warning of allWarnings) {
      console.log(`  - ${warning}`);
    }

    const mentionsOutdatedSw = allWarnings.some(w => /outdated submodule|shared-workflows asset missing/i.test(w));
    if (mentionsOutdatedSw) {
      console.log('\nRecommended Actions (shared-workflows update):');
      console.log('  - Parent repo (recommended): git submodule sync --recursive && git submodule update --init --recursive --remote');
      console.log('  - Or inside submodule (fallback): git -C .shared-workflows checkout main && git -C .shared-workflows pull --ff-only');
      console.log('  - Optional check: node .shared-workflows/scripts/sw-update-check.js');
    }
  }
}

function filterResultsByProfile(allResults, profile) {
  if (!profile.checks || profile.checks.length === 0) {
    return allResults;
  }
  
  return allResults.filter(result => {
    return profile.checks.some(pattern => {
      if (pattern.endsWith('*')) {
        const prefix = pattern.slice(0, -1);
        return result.id.startsWith(prefix);
      }
      return result.id === pattern;
    });
  });
}

function evaluateResults(results, severityPolicy) {
  const issues = [];
  const warnings = [];
  
  for (const result of results) {
    const policy = severityPolicy[result.severity];
    if (policy === 'fail') {
      issues.push(result.message);
    } else if (policy === 'warn') {
      warnings.push(result.message);
    }
  }
  
  return { issues, warnings };
}

function checkSSOTContent(projectRoot, options = {}) {
  const quiet = options.quiet === true;
  if (!quiet) {
    console.log('\n=== SSOT Content Check ===\n');
  }

  const issues = [];
  const warnings = [];
  const results = [];

  // Check latest.md content
  const latestPath = path.join(projectRoot, 'docs/Windsurf_AI_Collab_Rules_latest.md');
  if (fs.existsSync(latestPath)) {
    const content = readFileSafe(latestPath);
    if (!content || content.trim().length < 100) {
      const msg = 'SSOT latest.md appears to be empty or too short';
      issues.push(msg);
      results.push(createCheckResult('ssot.content.latest', 'ERROR', msg, { path: latestPath }));
    } else {
      results.push(createCheckResult('ssot.content.latest', 'OK', 'SSOT latest.md has valid content'));
    }
  }

  // Check legacy files for warning
  const legacyFiles = [
    'docs/Windsurf_AI_Collab_Rules_v1.1.md',
    'docs/Windsurf_AI_Collab_Rules_v2.0.md'
  ];

  for (const file of legacyFiles) {
    const fullPath = path.join(projectRoot, file);
    if (fs.existsSync(fullPath)) {
      const content = readFileSafe(fullPath);
      const hasWarning = content && (
        content.includes('レガシー') || 
        content.includes('非推奨') || 
        content.includes('latest.md')
      );

      if (!hasWarning) {
        const msg = `${file} exists but missing legacy warning`;
        warnings.push(msg);
        results.push(createCheckResult('ssot.content.legacy', 'WARN', msg, { file }));
      } else {
        if (!quiet) {
          console.log(` ${file} has legacy warning`);
        }
        results.push(createCheckResult('ssot.content.legacy', 'OK', `${file} has legacy warning`));
      }
    }
  }

  return { issues, warnings, results };
}

function runAllChecks(projectRoot, profileId = 'shared-orch-doctor', options = {}) {
  const quiet = options.quiet === true;
  const profile = doctorProfiles[profileId];
  
  if (!profile) {
    throw new Error(`Unknown profile: ${profileId}`);
  }
  
  const envCheck = checkEnvironment(projectRoot, { quiet });
  const ssotContentCheck = checkSSOTContent(projectRoot, { quiet });
  const scriptCheck = checkScripts(projectRoot, envCheck.swRoot, { quiet });
  const workflowCheck = checkWorkflowAssets(projectRoot, envCheck.swRoot, { quiet });
  
  let auditResult = { issues: [], warnings: [], results: [] };
  let devCheckResult = { issues: [], warnings: [], results: [] };
  let reportValidationResult = { issues: [], warnings: [], results: [] };
  let todoCheckResult = { issues: [], warnings: [], results: [] };
  
  if (profile.runAudit && envCheck.issues.length === 0) {
    auditResult = runAudit(projectRoot, envCheck.swRoot, { quiet });
  }
  
  if (profile.runDevCheck && envCheck.issues.length === 0 && auditResult.issues.length === 0) {
    devCheckResult = runDevCheck(projectRoot, { quiet });
  }
  
  if (profile.runReportValidation && envCheck.issues.length === 0) {
    reportValidationResult = runReportValidation(projectRoot, { quiet });
  }
  
  if (profile.runTodoCheck && envCheck.issues.length === 0) {
    todoCheckResult = runTodoCheck(projectRoot, { quiet });
  }
  
  const allResults = [
    ...envCheck.results,
    ...ssotContentCheck.results,
    ...scriptCheck.results,
    ...workflowCheck.results,
    ...auditResult.results,
    ...devCheckResult.results,
    ...reportValidationResult.results,
    ...todoCheckResult.results
  ];
  
  const filteredResults = filterResultsByProfile(allResults, profile);
  const { issues, warnings } = evaluateResults(filteredResults, profile.severityPolicy);
  
  return {
    profile: profileId,
    profileDescription: profile.description,
    summary: { issues, warnings },
    results: {
      environment: envCheck.results,
      ssotContent: ssotContentCheck.results,
      scripts: scriptCheck.results,
      workflow: workflowCheck.results,
      audit: auditResult.results,
      devCheck: devCheckResult.results,
      reportValidation: reportValidationResult.results,
      todoCheck: todoCheckResult.results
    },
    allResults: filteredResults
  };
}

function main() {
  const projectRoot = process.cwd();
  const cliOptions = parseCliArgs(process.argv);
  const quiet = cliOptions.format === 'json';

  if (!quiet) {
    console.log('Shared Workflows Doctor\n');
    console.log(`Project Root: ${projectRoot}\n`);
    const profile = doctorProfiles[cliOptions.profile];
    if (profile) {
      console.log(`Profile: ${cliOptions.profile} - ${profile.description}\n`);
    }
  }

  let checkResult;
  try {
    checkResult = runAllChecks(projectRoot, cliOptions.profile, { quiet });
  } catch (e) {
    if (cliOptions.format === 'json') {
      process.stdout.write(JSON.stringify({ error: e.message }, null, 2));
      process.stdout.write('\n');
      process.exit(1);
    }
    console.error(`Error: ${e.message}`);
    process.exit(1);
  }

  if (cliOptions.format === 'json') {
    const payload = {
      projectRoot,
      profile: checkResult.profile,
      profileDescription: checkResult.profileDescription,
      summary: checkResult.summary,
      results: checkResult.results
    };

    const hasIssues = checkResult.summary.issues.length > 0;
    process.stdout.write(JSON.stringify(payload, null, 2));
    process.stdout.write('\n');
    process.exit(hasIssues ? 1 : 0);
  }

  suggestRepairs(checkResult.summary.issues, checkResult.summary.warnings);

  if (checkResult.summary.issues.length > 0) {
    console.log('\n Critical issues detected. Please address them before proceeding.');
    process.exit(1);
  }

  console.log('\n Doctor check complete.');
  process.exit(0);
}

if (require.main === module) {
  main();
}

module.exports = { 
  checkEnvironment, 
  checkScripts, 
  runAudit, 
  runDevCheck,
  runReportValidation,
  runTodoCheck,
  checkSSOTContent,
  runAllChecks,
  createCheckResult,
  doctorProfiles
};
