# CI Integration Guide for Doctor

## 概要

`sw-doctor.js` は JSON 出力モード（`--format json`）により、CI/CD パイプラインから機械可読な診断結果を取得できます。

このガイドでは、GitHub Actions を例に、doctor を CI に統合する方法を説明します。

## GitHub Actions での利用

### 基本的なワークフロー例

```yaml
name: Doctor Health Check

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  schedule:
    # 毎日 09:00 UTC に実行
    - cron: '0 9 * * *'

jobs:
  doctor-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: recursive

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Run Doctor Bootstrap Check
        id: bootstrap
        run: |
          node scripts/sw-doctor.js --profile shared-orch-bootstrap --format json > doctor-bootstrap.json
          cat doctor-bootstrap.json

      - name: Parse Bootstrap Results
        run: |
          ISSUES=$(jq '.summary.issues | length' doctor-bootstrap.json)
          WARNINGS=$(jq '.summary.warnings | length' doctor-bootstrap.json)
          echo "Bootstrap Issues: $ISSUES, Warnings: $WARNINGS"
          if [ "$ISSUES" -gt 0 ]; then
            echo "❌ Bootstrap check failed"
            exit 1
          fi

      - name: Run Doctor Full Check
        id: doctor
        run: |
          node scripts/sw-doctor.js --profile shared-orch-doctor --format json > doctor-full.json
          cat doctor-full.json

      - name: Upload Doctor Reports
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: doctor-reports
          path: doctor-*.json

      - name: Comment on PR
        if: github.event_name == 'pull_request' && always()
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const bootstrap = JSON.parse(fs.readFileSync('doctor-bootstrap.json', 'utf8'));
            const full = JSON.parse(fs.readFileSync('doctor-full.json', 'utf8'));
            
            const comment = `## 🏥 Doctor Health Check
            
### Bootstrap Profile
- Issues: ${bootstrap.summary.issues.length}
- Warnings: ${bootstrap.summary.warnings.length}

### Full Profile
- Issues: ${full.summary.issues.length}
- Warnings: ${full.summary.warnings.length}

${bootstrap.summary.issues.length > 0 ? '❌ Bootstrap check failed' : '✅ Bootstrap check passed'}
${full.summary.issues.length > 0 ? '❌ Full check failed' : '✅ Full check passed'}
            `;
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });
```

### CI Strict Profile（本番環境用）

```yaml
  doctor-ci-strict:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: recursive

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Run Doctor CI Strict Check
        run: |
          node scripts/sw-doctor.js --profile ci-strict --format json > doctor-ci-strict.json
          cat doctor-ci-strict.json

      - name: Evaluate Results
        run: |
          ISSUES=$(jq '.summary.issues | length' doctor-ci-strict.json)
          WARNINGS=$(jq '.summary.warnings | length' doctor-ci-strict.json)
          
          if [ "$ISSUES" -gt 0 ] || [ "$WARNINGS" -gt 0 ]; then
            echo "❌ CI Strict check failed"
            jq '.summary' doctor-ci-strict.json
            exit 1
          fi
          echo "✅ All checks passed"
```

## JSON 出力スキーマ

doctor の JSON 出力は以下の構造を持ちます:

```json
{
  "projectRoot": "/path/to/project",
  "profile": "shared-orch-doctor",
  "profileDescription": "Doctor profile: full environment + audit + dev-check",
  "summary": {
    "issues": ["issue message 1", "issue message 2"],
    "warnings": ["warning message 1"]
  },
  "results": {
    "environment": [
      {
        "id": "env.required-dir",
        "severity": "OK|WARN|ERROR",
        "message": "Human-readable message",
        "context": {
          "dir": "docs/tasks",
          "path": "/full/path/to/docs/tasks"
        }
      }
    ],
    "scripts": [...],
    "audit": [...],
    "devCheck": [...]
  }
}
```

### 結果の解釈

- **`summary.issues`**: 失敗扱いになったチェック（exit code 1 で終了）
- **`summary.warnings`**: 警告扱いになったチェック（profile の severityPolicy に依存）
- **`results`**: 全チェック結果の詳細（id, severity, message, context を含む）

## プロファイル別の用途

### `shared-orch-bootstrap`
- **用途**: 初期セットアップ検証、環境準備確認
- **チェック対象**: SSOT ファイル、基本ディレクトリ構造
- **推奨実行タイミング**: PR 作成時、初回セットアップ後

### `shared-orch-doctor`
- **用途**: 定期的な健全性チェック、開発中の監査
- **チェック対象**: 環境 + スクリプト + orchestrator-audit + dev-check
- **推奨実行タイミング**: 毎日の定期実行、PR マージ前

### `ci-strict`
- **用途**: 本番環境への反映前の厳密チェック
- **チェック対象**: 全チェック（WARN も fail 扱い）
- **推奨実行タイミング**: リリース前、main ブランチへのマージ時

## カスタム設定

プロジェクト固有の doctor 設定を行いたい場合は、プロジェクトルートに `.doctorrc.js` を配置します:

```javascript
module.exports = {
  profiles: {
    'my-project-check': {
      description: 'Custom profile for my project',
      checks: ['env.*', 'script.*'],
      severityPolicy: {
        ERROR: 'fail',
        WARN: 'warn',
        OK: 'pass'
      },
      runAudit: true,
      runDevCheck: false
    }
  }
};
```

その後、以下のコマンドで実行:

```bash
node scripts/sw-doctor.js --profile my-project-check --format json
```

## トラブルシューティング

### doctor が見つからない

```bash
# shared-workflows submodule から実行
node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-bootstrap --format json

# または、ローカルコピーを利用
node scripts/sw-doctor.js --profile shared-orch-bootstrap --format json
```

### JSON パース エラー

doctor の出力が JSON でない場合、以下を確認:

1. `--format json` オプションが指定されているか
2. stderr に警告メッセージが出ていないか
3. doctor スクリプト自体がエラーで終了していないか

```bash
# デバッグ: stderr を確認
node scripts/sw-doctor.js --profile shared-orch-doctor --format json 2>&1 | head -20
```

### プロファイルが見つからない

```bash
# 利用可能なプロファイルを確認（text 出力で確認）
node scripts/sw-doctor.js --profile shared-orch-doctor --format text
```

## 次のステップ

- CI 結果を Slack や他の通知システムに連携
- doctor の結果に基づいて自動修復を実行（例: `ensure-ssot.js` の自動実行）
- カスタムプロファイルを定義して、プロジェクト固有のチェックを追加
