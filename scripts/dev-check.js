const { spawnSync } = require('child_process');
const path = require('path');

function runScript(scriptPath, args = []) {
  const result = spawnSync(process.execPath, [path.join(__dirname, scriptPath), ...args], {
    stdio: 'inherit',
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`${scriptPath} exited with status ${result.status}`);
  }
}

function main() {
  console.log('Running shared workflow diagnostics...');

  runScript('detect-project-type.js');
  runScript('report-style-hint.js');
  runScript('creativity-booster.js');
  runScript('adapt-response.js');

  console.log('All shared workflow scripts executed successfully.');
}

main();
