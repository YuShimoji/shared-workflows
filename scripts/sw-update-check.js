const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(cmd, args, options = {}) {
  return spawnSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...options });
}

function parseArgs(argv) {
  const opts = { format: 'text', noFetch: false };
  for (const a of argv.slice(2)) {
    if (a === '--json' || a === '--format=json') opts.format = 'json';
    if (a === '--text' || a === '--format=text') opts.format = 'text';
    if (a === '--no-fetch') opts.noFetch = true;
  }
  return opts;
}

function isGitRepo(dir) {
  const r = run('git', ['-C', dir, 'rev-parse', '--is-inside-work-tree']);
  return r.status === 0 && (r.stdout || '').trim() === 'true';
}

function main() {
  const opts = parseArgs(process.argv);
  const projectRoot = process.cwd();
  const swRoot = path.join(projectRoot, '.shared-workflows');

  const result = {
    projectRoot,
    swRoot,
    ok: true,
    warnings: [],
    details: {}
  };

  if (!fs.existsSync(swRoot)) {
    // If running inside the shared-workflows repo itself, .shared-workflows is expected to be absent.
    if (fs.existsSync(path.join(projectRoot, 'docs', 'Windsurf_AI_Collab_Rules_latest.md')) && fs.existsSync(path.join(projectRoot, 'prompts'))) {
      result.warnings.push('.shared-workflows not found (this looks like the shared-workflows repo itself). No submodule update needed.');
      return printAndExit(result, opts);
    }
    result.ok = false;
    result.warnings.push('.shared-workflows not found. If you use submodule, run: git submodule update --init --recursive');
    return printAndExit(result, opts);
  }

  if (!isGitRepo(swRoot)) {
    result.warnings.push('.shared-workflows exists but is not a git repo (copy-vendor mode). Update by re-copying the folder.');
    return printAndExit(result, opts);
  }

  // Determine branch/head
  const head = run('git', ['-C', swRoot, 'rev-parse', '--short', 'HEAD']);
  result.details.head = (head.stdout || '').trim();

  const branch = run('git', ['-C', swRoot, 'rev-parse', '--abbrev-ref', 'HEAD']);
  result.details.branch = (branch.stdout || '').trim();

  if (!opts.noFetch) {
    const fetch = run('git', ['-C', swRoot, 'fetch', 'origin'], { timeout: 30000 });
    if (fetch.status !== 0) {
      result.warnings.push(`git fetch origin failed in .shared-workflows (network/offline?): ${String(fetch.stderr || '').trim()}`);
      return printAndExit(result, opts);
    }
  }

  const behind = run('git', ['-C', swRoot, 'rev-list', '--count', 'HEAD..origin/main']);
  if (behind.status === 0) {
    const n = Number((behind.stdout || '').trim() || '0');
    result.details.behindOriginMain = n;
    if (n > 0) {
      result.warnings.push(`.shared-workflows is behind origin/main by ${n} commits. Recommended: git -C .shared-workflows checkout main && git -C .shared-workflows pull --ff-only`);
    }
  } else {
    result.warnings.push(`Unable to compute behind count: ${String(behind.stderr || '').trim()}`);
  }

  return printAndExit(result, opts);
}

function printAndExit(result, opts) {
  if (opts.format === 'json') {
    process.stdout.write(JSON.stringify(result, null, 2) + '\n');
  } else {
    console.log(`Project: ${result.projectRoot}`);
    console.log(`.shared-workflows: ${result.swRoot}`);
    if (result.details.head) console.log(`HEAD: ${result.details.head}`);
    if (result.details.branch) console.log(`Branch: ${result.details.branch}`);
    if (typeof result.details.behindOriginMain === 'number') {
      console.log(`Behind origin/main: ${result.details.behindOriginMain}`);
    }
    if (result.warnings.length === 0) {
      console.log('OK');
    } else {
      console.log('Warnings:');
      for (const w of result.warnings) console.log(`- ${w}`);
    }
  }

  // never hard-fail; it is guidance
  process.exit(0);
}

if (require.main === module) {
  main();
}


