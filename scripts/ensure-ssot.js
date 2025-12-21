const fs = require('fs');
const path = require('path');
const { detectSwRoot } = require('./utils/sw-path');

const FILES = [
  'docs/Windsurf_AI_Collab_Rules_v2.0.md',
  'docs/Windsurf_AI_Collab_Rules_latest.md'
];

function ensureDirectory(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function copyIfMissing(projectRoot, swRoot, relativePath) {
  const destPath = path.join(projectRoot, relativePath);
  if (fs.existsSync(destPath)) {
    return { status: 'exists', relativePath };
  }

  const source = path.join(swRoot, relativePath);
  if (!fs.existsSync(source)) {
    return { status: 'missing_source', relativePath };
  }

  ensureDirectory(destPath);
  fs.copyFileSync(source, destPath);
  return { status: 'copied', relativePath };
}

function main() {
  const projectRoot = process.cwd();
  const swRoot = detectSwRoot(projectRoot);

  if (!swRoot) {
    console.error('shared-workflows の配置を検出できませんでした。SW_ROOT 環境変数を確認してください。');
    process.exit(1);
  }

  let copied = 0;
  let missingSources = [];

  FILES.forEach((relativePath) => {
    const result = copyIfMissing(projectRoot, swRoot, relativePath);
    switch (result.status) {
      case 'copied':
        copied += 1;
        console.log(`Copied: ${relativePath}`);
        break;
      case 'missing_source':
        missingSources.push(relativePath);
        console.warn(`Source file not found in shared-workflows: ${relativePath}`);
        break;
      default:
        console.log(`Exists: ${relativePath}`);
    }
  });

  if (missingSources.length) {
    console.error(`共有リポジトリに以下のファイルが見つかりませんでした: ${missingSources.join(', ')}`);
    process.exit(1);
  }

  if (!copied) {
    console.log('すべてのファイルが既に存在しています。');
  } else {
    console.log(`合計 ${copied} 件のファイルをコピーしました。`);
  }
}

main();
