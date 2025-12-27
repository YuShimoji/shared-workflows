# Shared Doctor / Check-Fix エンジン設計案

## 1. 目的

shared-workflows に閉じたスクリプト群（ensure-ssot, orchestrator-audit, dev-check, sw-doctor 等）を、
「任意プロジェクトで利用可能な自己診断・自己修復エンジン」として再設計する。

本設計では、具体的なファイル構造（AI_CONTEXT.md, HANDOVER.md, docs/tasks/* など）に依存しない
抽象モデルを定義し、その上に shared-workflows 用のプラグインを載せることを目指す。

## 2. ドメインモデル

### 2.1 Workspace

- 単一のコードベース / リポジトリを表す単位。
- プロジェクトルートパス、設定ファイルパス、拡張メタデータ（例: Git リモート、ブランチ名）を持つ。
- 例:
  - `projectRoot`: `C:/repo/my-app`
  - `config`: `REPORT_CONFIG.yml`, `.doctorrc` など

### 2.2 Artifact

- Workspace 内の「役割を持ったリソース」の抽象。
- 具体的なファイル形式（Markdown/JSON/YAML）には依存せず、「こういう意味を持つもの」として定義する。
- 代表例（shared-workflows 用プラグインの観点）:
  - `Context`: AI_CONTEXT.md
  - `Handover`: docs/HANDOVER.md
  - `TaskBoard`: docs/tasks/*.md
  - `Report`: docs/inbox/REPORT_*.md
- 他プロジェクトでは、Context/Handover/TaskBoard が別ファイルや別ストレージでもよい。

### 2.3 Check

- ある Workspace に対して、invariant を検証する純粋関数として定義する。
- 入力
  - `workspace`: Workspace
  - `options`: 設定・プロファイルに応じたオプション
- 出力（概念）
  - `id`: 一意な識別子（例: `ssot.files.present`, `handover.latest_report_linked`）
  - `severity`: `OK | WARN | ERROR`
  - `message`: 人間向けメッセージ（日本語が既定）
  - `context`: 追加情報（関連ファイルパス、抜粋、提案など）

### 2.4 Fix (Repair)

- Check に紐づく任意の修復アクション。
- 入力
  - `workspace`
  - `checkResult`: 上記の Check の結果
  - `options`: `dryRun`, `interactive` など
- 出力（概念）
  - `applied`: boolean（実際に修正を適用したか）
  - `changes`: 変更ファイル一覧や diff 要約
  - `notes`: 人間向け説明

### 2.5 Profile

- チェック集合とポリシーの組。
- 情報:
  - `id`: プロファイル名（例: `shared-orch-bootstrap`, `shared-orch-doctor`, `ci-strict`）
  - `checks`: 実行する Check の一覧
  - `severityPolicy`: どの severity で fail 扱いにするか
  - `autoFixPolicy`: どの Check/Fix を自動適用するか（`safe-only`/`none`/`all` など）

## 3. レイヤ構造

本エンジンは、概ね次の3レイヤに分ける:

1. **コアエンジン層**
   - Workspace/Artifact/Check/Fix/Profile の型定義と実行エンジン。
   - チェックの並列実行、タイムアウト、再試行ポリシーなどを扱う。
   - 出力は JSON などの機械可読フォーマットを既定とし、人間向けテキストは後段で生成する。

2. **プラグイン層（shared-workflows 用）**
   - AI_CONTEXT/HANDOVER/docs/tasks/docs/inbox に関する具体的な Check/Fix 実装。
   - 既存スクリプト（orchestrator-audit, todo-sync, todo-leak-preventer など）を徐々にここへ集約。

3. **フロントエンド層（CLI / メタプロンプト / CI 連携）**
   - `doctor check`, `doctor fix`, `doctor explain` など、ユーザやCIが呼ぶ入口。
   - 出力形式（text/json/markdown）選択や profile 選択を担当。

## 4. 既存スクリプトとのマッピング

### 4.1 orchestrator-audit.js

- 主な役割
  - docs/tasks, docs/inbox, HANDOVER.md を横断して、整合性をチェック。
  - Orchestrator レポートの検証（report-validator 経由）。
- 将来の位置づけ
  - shared-workflows プラグイン層の **複数 Check の集合** として再定義。
  - 例: `handover.latest_orch_report_linked`, `tasks.report_link_exists`, `inbox.empty_after_merge` など。

### 4.2 ensure-ssot.js

- 主な役割
  - shared-workflows サブモジュール or 共有クローンから SSOT ファイルを取得し、プロジェクト側に揃える。
- 将来の位置づけ
  - Check: `ssot.files.present`
  - Fix: `ssot.ensure_files`
  - `--no-fail` は profile の `severityPolicy`/`autoFixPolicy` でコントロール。

### 4.3 dev-check.js

- 主な役割
  - 複数スクリプト（detect-project-type, report-style-hint, creativity-booster, adapt-response, todo-sync/todo-leak-preventer）を順に実行。
  - Git 競合状態チェック。
- 将来の位置づけ
  - 「profileを選択して Check 集合を実行する CLI」の一実装 → `doctor check --profile shared-orch-dev` に統合。

### 4.4 sw-doctor.js

- 現状
  - 環境チェック → スクリプト可用性 → orchestrator-audit → dev-check → 修復提案 を一括で実行。
- 将来の役割
  - コアエンジンの **ランナー/CLI** の1つとして整理。
  - 段階的リファクタ目標:
    1. 現在の `checkEnvironment` / `checkScripts` / `runAudit` / `runDevCheck` を Check オブジェクトにマッピング（内部API）。
    2. 結果を `{ id, severity, message, context }[]` で取得できるようにする。
    3. `--format text|json` で出力形式を切り替え可能にする。
    4. `--profile shared-orch-bootstrap|shared-orch-doctor|ci-strict` などでチェックセットを切り替える。

## 5. 段階的移行計画（高レベル）

### Phase A: カタログ化と設計固定（このドキュメント）

- 既存スクリプトの振る舞いを Check/Fix 観点でカタログ化する。
- 本ドキュメントでドメインモデルとレイヤ構造・マッピングを固定する。

### Phase B: sw-doctor の内部API化

- 変更は最小限に抑えつつ、現在の
  - `checkEnvironment`
  - `checkScripts`
  - `runAudit`
  - `runDevCheck`
  を、それぞれ Check 実装のラッパとして扱えるよう内部 API を導入する。
- 例（イメージのみ・実装は別フェーズ）:
  - `runChecks(profileId, options) -> CheckResult[]`
- この段階では CLI 表面は極力互換を保つ（`node scripts/sw-doctor.js` の振る舞いは維持）。

### Phase C: プロファイルと出力形式の導入

- `--profile` オプション:
  - 例: `shared-orch-bootstrap`, `shared-orch-doctor`, `ci-strict`。
  - 各 profile ごとに実行する Check セットとポリシーを定義。
- `--format` オプション:
  - `text`（現行互換）と `json`（CI や他ツール連携用）を用意。
  - JSON には CheckResult 一覧とサマリ（OK/WARN/ERROR 数など）を含める。

### Phase D: メタプロンプト・ドキュメントの整理

- ORCHESTRATOR_METAPROMPT / PROJECT_KICKSTART / WORKER_METAPROMPT を「個別 Node スクリプト名」から
  「doctor profile 呼び出し」ベースの指示へ段階的に書き換える。
- 例:
  - 旧: `node scripts/orchestrator-audit.js --no-fail`
  - 新: `node scripts/sw-doctor.js --profile shared-orch-doctor --format text`

### Phase E: 他プロジェクト向け拡張

- shared-workflows 外のプロジェクトで、独自の Artifact/Check/Fix を追加できるエクステンションポイントを整備。
- 想定:
  - `doctor.config.js` や `.doctorrc` による profile/プラグイン設定。
  - shared-workflows は「標準プラグインセット」として利用される。

## 6. CI 連携とカスタム設定

### 6.1 CI での利用

doctor の JSON 出力（`--format json`）を活用して、GitHub Actions や他の CI システムから:
- 環境チェック結果の機械的な評価
- PR コメントへの自動レポート生成
- ビルド失敗判定（profile の severityPolicy に基づく）

詳細は `docs/CI_INTEGRATION.md` を参照。

### 6.2 カスタム設定（`.doctorrc.js`）

プロジェクト固有の doctor 設定を `.doctorrc.js` で定義可能にする（将来実装）:
- プロファイルの追加・上書き
- カスタム Check/Fix の追加
- 環境変数や外部設定の読み込み

テンプレートは `templates/.doctorrc.example.js` を参照。

## 7. 今後の優先タスク

1. **✅ sw-doctor 内部での CheckResult 構造の導入** (完了)
   - CheckResult 配列を構築し、JSON 出力に対応。

2. **✅ --format / --profile オプションの仕様確定** (完了)
   - 3 つのプロファイル（bootstrap/doctor/ci-strict）を定義。
   - JSON スキーマを実装。

3. **✅ メタプロンプトへの doctor 統合方針の詳細化** (完了)
   - ORCHESTRATOR_METAPROMPT / PROJECT_KICKSTART を doctor プロファイル呼び出しベースに更新。

4. **次フェーズ（将来実装）**
   - `.doctorrc.js` のサポート（カスタムプロファイル・Check/Fix の追加）
   - 他プロジェクト向けの doctor パッケージ化（npm 公開等）
   - GitHub Actions テンプレートの提供
   - プラグインシステムの整備

このドキュメントは、上記タスクの設計上の基準点（SSOT）として扱い、実装変更時には随時更新する。
