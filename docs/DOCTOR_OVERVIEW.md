# Doctor Overview - 統合診断ツール

## 概要

`sw-doctor.js` は、shared-workflows プロジェクトおよびクライアントプロジェクトの環境・スクリプト・ワークフロー状態を自動診断するツールです。

## 主な特徴

- **プロファイルベースの診断**: 用途に応じて 4 つのプロファイルから選択可能
- **構造化出力**: JSON/Text 形式で機械可読な診断結果を提供
- **CI/CD 統合**: GitHub Actions などから自動実行可能
- **拡張可能**: カスタムプロファイルやチェック関数の追加が容易

## プロファイル一覧

### 1. `shared-orch-bootstrap`
**用途**: 初期セットアップ検証

SSOT ファイルと基本ディレクトリ構造のみをチェック。初回セットアップ後に実行。

```bash
node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-bootstrap --format text
```

**チェック対象**:
- shared-workflows サブモジュール
- `docs/`, `docs/tasks/`, `docs/inbox/` ディレクトリ
- `AI_CONTEXT.md`, `docs/HANDOVER.md`, `REPORT_CONFIG.yml`
- SSOT ファイル

### 2. `shared-orch-doctor`
**用途**: 定期的な監査

環境 + スクリプト + orchestrator-audit + dev-check を実行。開発中の定期チェック。

```bash
node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-doctor --format text
```

**チェック対象**:
- bootstrap プロファイルの全チェック
- スクリプト可用性
- orchestrator-audit.js による巡回監査
- dev-check.js による開発環境診断

### 3. `ci-strict`
**用途**: 本番環境用の厳密チェック

全チェックを実行し、警告（WARN）も失敗扱い。リリース前の厳密チェック。

```bash
node .shared-workflows/scripts/sw-doctor.js --profile ci-strict --format text
```

**チェック対象**:
- shared-orch-doctor プロファイルの全チェック
- 警告も失敗扱い（severityPolicy: WARN → fail）

### 4. `report-validation`
**用途**: レポート検証

HANDOVER.md と AI_CONTEXT.md の検証。レポート品質確認。

```bash
node .shared-workflows/scripts/sw-doctor.js --profile report-validation --format text
```

**チェック対象**:
- 環境チェック
- スクリプト可用性
- report-validator.js による HANDOVER.md 検証
- todo-leak-preventer.js による AI_CONTEXT.md バックログ検証

## 出力形式

### Text 形式（デフォルト）

```
Shared Workflows Doctor

Project Root: /path/to/project

Profile: shared-orch-doctor - Doctor profile: full environment + audit + dev-check

=== Environment Check ===

✓ shared-workflows detected: /path/to/project
✓ docs exists
...

=== Repair Suggestions ===

✓ No issues detected. System is healthy.

✓ Doctor check complete.
```

### JSON 形式

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

## 利用シーン

### 初期セットアップ時
```bash
# PROJECT_KICKSTART.txt 実行後
node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-bootstrap --format text
```

### 開発中の定期チェック
```bash
# 毎日の開始時、または PR 作成前
node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-doctor --format text
```

### CI/CD パイプライン
```bash
# GitHub Actions ワークフロー内
node .shared-workflows/scripts/sw-doctor.js --profile ci-strict --format json
```

### レポート検証
```bash
# HANDOVER.md 更新後
node .shared-workflows/scripts/sw-doctor.js --profile report-validation --format text
```

## 内部 API（プログラマティック利用）

`sw-doctor.js` は以下の関数を外部から利用可能:

```javascript
const {
  checkEnvironment,
  checkScripts,
  runAudit,
  runDevCheck,
  runReportValidation,
  runTodoCheck,
  runAllChecks,
  createCheckResult,
  doctorProfiles
} = require('./scripts/sw-doctor.js');

// 例: 全チェックを実行
const result = runAllChecks(projectRoot, 'shared-orch-doctor', { quiet: false });
console.log(result.summary);
```

## CheckResult 構造

全チェック結果は以下の構造で返される:

```javascript
{
  id: 'env.required-dir',           // チェック ID
  severity: 'OK|WARN|ERROR',        // 重要度
  message: 'docs exists',           // メッセージ
  context: {                        // コンテキスト情報
    dir: 'docs',
    path: '/full/path/to/docs'
  }
}
```

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

## 参考資料

- `docs/CLIENT_PROJECT_DOCTOR_GUIDE.md` - クライアントプロジェクト向け利用ガイド
- `docs/CI_INTEGRATION.md` - CI/CD 統合ガイド
- `docs/ARCH_DOCTOR_DESIGN.md` - アーキテクチャ設計
- `.github/workflows/doctor-health-check.yml` - GitHub Actions ワークフロー例
- `templates/.doctorrc.example.js` - カスタム設定ファイルテンプレート

## 今後の拡張予定

- `.doctorrc.js` のサポート（カスタムプロファイル・Check/Fix の追加）
- プラグインシステムの整備
- 自動修復機能の追加
- npm パッケージ化
