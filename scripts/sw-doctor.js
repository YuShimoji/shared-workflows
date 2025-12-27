const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

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

function checkEnvironment(projectRoot) {
  console.log('=== Environment Check ===\n');
  const issues = [];
  const warnings = [];

  // Check shared-workflows
  const swRoot = detectSwRoot(projectRoot);
  if (swRoot) {
    console.log(`✓ shared-workflows detected: ${swRoot}`);
  } else {
    warnings.push('shared-workflows not found. Fallback to docs/ for SSOT files.');
  }

  // Check required directories
  const requiredDirs = ['docs', 'docs/tasks', 'docs/inbox'];
  for (const dir of requiredDirs) {
    const fullPath = path.join(projectRoot, dir);
    if (fs.existsSync(fullPath)) {
      console.log(`✓ ${dir} exists`);
    } else {
      issues.push(`${dir} directory missing`);
    }
  }

  // Check required files
  const requiredFiles = [
    'AI_CONTEXT.md',
    'docs/HANDOVER.md',
    'REPORT_CONFIG.yml'
  ];
  for (const file of requiredFiles) {
    const fullPath = path.join(projectRoot, file);
    if (fs.existsSync(fullPath)) {
      console.log(`✓ ${file} exists`);
    } else {
      warnings.push(`${file} not found`);
    }
  }

  // Check SSOT files
  const ssotFiles = [
    'docs/Windsurf_AI_Collab_Rules_latest.md',
    'docs/Windsurf_AI_Collab_Rules_v2.0.md'
  ];
  for (const file of ssotFiles) {
    const fullPath = path.join(projectRoot, file);
    if (fs.existsSync(fullPath)) {
      console.log(`✓ SSOT ${file} exists`);
    } else {
      warnings.push(`SSOT ${file} not found`);
    }
  }

  return { issues, warnings, swRoot };
}

function checkScripts(projectRoot, swRoot) {
  console.log('\n=== Script Availability ===\n');
  const issues = [];
  const warnings = [];

  const scripts = [
    'scripts/orchestrator-audit.js',
    'scripts/report-validator.js',
    'scripts/ensure-ssot.js',
    'scripts/dev-check.js',
    'scripts/todo-sync.js'
  ];

  for (const script of scripts) {
    const projectPath = path.join(projectRoot, script);
    const swPath = swRoot ? path.join(swRoot, script) : null;

    if (fs.existsSync(projectPath)) {
      console.log(`✓ ${script} (project)`);
    } else if (swPath && fs.existsSync(swPath)) {
      console.log(`✓ ${script} (shared-workflows)`);
    } else {
      warnings.push(`${script} not found in project or shared-workflows`);
    }
  }

  return { issues, warnings };
}

function runAudit(projectRoot, swRoot) {
  console.log('\n=== Running Orchestrator Audit ===\n');

  const auditPath = path.join(projectRoot, 'scripts/orchestrator-audit.js');
  const swAuditPath = swRoot ? path.join(swRoot, 'scripts/orchestrator-audit.js') : null;

  let scriptPath = null;
  if (fs.existsSync(auditPath)) {
    scriptPath = auditPath;
  } else if (swAuditPath && fs.existsSync(swAuditPath)) {
    scriptPath = swAuditPath;
  } else {
    console.warn('orchestrator-audit.js not found. Skipping audit.');
    return { issues: [], warnings: ['orchestrator-audit.js not available'] };
  }

  const result = runCommand(process.execPath, [scriptPath, '--no-fail'], {
    cwd: projectRoot,
    stdio: 'inherit'
  });

  if (result.status !== 0) {
    return { issues: [], warnings: [`orchestrator-audit.js exited with status ${result.status}`] };
  }

  return { issues: [], warnings: [] };
}

function runDevCheck(projectRoot) {
  console.log('\n=== Running Dev Check ===\n');

  const devCheckPath = path.join(projectRoot, 'scripts/dev-check.js');
  if (!fs.existsSync(devCheckPath)) {
    console.warn('dev-check.js not found. Skipping dev check.');
    return { issues: [], warnings: ['dev-check.js not available'] };
  }

  const result = runCommand(process.execPath, [devCheckPath], {
    cwd: projectRoot,
    stdio: 'inherit'
  });

  if (result.status !== 0) {
    return { issues: [], warnings: [`dev-check.js exited with status ${result.status}`] };
  }

  return { issues: [], warnings: [] };
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
    console.log('  4. Create missing directories: mkdir -p docs/tasks docs/inbox');
    console.log('  5. Create missing files from templates (AI_CONTEXT.md, HANDOVER.md)');
  }

  if (allWarnings.length > 0) {
    console.log('\nWarnings:');
    for (const warning of allWarnings) {
      console.log(`  - ${warning}`);
    }
  }
}

function main() {
  const projectRoot = process.cwd();

  console.log('Shared Workflows Doctor\n');
  console.log(`Project Root: ${projectRoot}\n`);

  const envCheck = checkEnvironment(projectRoot);
  const scriptCheck = checkScripts(projectRoot, envCheck.swRoot);

  let allIssues = [...envCheck.issues, ...scriptCheck.issues];
  let allWarnings = [...envCheck.warnings, ...scriptCheck.warnings];

  if (allIssues.length === 0) {
    const auditResult = runAudit(projectRoot, envCheck.swRoot);
    allWarnings.push(...auditResult.warnings);

    const devCheckResult = runDevCheck(projectRoot);
    allWarnings.push(...devCheckResult.warnings);
  }

  suggestRepairs(allIssues, allWarnings);

  if (allIssues.length > 0) {
    console.log('\n⚠ Critical issues detected. Please address them before proceeding.');
    process.exit(1);
  }

  console.log('\n✓ Doctor check complete.');
  process.exit(0);
}

if (require.main === module) {
  main();
}

module.exports = { checkEnvironment, checkScripts, runAudit, runDevCheck };
