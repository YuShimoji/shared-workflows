# 他のプロジェクトで shared-workflows を使用する完全ガイド

このドキュメントでは、`shared-workflows` リポジトリを他のプロジェクトで使用するための**全手順**を詳しく解説します。

> **簡潔版**: より簡潔な手順が必要な場合は [`docs/APPLY_TO_OTHER_PROJECTS.md`](./APPLY_TO_OTHER_PROJECTS.md) を参照してください。

## 目次

1. [概要と前提条件](#概要と前提条件)
2. [導入方法の選択](#導入方法の選択)
3. [方法A: Git Submodule を使用する（推奨）](#方法a-git-submodule-を使用する推奨)
4. [方法B: ファイルをコピーする](#方法b-ファイルをコピーする)
5. [方法C: 参照のみで使用する](#方法c-参照のみで使用する)
6. [初期セットアップ](#初期セットアップ)
7. [Cursor 設定の適用](#cursor-設定の適用)
8. [Doctor 機能による環境チェック](#doctor-機能による環境チェック)
9. [日常的な使用方法](#日常的な使用方法)
10. [トラブルシューティング](#トラブルシューティング)

---

## 概要と前提条件

### shared-workflows とは

`shared-workflows` は、AI（Windsurf/Cursor）と協働するためのワークフロー、プロンプトテンプレート、スクリプトを集約した中央リポジトリです。

**主な機能:**
- **SSOT（Single Source of Truth）**: `Windsurf_AI_Collab_Rules_latest.md` を中心とした統一されたルール
- **Orchestrator/Worker パターン**: タスクを分割して効率的に進めるワークフロー
- **Doctor 機能**: プロジェクト環境の健全性をチェック
- **プロンプトテンプレート**: 再利用可能なプロンプト集

### 前提条件

- **Git**: Git がインストールされていること
- **Node.js**: Node.js 18以上がインストールされていること（スクリプト実行用）
- **PowerShell**: Windows 環境の場合、PowerShell が利用可能であること
- **Windsurf または Cursor**: AI エディタがインストールされていること

---

## 導入方法の選択

`shared-workflows` を他のプロジェクトで使用する方法は3つあります：

| 方法 | メリット | デメリット | 推奨度 |
|------|---------|-----------|--------|
| **方法A: Submodule** | 自動更新、バージョン管理、一貫性 | 初期設定がやや複雑 | ⭐⭐⭐⭐⭐ |
| **方法B: コピー** | シンプル、依存関係なし | 手動更新が必要 | ⭐⭐⭐ |
| **方法C: 参照のみ** | 軽量、設定のみ | スクリプトが使えない | ⭐⭐ |

**推奨**: ほとんどの場合、**方法A（Submodule）** を推奨します。

---

## 方法A: Git Submodule を使用する（推奨）

### Step 1: Submodule の追加

プロジェクトのルートディレクトリで以下を実行：

```bash
# Submodule を追加
git submodule add https://github.com/YuShimoji/shared-workflows.git .shared-workflows

# Submodule を初期化・更新
git submodule update --init --recursive
```

**注意**: ローカルパスを使用する場合（開発環境のみ）:

```bash
git -c protocol.file.allow=always submodule add <LOCAL_PATH_TO_SHARED_WORKFLOWS> .shared-workflows
git -c protocol.file.allow=always submodule update --init --recursive
```

### Step 2: Submodule の状態確認

```bash
# Submodule の状態を確認
git submodule status

# Submodule の詳細情報
git -C .shared-workflows status -sb
git -C .shared-workflows rev-parse --abbrev-ref HEAD
```

### Step 3: Submodule の更新

定期的に Submodule を最新化：

```bash
# Submodule を最新化
git submodule sync --recursive
git submodule update --init --recursive --remote

# 更新チェック（オプション）
node .shared-workflows/scripts/sw-update-check.js --no-fetch
```

---

## 方法B: ファイルをコピーする

Submodule を使わない場合、必要なファイルをコピーします。

### Step 1: shared-workflows をクローン

```bash
# 一時的に shared-workflows をクローン
git clone https://github.com/YuShimoji/shared-workflows.git ../shared-workflows-1
```

### Step 2: 必要なファイルをコピー

```bash
# プロジェクトルートで実行
# 1. ドキュメントをコピー
cp -r ../shared-workflows-1/docs/windsurf_workflow ./docs/

# 2. スクリプトをコピー（必要な場合）
cp ../shared-workflows-1/scripts/sw-doctor.js ./scripts/
cp -r ../shared-workflows-1/scripts/utils ./scripts/
```

### Step 3: 参照パスの調整

コピーしたファイル内のパス参照を、プロジェクト構造に合わせて調整してください。

---

## 方法C: 参照のみで使用する

スクリプトは使わず、プロンプトやドキュメントのみを参照する場合。

### Step 1: `.cursorrules` と `.cursor/rules.md` の作成

プロジェクトルートに以下を作成：

**`.cursorrules`**:
```
# Shared Workflows 参照
参照先: <your-local-path-to-shared-workflows>
SSOT: docs/Windsurf_AI_Collab_Rules_latest.md
```

**`.cursor/rules.md`**:
```markdown
# Shared Workflows Rules

参照先の shared-workflows リポジトリのルールを参照してください。
```

### Step 2: Windsurf Memories に追加

Windsurf の Settings > Memories に以下を追加：

```
中央リポジトリ: <your-local-path-to-shared-workflows>
参照方法: 中央リポジトリの docs/Windsurf_AI_Collab_Rules_latest.md を参照する
```

---

## 初期セットアップ

どの方法を選んでも、以下の初期セットアップが必要です。

### Step 1: プロジェクト構造の作成

```bash
# 必要なディレクトリを作成
mkdir -p docs/tasks
mkdir -p docs/inbox
mkdir -p .cursor

# .gitkeep ファイルを作成（空ディレクトリを Git で管理）
touch docs/tasks/.gitkeep
touch docs/inbox/.gitkeep
```

### Step 2: AI_CONTEXT.md の作成

プロジェクトルートに `AI_CONTEXT.md` を作成：

**テンプレートの使用**:

- Submodule の場合: `.shared-workflows/templates/AI_CONTEXT.md` をコピー
- コピー方法の場合: `templates/AI_CONTEXT.md` をコピー

詳細は [`templates/AI_CONTEXT.md`](../templates/AI_CONTEXT.md) を参照してください。

### Step 3: ORCHESTRATION_PROMPT.md の作成（任意）

プロジェクトルートに `ORCHESTRATION_PROMPT.md` を作成：

詳細は [`templates/ORCHESTRATION_PROMPT.md`](../templates/ORCHESTRATION_PROMPT.md) を参照してください。

### Step 4: docs/HANDOVER.md の作成

`docs/HANDOVER.md` を作成：

```markdown
# Handover

## GitHubAutoApprove

GitHubAutoApprove: true

## その他の設定

プロジェクト固有の設定を記述
```

### Step 5: SSOT ファイルの確保

SSOT（Single Source of Truth）ファイルをプロジェクトに配置：

**Submodule の場合**:
```bash
# SSOT をプロジェクトにコピー（オプション）
node .shared-workflows/scripts/ensure-ssot.js --project-root . --no-fail
```

**コピー方法の場合**:
```bash
# 手動でコピー
cp ../shared-workflows-1/docs/Windsurf_AI_Collab_Rules_latest.md ./docs/
```

**参照のみの場合**:
- `AI_CONTEXT.md` に参照パスを記載するだけ

---

## Cursor 設定の適用

### PowerShell を使用（Windows）

```powershell
# Submodule の場合
pwsh -NoProfile -File .shared-workflows/scripts/apply-cursor-rules.ps1 -ProjectRoot .

# コピー方法の場合（scripts/ にコピー済み）
pwsh -NoProfile -File scripts/apply-cursor-rules.ps1 -ProjectRoot .
```

### 手動で適用

1. **`.cursorrules`** をコピー:
   - Submodule: `.shared-workflows/templates/.cursorrules` → `.cursorrules`
   - コピー方法: `templates/.cursorrules` → `.cursorrules`

2. **`.cursor/rules.md`** をコピー:
   - Submodule: `.shared-workflows/templates/.cursor/rules.md` → `.cursor/rules.md`
   - コピー方法: `templates/.cursor/rules.md` → `.cursor/rules.md`

---

## Doctor 機能による環境チェック

`sw-doctor.js` を使用して、プロジェクト環境の健全性をチェックできます。

### 基本的な使用方法

```bash
# Bootstrap チェック（初期セットアップ用）
node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-bootstrap --format text

# フルチェック（環境 + 監査 + 開発チェック）
node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-doctor --format text

# CI Strict チェック（CI/CD 用）
node .shared-workflows/scripts/sw-doctor.js --profile ci-strict --format text

# JSON 出力（CI/CD 統合用）
node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-doctor --format json
```

### Doctor プロファイルの説明

| プロファイル | 用途 | チェック内容 |
|------------|------|------------|
| `shared-orch-bootstrap` | 初期セットアップ | SSOT、基本構造、必須ディレクトリ |
| `shared-orch-doctor` | 日常的なチェック | 環境 + 監査 + 開発チェック |
| `ci-strict` | CI/CD | すべてのチェック、WARN も失敗扱い |
| `report-validation` | レポート検証 | HANDOVER.md と AI_CONTEXT.md の整合性 |

詳細は [`docs/CLIENT_PROJECT_DOCTOR_GUIDE.md`](./CLIENT_PROJECT_DOCTOR_GUIDE.md) を参照してください。

---

## 日常的な使用方法

### 1. セッション開始時

1. **Orchestrator Driver を読み込む**:
   - Submodule: `.shared-workflows/prompts/every_time/ORCHESTRATOR_DRIVER.txt`
   - これを Cursor/Windsurf のプロンプトとして使用

2. **SSOT を参照**:
   - `.shared-workflows/docs/Windsurf_AI_Collab_Rules_latest.md` を参照

3. **環境チェック**:
   ```bash
   node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-bootstrap --format text
   ```

### 2. タスク管理

- **タスクの作成**: `docs/tasks/TASK_*.md` にタスクを記述
- **ステータス管理**: `Status: OPEN/IN_PROGRESS/DONE` で管理
- **Worker レポート**: `docs/inbox/REPORT_*.md` に配置

### 3. プロンプトの使用

**初回セットアップ時**:
- `.shared-workflows/prompts/first_time/PROJECT_KICKSTART.txt`

**毎回のセッション**:
- `.shared-workflows/prompts/every_time/ORCHESTRATOR_DRIVER.txt`

**Global Rules**:
- Windsurf: Settings > Global Rules に `.shared-workflows/prompts/global/WINDSURF_GLOBAL_RULES.txt` を設定

### 4. 更新の確認

```bash
# Submodule の更新確認
node .shared-workflows/scripts/sw-update-check.js

# セッション終了チェック
node .shared-workflows/scripts/session-end-check.js --project-root .
```

---

## トラブルシューティング

### Submodule が正しく動作しない

**問題**: `fatal: transport 'file' not allowed`

**解決策**:
```bash
git -c protocol.file.allow=always submodule add <LOCAL_PATH> .shared-workflows
```

**問題**: Submodule が更新されない

**解決策**:
```bash
git submodule sync --recursive
git submodule update --init --recursive --remote
```

### Doctor がエラーを報告する

**問題**: `shared-workflows detected` が失敗

**解決策**:
- `.shared-workflows/` ディレクトリが存在するか確認
- Submodule が正しく初期化されているか確認: `git submodule status`

**問題**: `docs/` が存在しない

**解決策**:
```bash
mkdir -p docs/tasks docs/inbox
touch docs/tasks/.gitkeep docs/inbox/.gitkeep
```

### SSOT ファイルが見つからない

**問題**: `docs/Windsurf_AI_Collab_Rules_latest.md` が存在しない

**解決策**:
```bash
# Submodule の場合
node .shared-workflows/scripts/ensure-ssot.js --project-root . --no-fail

# 手動でコピー
cp .shared-workflows/docs/Windsurf_AI_Collab_Rules_latest.md ./docs/
```

### PowerShell スクリプトが実行できない

**問題**: `ExecutionPolicy` エラー

**解決策**:
```powershell
# 実行ポリシーを確認
Get-ExecutionPolicy

# 実行ポリシーを変更（CurrentUser スコープ）
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# または、-NoProfile フラグを使用
pwsh -NoProfile -File .shared-workflows/scripts/apply-cursor-rules.ps1 -ProjectRoot .
```

### Node.js スクリプトが実行できない

**問題**: `node: command not found`

**解決策**:
- Node.js がインストールされているか確認: `node --version`
- Node.js 18以上が必要です

---

## 参考ドキュメント

- **SSOT**: `.shared-workflows/docs/Windsurf_AI_Collab_Rules_latest.md`
- **ワークフロー開始**: `.shared-workflows/docs/windsurf_workflow/OPEN_HERE.md`
- **Orchestrator プロトコル**: `.shared-workflows/docs/windsurf_workflow/ORCHESTRATOR_PROTOCOL.md`
- **Worker プロンプトテンプレート**: `.shared-workflows/docs/windsurf_workflow/WORKER_PROMPT_TEMPLATE.md`
- **Doctor ガイド**: `docs/CLIENT_PROJECT_DOCTOR_GUIDE.md`
- **中央リポジトリ参照**: `docs/CENTRAL_REPO_REF.md`

---

## 次のステップ

1. ✅ Submodule の追加（またはコピー/参照の設定）
2. ✅ 初期セットアップ（ディレクトリ、ファイルの作成）
3. ✅ Cursor 設定の適用
4. ✅ Doctor による環境チェック
5. ✅ 最初の Orchestrator セッションの開始

**最初のセッション開始**:
`.shared-workflows/prompts/first_time/PROJECT_KICKSTART.txt` を Cursor/Windsurf で開いて、プロンプトとして使用してください。

---

## サポート

問題が発生した場合:

1. `docs/CLIENT_PROJECT_DOCTOR_GUIDE.md` を確認
2. `docs/APPLY_TO_OTHER_PROJECTS.md` を確認
3. GitHub Issues で報告
