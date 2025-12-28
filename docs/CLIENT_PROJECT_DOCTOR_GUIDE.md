# クライアントプロジェクト向け Doctor 利用ガイド

本ガイドは、WritingPage などのクライアントプロジェクトで shared-workflows の `sw-doctor.js` を利用する際の手順を説明します。

## 概要

`sw-doctor.js` は、プロジェクトの環境・スクリプト・ワークフロー状態を自動診断するツールです。以下の用途に使用できます:

- **初期セットアップ検証**: SSOT ファイルと基本ディレクトリ構造の確認
- **定期的な健全性チェック**: 開発中の監査と異常検知
- **CI/CD 統合**: GitHub Actions などから自動診断結果を取得

## セットアップ手順

### Step 1: shared-workflows サブモジュールの導入

プロジェクトルートで以下を実行:

```bash
git submodule add https://github.com/YuShimoji/shared-workflows.git .shared-workflows
git submodule update --init --recursive
```

### Step 2: doctor スクリプトの確認

サブモジュール導入後、以下のいずれかで doctor が利用可能か確認:

```bash
# 方法1: サブモジュール経由（推奨）
node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-bootstrap --format text

# 方法2: ローカルコピー（サブモジュール未導入の場合）
cp .shared-workflows/scripts/sw-doctor.js scripts/
cp -r .shared-workflows/scripts/utils scripts/
node scripts/sw-doctor.js --profile shared-orch-bootstrap --format text
```

### Step 3: 初期診断の実行

```bash
node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-bootstrap --format text
```

出力例:

```
Shared Workflows Doctor

Project Root: /path/to/project

Profile: shared-orch-bootstrap - Bootstrap profile: check SSOT files and basic structure only

=== Environment Check ===

✓ shared-workflows detected: /path/to/project/.shared-workflows
✓ docs exists
✓ AI_CONTEXT.md exists
...

✓ Doctor check complete.
```

エラーが出た場合は、「トラブルシューティング」セクションを参照してください。

## プロファイル別の使い分け

### `shared-orch-bootstrap` (初期セットアップ用)

SSOT ファイルと基本ディレクトリ構造のみをチェック。初回セットアップ後に実行:

```bash
node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-bootstrap --format text
```

**チェック対象:**
- shared-workflows サブモジュールの存在
- `docs/`, `docs/tasks/`, `docs/inbox/` ディレクトリ
- `AI_CONTEXT.md`, `docs/HANDOVER.md`, `REPORT_CONFIG.yml`
- SSOT ファイル（`docs/Windsurf_AI_Collab_Rules_latest.md` など）

### `shared-orch-doctor` (定期的な監査用)

環境 + スクリプト + orchestrator-audit + dev-check を実行。開発中の定期チェック:

```bash
node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-doctor --format text
```

**チェック対象:**
- bootstrap プロファイルの全チェック
- スクリプト可用性（orchestrator-audit.js, report-validator.js など）
- orchestrator-audit.js による巡回監査
- dev-check.js による開発環境診断

### `ci-strict` (本番環境用)

全チェックを実行し、警告（WARN）も失敗扱い。リリース前の厳密チェック:

```bash
node .shared-workflows/scripts/sw-doctor.js --profile ci-strict --format text
```

## JSON 出力モード（CI 連携用）

GitHub Actions などから機械可読な結果を取得:

```bash
node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-doctor --format json
```

出力例:

```json
{
  "projectRoot": "/path/to/project",
  "profile": "shared-orch-doctor",
  "profileDescription": "Doctor profile: full environment + audit + dev-check",
  "summary": {
    "issues": [],
    "warnings": []
  },
  "results": {
    "environment": [...],
    "scripts": [...],
    "audit": [...],
    "devCheck": [...]
  }
}
```

## GitHub Actions での利用

`.github/workflows/doctor-check.yml` を作成:

```yaml
name: Doctor Health Check

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

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
        run: |
          node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-bootstrap --format json > doctor-bootstrap.json
          ISSUES=$(jq '.summary.issues | length' doctor-bootstrap.json)
          if [ "$ISSUES" -gt 0 ]; then
            echo "❌ Bootstrap check failed"
            cat doctor-bootstrap.json
            exit 1
          fi
          echo "✅ Bootstrap check passed"

      - name: Run Doctor Full Check
        run: |
          node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-doctor --format json > doctor-full.json
          ISSUES=$(jq '.summary.issues | length' doctor-full.json)
          if [ "$ISSUES" -gt 0 ]; then
            echo "❌ Full check failed"
            cat doctor-full.json
            exit 1
          fi
          echo "✅ Full check passed"
```

詳細は `docs/CI_INTEGRATION.md` を参照。

## カスタム設定

プロジェクト固有の doctor 設定を行いたい場合は、プロジェクトルートに `.doctorrc.js` を配置:

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

テンプレートは `.shared-workflows/templates/.doctorrc.example.js` を参照。

## トラブルシューティング

### doctor スクリプトが見つからない

```bash
# サブモジュール状態を確認
git submodule status

# サブモジュールを再初期化
git submodule sync --recursive
git submodule update --init --recursive --remote
```

### 環境チェックが失敗する

```bash
# 詳細を確認
node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-bootstrap --format text

# 不足しているファイル/ディレクトリを手動作成
mkdir -p docs/tasks docs/inbox
touch docs/tasks/.gitkeep docs/inbox/.gitkeep
```

### JSON パースエラー

```bash
# stderr を確認
node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-doctor --format json 2>&1 | head -20

# doctor が正常に終了しているか確認
node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-doctor --format json
echo "Exit code: $?"
```

### スクリプト実行権限エラー

Windows PowerShell の場合:

```powershell
# Node.js が利用可能か確認
node --version

# スクリプト実行ポリシーを確認
Get-ExecutionPolicy

# 必要に応じてポリシーを変更
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## よくある質問

### Q: doctor を毎日実行する必要があるか？

A: 推奨です。特に以下のタイミングで実行してください:
- PR 作成時
- main ブランチへのマージ前
- CI/CD パイプラインの定期実行（例: 毎日 09:00）

### Q: doctor の結果に基づいて自動修復できるか？

A: 現在は診断のみです。修復は以下のスクリプトを手動実行してください:
- `node .shared-workflows/scripts/ensure-ssot.js --no-fail` (SSOT ファイル補完)
- `node .shared-workflows/scripts/orchestrator-audit.js --no-fail` (巡回監査)

将来的には自動修復機能の追加を予定しています。

### Q: 他プロジェクトで doctor をカスタマイズできるか？

A: はい。`.doctorrc.js` でプロファイルやカスタム Check/Fix を定義できます。詳細は「カスタム設定」セクションを参照。

## 参考資料

- `docs/CI_INTEGRATION.md` - CI/CD 統合ガイド
- `docs/ARCH_DOCTOR_DESIGN.md` - Doctor アーキテクチャ設計
- `.shared-workflows/templates/.doctorrc.example.js` - 設定ファイルテンプレート
- `docs/Windsurf_AI_Collab_Rules_latest.md` - 中央ルール（SSOT）
