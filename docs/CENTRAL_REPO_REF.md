# Central Repository Reference

本ファイルは、shared-workflows リポジトリを他プロジェクトから参照する際の情報を提供する。

## SSOTの参照方法

中央リポジトリ（shared-workflows）にあるSSOTファイルを参照します。

### SSOT バージョンのフォールバック順序（自動補完）

shared-workflows サブモジュールのバージョンによって、SSOT ファイルの名称が異なる場合があります。`scripts/ensure-ssot.js` は、以下の順序でファイルを探索し、自動的に `docs/Windsurf_AI_Collab_Rules_latest.md` として配置します。

1. `.shared-workflows/docs/Windsurf_AI_Collab_Rules_latest.md`
2. `.shared-workflows/docs/Windsurf_AI_Collab_Rules_v2.0.md`
3. `.shared-workflows/docs/Windsurf_AI_Collab_Rules_v1.1.md`

AI は常に `latest.md` をエントリポイントとして参照してください。

## リポジトリ情報

- **リポジトリ名**: shared-workflows
- **絶対パス**: `<your-local-path-to-shared-workflows>`（環境依存）
- **GitHub URL**: https://github.com/YuShimoji/shared-workflows

## SSOT (Single Source of Truth)

| ファイル | 役割 |
|----------|------|
| `docs/Windsurf_AI_Collab_Rules_latest.md` | 中央ルール（単一エントリポイント / latest） |
| `docs/PROMPT_TEMPLATES.md` | テンプレート集 |
| `prompts/first_time/PROJECT_KICKSTART.txt` | 初回セットアップ（コピペ用） |
| `templates/PROJECT_KICKSTART_PROMPT.md` | 初回セットアップ（参照。説明付き / フォールバック） |
| `docs/windsurf_workflow/OPEN_HERE.md` | 運用者の入口（どのフォルダを開く / どれをコピペする） |
| `docs/windsurf_workflow/EVERY_SESSION.md` | 毎回の運用SSOT（終了時テンプレ/完了条件/推奨コマンドの固定） |
| `prompts/` | コピペ用プロンプト集（貼るだけ） |
| `prompts/global/WINDSURF_GLOBAL_RULES.txt` | Windsurf Global Rules（端末ごとの統一 / コピペ用） |
| `prompts/every_time/ORCHESTRATOR_DRIVER.txt` | Orchestrator起動/再開（毎回コピペ / **1つに統一**） |
| `docs/windsurf_workflow/ORCHESTRATOR_METAPROMPT.md` | Orchestrator起動（参照） |
| `docs/windsurf_workflow/ORCHESTRATOR_PROTOCOL.md` | オーケストレーション・プロトコル |
| `docs/windsurf_workflow/WORKER_PROMPT_TEMPLATE.md` | Worker起動プロンプト生成テンプレ（参照用） |
| `templates/TASK_TICKET_TEMPLATE.md` | チケット雛形（docs/tasks/TASK_*.md） |
| `scripts/orchestrator-audit.js` | 巡回監査（任意。tasks/inbox/HANDOVER の乖離検知） |
| `scripts/sw-doctor.js` | 環境・スクリプト・ワークフロー診断（推奨。初期セットアップ検証・定期監査） |
| `REPORT_CONFIG.yml` | レポート設定 |

## 参照の確実性（重要）

- Windsurf/AI のファイル参照は「現在開いているプロジェクト（ワークスペース）内」に限定される場合がある。
- そのため、Memory に絶対パスを書くだけでは、AI が SSOT を実際に読めているかを自動検証できないことがある。
- **確実に参照させたい場合は「方法3: Git Submodule」を推奨**（少なくとも SSOT 本文はワークスペース内に置く）。

## 他プロジェクトからの参照方法

### 方法1: Windsurfグローバルメモリに登録

Windsurfの Settings > Memories に以下を追加:

```
中央リポジトリ: <your-local-path-to-shared-workflows>
作業開始時は上記リポジトリの docs/Windsurf_AI_Collab_Rules_latest.md を参照すること。
```

### 方法2: プロジェクト内に参照ファイルを配置

各プロジェクトのルートに `AI_CONTEXT.md` を作成し、以下を記載:

```markdown
## 中央ルール参照
- Path: <your-local-path-to-shared-workflows>
- SSOT: docs/Windsurf_AI_Collab_Rules_latest.md
```

### 方法3: Git Submodule

```bash
git submodule add https://github.com/YuShimoji/shared-workflows.git .shared-workflows
```

参照: `.shared-workflows/docs/Windsurf_AI_Collab_Rules_latest.md`

#### 運用メモ（推奨）

- 初回導入/立て直しは、中央リポジトリの `prompts/first_time/PROJECT_KICKSTART.txt` をプロジェクトのセットアップ担当スレッドに貼り付けて実行する。
- 以降の作業は、プロジェクト内の `.shared-workflows/` を参照することで「中央リポジトリの存在を示唆せず」に SSOT を安定参照できる。

## Doctor（診断ツール）の利用

`sw-doctor.js` は、プロジェクトの環境・スクリプト・ワークフロー状態を自動診断するツールです。

### 基本的な使用方法

```bash
# Bootstrap プロファイル（初期セットアップ検証）
node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-bootstrap --format text

# Full プロファイル（定期的な監査）
node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-doctor --format text

# CI Strict プロファイル（本番環境用）
node .shared-workflows/scripts/sw-doctor.js --profile ci-strict --format text

# JSON 出力（CI 連携用）
node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-doctor --format json
```

詳細は `docs/CLIENT_PROJECT_DOCTOR_GUIDE.md` を参照。

## サブモジュールが利用できない場合のフォールバック

shared-workflows がサブモジュールとして導入されていない場合:
1. 親リポジトリの `scripts/` ディレクトリから必要なスクリプトを直接コピーして使用する
2. `docs/windsurf_workflow/` 内のファイルを直接参照する
3. プロジェクトルートに `AI_CONTEXT.md` を手動で作成する

例: `report-validator.js` が必要な場合
```bash
cp /path/to/source/shared-workflows/scripts/report-validator.js ./scripts/
```

例: `sw-doctor.js` が必要な場合
```bash
cp /path/to/source/shared-workflows/scripts/sw-doctor.js ./scripts/
cp -r /path/to/source/shared-workflows/scripts/utils ./scripts/
```
