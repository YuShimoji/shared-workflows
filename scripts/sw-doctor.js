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
      console.log(`✓ shared-workflows detected: ${swRoot}`);
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
        console.log(`✓ ${dir} exists`);
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
        console.log(`✓ ${file} exists`);
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

  // Check SSOT files
  const ssotFiles = ['docs/Windsurf_AI_Collab_Rules_latest.md', 'docs/Windsurf_AI_Collab_Rules_v2.0.md'];
  for (const file of ssotFiles) {
    const fullPath = path.join(projectRoot, file);
    if (fs.existsSync(fullPath)) {
      if (!quiet) {
        console.log(`✓ SSOT ${file} exists`);
      }
      results.push(
        createCheckResult('env.ssot-file', 'OK', `SSOT ${file} exists`, { file, path: fullPath })
      );
    } else {
      const msg = `SSOT ${file} not found`;
      warnings.push(msg);
      results.push(
        createCheckResult('env.ssot-file', 'WARN', msg, { file, path: fullPath })
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
        console.log(`✓ ${script} (project)`);
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
        console.log(`✓ ${script} (shared-workflows)`);
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

function suggestRepairs(allIssues, allWarnings) {
  console.log('\n=== Repair Suggestions ===\n');

  if (allIssues.length === 0 && allWarnings.length === 0) {
    console.log('✓ No issues detected. System is healthy.');
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

function runAllChecks(projectRoot, profileId = 'shared-orch-doctor', options = {}) {
  const quiet = options.quiet === true;
  const profile = doctorProfiles[profileId];
  
  if (!profile) {
    throw new Error(`Unknown profile: ${profileId}`);
  }
  
  const envCheck = checkEnvironment(projectRoot, { quiet });
  const scriptCheck = checkScripts(projectRoot, envCheck.swRoot, { quiet });
  
  let auditResult = { issues: [], warnings: [], results: [] };
  let devCheckResult = { issues: [], warnings: [], results: [] };
  
  if (profile.runAudit && envCheck.issues.length === 0) {
    auditResult = runAudit(projectRoot, envCheck.swRoot, { quiet });
  }
  
  if (profile.runDevCheck && envCheck.issues.length === 0 && auditResult.issues.length === 0) {
    devCheckResult = runDevCheck(projectRoot, { quiet });
  }
  
  const allResults = [
    ...envCheck.results,
    ...scriptCheck.results,
    ...auditResult.results,
    ...devCheckResult.results
  ];
  
  const filteredResults = filterResultsByProfile(allResults, profile);
  const { issues, warnings } = evaluateResults(filteredResults, profile.severityPolicy);
  
  return {
    profile: profileId,
    profileDescription: profile.description,
    summary: { issues, warnings },
    results: {
      environment: envCheck.results,
      scripts: scriptCheck.results,
      audit: auditResult.results,
      devCheck: devCheckResult.results
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
    console.log('\n⚠ Critical issues detected. Please address them before proceeding.');
    process.exit(1);
  }

  console.log('\n✓ Doctor check complete.');
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
  runAllChecks,
  createCheckResult,
  doctorProfiles
};
