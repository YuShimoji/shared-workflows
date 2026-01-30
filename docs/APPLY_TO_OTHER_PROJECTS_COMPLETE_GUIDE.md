# 他�Eプロジェクトで shared-workflows を使用する完�EガイチE
こ�Eドキュメントでは、`shared-workflows` リポジトリを他�Eプロジェクトで使用するための**全手頁E*を詳しく解説します、E
> **簡潔版**: より簡潔な手頁E��忁E��な場合�E [`docs/APPLY_TO_OTHER_PROJECTS.md`](./APPLY_TO_OTHER_PROJECTS.md) を参照してください、E
## 目次

1. [概要と前提条件](#概要と前提条件)
2. [導�E方法�E選択](#導�E方法�E選抁E
3. [方法A: Git Submodule を使用する�E�推奨�E�](#方法a-git-submodule-を使用する推奨)
4. [方法B: ファイルをコピ�Eする](#方法b-ファイルをコピ�Eする)
5. [方法C: 参�Eのみで使用する](#方法c-参�Eのみで使用する)
6. [初期セチE��アチE�E](#初期セチE��アチE�E)
7. [Cursor 設定�E適用](#cursor-設定�E適用)
8. [Doctor 機�Eによる環墁E��ェチE��](#doctor-機�Eによる環墁E��ェチE��)
9. [日常皁E��使用方法](#日常皁E��使用方況E
10. [トラブルシューチE��ング](#トラブルシューチE��ング)

---

## 概要と前提条件

### shared-workflows とは

`shared-workflows` は、AI�E�Eindsurf/Cursor�E�と協働するためのワークフロー、�EロンプトチE��プレート、スクリプトを集紁E��た中央リポジトリです、E
**主な機�E:**
- **SSOT�E�Eingle Source of Truth�E�E*: `Windsurf_AI_Collab_Rules_latest.md` を中忁E��した統一されたルール
- **Orchestrator/Worker パターン**: タスクを�E割して効玁E��に進めるワークフロー
- **Doctor 機�E**: プロジェクト環墁E�E健全性をチェチE��
- **プロンプトチE��プレーチE*: 再利用可能なプロンプト雁E
### 前提条件

- **Git**: Git がインスト�EルされてぁE��こと
- **Node.js**: Node.js 18以上がインスト�EルされてぁE��こと�E�スクリプト実行用�E�E- **PowerShell**: Windows 環墁E�E場合、PowerShell が利用可能であること
- **Windsurf また�E Cursor**: AI エチE��タがインスト�EルされてぁE��こと

---

## 導�E方法�E選抁E
`shared-workflows` を他�Eプロジェクトで使用する方法�E3つあります！E
| 方況E| メリチE�� | チE��リチE�� | 推奨度 |
|------|---------|-----------|--------|
| **方法A: Submodule** | 自動更新、バージョン管琁E��一貫性 | 初期設定がめE��褁E�� | ⭐⭐⭐⭐⭁E|
| **方法B: コピ�E** | シンプル、依存関係なぁE| 手動更新が忁E��E| ⭐⭐⭁E|
| **方法C: 参�Eのみ** | 軽量、設定�Eみ | スクリプトが使えなぁE| ⭐⭁E|

**推奨**: ほとんどの場合、E*方法A�E�Eubmodule�E�E* を推奨します、E
---

## 方法A: Git Submodule を使用する�E�推奨�E�E
### Step 1: Submodule の追加

プロジェクト�Eルートディレクトリで以下を実行！E
```bash
# Submodule を追加
git submodule add https://github.com/YuShimoji/shared-workflows.git .shared-workflows

# Submodule を�E期化・更新
git submodule update --init --recursive
```

**注愁E*: ローカルパスを使用する場合（開発環墁E�Eみ�E�E

```bash
git -c protocol.file.allow=always submodule add <LOCAL_PATH_TO_SHARED_WORKFLOWS> .shared-workflows
git -c protocol.file.allow=always submodule update --init --recursive
```

### Step 2: Submodule の状態確誁E
```bash
# Submodule の状態を確誁Egit submodule status

# Submodule の詳細惁E��
git -C .shared-workflows status -sb
git -C .shared-workflows rev-parse --abbrev-ref HEAD
```

### Step 3: Submodule の更新

定期皁E�� Submodule を最新化！E
```bash
# Submodule を最新匁Egit submodule sync --recursive
git submodule update --init --recursive --remote

# 更新チェチE���E�オプション�E�Enode .shared-workflows/scripts/sw-update-check.js --no-fetch
```

---

## 方法B: ファイルをコピ�Eする

Submodule を使わなぁE��合、忁E��なファイルをコピ�Eします、E
### Step 1: shared-workflows をクローン

```bash
# 一時的に shared-workflows をクローン
git clone https://github.com/YuShimoji/shared-workflows.git ../shared-workflows-1
```

### Step 2: 忁E��なファイルをコピ�E

```bash
# プロジェクトルートで実衁E# 1. ドキュメントをコピ�E
cp -r ../shared-workflows-1/docs/windsurf_workflow ./docs/

# 2. スクリプトをコピ�E�E�忁E��な場合！Ecp ../shared-workflows-1/scripts/sw-doctor.js ./scripts/
cp -r ../shared-workflows-1/scripts/utils ./scripts/
```

### Step 3: 参�Eパスの調整

コピ�Eしたファイル冁E�Eパス参�Eを、�Eロジェクト構造に合わせて調整してください、E
---

## 方法C: 参�Eのみで使用する

スクリプトは使わず、�EロンプトめE��キュメント�Eみを参照する場合、E
### Step 1: `.cursorrules` と `.cursor/rules.md` の作�E

プロジェクトルートに以下を作�E�E�E
**`.cursorrules`**:
```
# Shared Workflows 参�E
参�E允E <your-local-path-to-shared-workflows>
SSOT: docs/Windsurf_AI_Collab_Rules_latest.md
```

**`.cursor/rules.md`**:
```markdown
# Shared Workflows Rules

参�E先�E shared-workflows リポジトリのルールを参照してください、E```

### Step 2: Windsurf Memories に追加

Windsurf の Settings > Memories に以下を追加�E�E
```
中央リポジトリ: <your-local-path-to-shared-workflows>
参�E方況E 中央リポジトリの docs/Windsurf_AI_Collab_Rules_latest.md を参照する
```

---

## 初期セチE��アチE�E

どの方法を選んでも、以下�E初期セチE��アチE�Eが忁E��です、E
### Step 1: プロジェクト構造の作�E

```bash
# 忁E��なチE��レクトリを作�E
mkdir -p docs/tasks
mkdir -p docs/inbox
mkdir -p .cursor

# .gitkeep ファイルを作�E�E�空チE��レクトリめEGit で管琁E��Etouch docs/tasks/.gitkeep
touch docs/inbox/.gitkeep
```

### Step 2: AI_CONTEXT.md の作�E

プロジェクトルートに `AI_CONTEXT.md` を作�E�E�E
**チE��プレート�E使用**:

- Submodule の場吁E `.shared-workflows/templates/AI_CONTEXT.md` をコピ�E
- コピ�E方法�E場吁E `templates/AI_CONTEXT.md` をコピ�E

詳細は [`templates/AI_CONTEXT.md`](../templates/AI_CONTEXT.md) を参照してください、E
### Step 3: ORCHESTRATION_PROMPT.md の作�E�E�任意！E
プロジェクトルートに `ORCHESTRATION_PROMPT.md` を作�E�E�E
詳細は [`templates/ORCHESTRATION_PROMPT.md`](../templates/ORCHESTRATION_PROMPT.md) を参照してください、E
### Step 4: docs/HANDOVER.md の作�E

`docs/HANDOVER.md` を作�E�E�E
```markdown
# Handover

## GitHubAutoApprove

GitHubAutoApprove: true

## そ�E他�E設宁E
プロジェクト固有�E設定を記述
```

### Step 5: SSOT ファイルの確俁E
SSOT�E�Eingle Source of Truth�E�ファイルを�Eロジェクトに配置�E�E
**Submodule の場吁E*:
```bash
# SSOT を�Eロジェクトにコピ�E�E�オプション�E�Enode .shared-workflows/scripts/ensure-ssot.js --project-root . --no-fail
```

**コピ�E方法�E場吁E*:
```bash
# 手動でコピ�E
cp ../shared-workflows-1/docs/Windsurf_AI_Collab_Rules_latest.md ./docs/
```

**参�Eのみの場吁E*:
- `AI_CONTEXT.md` に参�Eパスを記載するだぁE
---

## Cursor 設定�E適用

### PowerShell を使用�E�Eindows�E�E
```powershell
# Submodule の場吁Epwsh -NoProfile -File .shared-workflows/scripts/apply-cursor-rules.ps1 -ProjectRoot .

# コピ�E方法�E場合！Ecripts/ にコピ�E済み�E�Epwsh -NoProfile -File scripts/apply-cursor-rules.ps1 -ProjectRoot .
```

### 手動で適用

1. **`.cursorrules`** をコピ�E:
   - Submodule: `.shared-workflows/templates/.cursorrules` ↁE`.cursorrules`
   - コピ�E方況E `templates/.cursorrules` ↁE`.cursorrules`

2. **`.cursor/rules.md`** をコピ�E:
   - Submodule: `.shared-workflows/templates/.cursor/rules.md` ↁE`.cursor/rules.md`
   - コピ�E方況E `templates/.cursor/rules.md` ↁE`.cursor/rules.md`

---

## Doctor 機�Eによる環墁E��ェチE��

`sw-doctor.js` を使用して、�Eロジェクト環墁E�E健全性をチェチE��できます、E
### 基本皁E��使用方況E
```bash
# Bootstrap チェチE���E��E期セチE��アチE�E用�E�Enode .shared-workflows/scripts/sw-doctor.js --profile shared-orch-bootstrap --format text

# フルチェチE���E�環墁E+ 監査 + 開発チェチE���E�Enode .shared-workflows/scripts/sw-doctor.js --profile shared-orch-doctor --format text

# CI Strict チェチE���E�EI/CD 用�E�Enode .shared-workflows/scripts/sw-doctor.js --profile ci-strict --format text

# JSON 出力！EI/CD 統合用�E�Enode .shared-workflows/scripts/sw-doctor.js --profile shared-orch-doctor --format json
```

### Doctor プロファイルの説昁E
| プロファイル | 用送E| チェチE��冁E�� |
|------------|------|------------|
| `shared-orch-bootstrap` | 初期セチE��アチE�E | SSOT、基本構造、忁E��ディレクトリ |
| `shared-orch-doctor` | 日常皁E��チェチE�� | 環墁E+ 監査 + 開発チェチE�� |
| `ci-strict` | CI/CD | すべてのチェチE��、WARN も失敗扱ぁE|
| `report-validation` | レポ�Eト検証 | HANDOVER.md と AI_CONTEXT.md の整合性 |

詳細は [`docs/CLIENT_PROJECT_DOCTOR_GUIDE.md`](./CLIENT_PROJECT_DOCTOR_GUIDE.md) を参照してください、E
---

## 日常皁E��使用方況E
### 1. セチE��ョン開始時

1. **Orchestrator Driver を読み込む**:
   - Submodule: `.shared-workflows/prompts/every_time/ORCHESTRATOR_DRIVER.txt`
   - これめECursor/Windsurf のプロンプトとして使用

2. **SSOT を参照**:
   - `.shared-workflows/docs/Windsurf_AI_Collab_Rules_latest.md` を参照

3. **環墁E��ェチE��**:
   ```bash
   node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-bootstrap --format text
   ```

### 2. タスク管琁E
- **タスクの作�E**: `docs/tasks/TASK_*.md` にタスクを記述
- **スチE�Eタス管琁E*: `Status: OPEN/IN_PROGRESS/DONE` で管琁E- **Worker レポ�EチE*: `docs/inbox/REPORT_*.md` に配置

### 3. プロンプトの使用

**初回セチE��アチE�E晁E*:
- `.shared-workflows/prompts/first_time/PROJECT_KICKSTART.txt`

**毎回のセチE��ョン**:
- `.shared-workflows/prompts/every_time/ORCHESTRATOR_DRIVER.txt`

**Global Rules**:
- Windsurf: Settings > Global Rules に `.shared-workflows/prompts/global/WINDSURF_GLOBAL_RULES.txt` を設宁E
### 4. 更新の確誁E
```bash
# Submodule の更新確誁Enode .shared-workflows/scripts/sw-update-check.js

# セチE��ョン終亁E��ェチE��
node .shared-workflows/scripts/session-end-check.js --project-root .
```

---

## トラブルシューチE��ング

### Submodule が正しく動作しなぁE
**問顁E*: `fatal: transport 'file' not allowed`

**解決筁E*:
```bash
git -c protocol.file.allow=always submodule add <LOCAL_PATH> .shared-workflows
```

**問顁E*: Submodule が更新されなぁE
**解決筁E*:
```bash
git submodule sync --recursive
git submodule update --init --recursive --remote
```

### Doctor がエラーを報告すめE
**問顁E*: `shared-workflows detected` が失敁E
**解決筁E*:
- `.shared-workflows/` チE��レクトリが存在するか確誁E- Submodule が正しく初期化されてぁE��か確誁E `git submodule status`

**問顁E*: `docs/` が存在しなぁE
**解決筁E*:
```bash
mkdir -p docs/tasks docs/inbox
touch docs/tasks/.gitkeep docs/inbox/.gitkeep
```

### SSOT ファイルが見つからなぁE
**問顁E*: `docs/Windsurf_AI_Collab_Rules_latest.md` が存在しなぁE
**解決筁E*:
```bash
# Submodule の場吁Enode .shared-workflows/scripts/ensure-ssot.js --project-root . --no-fail

# 手動でコピ�E
cp .shared-workflows/docs/Windsurf_AI_Collab_Rules_latest.md ./docs/
```

### PowerShell スクリプトが実行できなぁE
**問顁E*: `ExecutionPolicy` エラー

**解決筁E*:
```powershell
# 実行�Eリシーを確誁EGet-ExecutionPolicy

# 実行�Eリシーを変更�E�EurrentUser スコープ！ESet-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# また�E、ENoProfile フラグを使用
pwsh -NoProfile -File .shared-workflows/scripts/apply-cursor-rules.ps1 -ProjectRoot .
```

### Node.js スクリプトが実行できなぁE
**問顁E*: `node: command not found`

**解決筁E*:
- Node.js がインスト�EルされてぁE��か確誁E `node --version`
- Node.js 18以上が忁E��でぁE
---

## 参老E��キュメンチE
- **SSOT**: `.shared-workflows/docs/Windsurf_AI_Collab_Rules_latest.md`
- **ワークフロー開姁E*: `.shared-workflows/docs/windsurf_workflow/OPEN_HERE.md`
- **Orchestrator プロトコル**: `.shared-workflows/docs/windsurf_workflow/ORCHESTRATOR_PROTOCOL.md`
- **Worker プロンプトチE��プレーチE*: `.shared-workflows/docs/windsurf_workflow/WORKER_PROMPT_TEMPLATE.md`
- **Doctor ガイチE*: `docs/CLIENT_PROJECT_DOCTOR_GUIDE.md`
- **中央リポジトリ参�E**: `docs/CENTRAL_REPO_REF.md`

---

## 次のスチE��チE
1. ✁ESubmodule の追加�E�また�Eコピ�E/参�Eの設定！E2. ✁E初期セチE��アチE�E�E�ディレクトリ、ファイルの作�E�E�E3. ✁ECursor 設定�E適用
4. ✁EDoctor による環墁E��ェチE��
5. ✁E最初�E Orchestrator セチE��ョンの開姁E
**最初�EセチE��ョン開姁E*:
`.shared-workflows/prompts/first_time/PROJECT_KICKSTART.txt` めECursor/Windsurf で開いて、�Eロンプトとして使用してください、E
---

## サポ�EチE
問題が発生した場吁E

1. `docs/CLIENT_PROJECT_DOCTOR_GUIDE.md` を確誁E2. `docs/APPLY_TO_OTHER_PROJECTS.md` を確誁E3. GitHub Issues で報呁E
