# shared-workflows

共通の開発ワークフローと AI 協調開発ルール（Single Source of Truth）を提供する中央リポジトリです。

## 最新ルール

- **ルール本体（最新版 / SSOT）**: `docs/Windsurf_AI_Collab_Rules_latest.md`
  - v1.1/v2.0 の改善を取り込んだ単一のエントリポイント
  - 実行フローの完全明確化、クリーンアップの義務化を定義

## 各プロジェクトでの運用

各プロジェクトは本リポジトリのルールを参照し、プロジェクト直下の `AI_CONTEXT.md` を運用してください。

### テンプレート

- `templates/AI_CONTEXT.md` - AI作業状態記録用テンプレート
- `templates/ORCHESTRATION_PROMPT.md` - オーケストレーション用プロンプト（任意）
- `templates/PROJECT_KICKSTART_PROMPT.md` - 初回セットアップ用プロンプト（参照。説明付き / フォールバック）
- `docs/windsurf_workflow/OPEN_HERE.md` - 運用者の入口（参照。どのフォルダを開く / どれをコピペする、を1枚に集約）
- `docs/windsurf_workflow/ORCHESTRATOR_METAPROMPT.md` - Orchestrator起動用（参照）
- `docs/windsurf_workflow/WORKER_PROMPT_TEMPLATE.md` - Orchestrator が毎回生成する Worker 起動用プロンプトのテンプレ（3つ目のテンプレ / 参照用）
- `prompts/first_time/PROJECT_KICKSTART.txt` - 初回セットアップ用プロンプト（コピペ用）
- `prompts/every_time/ORCHESTRATOR_METAPROMPT.txt` - Orchestrator起動用（毎回コピペ用）
- `prompts/global/WINDSURF_GLOBAL_RULES.txt` - Windsurf Global Rules（端末ごとの統一 / コピペ用）
- `prompts/role/ROLE_PROMPT_*.txt` - 役割別プロンプト（コピペ用 / 参考・フォールバック）
- `templates/TASK_TICKET_TEMPLATE.md` - docs/tasks/TASK_*.md の雛形（Orchestratorがチケット発行時に使用）
- `templates/ROLE_PROMPT_IMPLEMENTER.md` - 役割別プロンプト（実装者 / 参照。説明・デモ付き）
- `templates/ROLE_PROMPT_REVIEWER.md` - 役割別プロンプト（レビュア / 参照。説明・デモ付き）
- `templates/ROLE_PROMPT_CI_HANDLER.md` - 役割別プロンプト（CI対応 / 参照。説明・デモ付き）
- `templates/ROLE_PROMPT_RELEASE_MANAGER.md` - 役割別プロンプト（リリース担当 / 参照。説明・デモ付き）
- `templates/ISSUE_TEMPLATE.md` - Issue作成用テンプレート
- `templates/PR_TEMPLATE.md` - PR作成用テンプレート
- `templates/cleanup.sh` - クリーンアップチェックスクリプト

## v2.0 の主な改善点

### 問題1: 自動PR・自動マージ直前での停止 → 解決

- **CI成功 = 即座に自動マージ** の単純ルール
- 中断禁止ゾーン（PR作成～マージ）で人間の介入を排除
- タイムアウト処理の明確化

### 問題2: 不要なコード（デバッグ、コメントアウト）の残留 → 解決

- **クリーンアップチェック** の義務化（PR作成前に必須）
- 自動検出スクリプト（`cleanup.sh`）の提供
- Pre-flightチェックの一部として組み込み

### 運用: コマンド実行の事前承認（効率化）

- 最新版SSOT（latest）に **「コマンド実行ポリシー（高速化）」** の運用ルールを含みます
- 原則として、ローカルで安全なコマンドは AI が自律実行し、作業を止めずに進めます
- 外部通信/破壊的操作/依存関係追加/長時間実行などは事前承認を取り、必要な場合はワンストップ（1回の承認）でまとめて提示します（ただし、GitHub操作を普段から自動承認する運用なら承認待ちで停止しない）

## クイックスタート

最小運用（推奨）:

- 初回のみ `prompts/first_time/PROJECT_KICKSTART.txt` を使い、各プロジェクトに `.shared-workflows/`（Submodule）を導入
- 運用者の入口（参照。どのフォルダを開く/どれをコピペする）: `.shared-workflows/docs/windsurf_workflow/OPEN_HERE.md`
- 毎回 `.shared-workflows/prompts/every_time/ORCHESTRATOR_METAPROMPT.txt` を Orchestrator スレッドに貼る
- Worker 用プロンプトは Orchestrator がチケット内容（Tier/Focus/Forbidden 等）に合わせて動的生成する
  - 生成ベース（参照用テンプレ）: `.shared-workflows/docs/windsurf_workflow/WORKER_PROMPT_TEMPLATE.md`

端末ごとの統一（推奨）:

- Windsurf の Global Rules に `.shared-workflows/prompts/global/WINDSURF_GLOBAL_RULES.txt` を貼る

1. プロジェクトルートに `AI_CONTEXT.md` を配置（`templates/AI_CONTEXT.md` をコピー）
2. `scripts/cleanup.sh` を配置（`templates/cleanup.sh` をコピーしてカスタマイズ）
3. （任意）プロジェクトルートに `ORCHESTRATION_PROMPT.md` を配置（`templates/ORCHESTRATION_PROMPT.md` をコピー）
4. CI設定にPre-flightチェックを組み込む
5. AI に最新版SSOT（`.shared-workflows/docs/Windsurf_AI_Collab_Rules_latest.md`）を参照させる
6. （任意）`docs/ISSUES.md` を起点にバックログを管理し、Issue同期ワークフロー（`.github/workflows/sync-issues.yml`）でGitHub Issueに反映する

役割が明確な場合は、`templates/ROLE_PROMPT_*.md` の「毎回のプロンプト（コピペ用）」を使うと、返信フォーマットとエッジケース対応まで一貫します（運用方針として固定テンプレを増やさない場合は、Orchestrator が Worker 用の最小プロンプトを動的生成してもよい）。

## 参照ナビ（いつ・何を見るか）

<a id="reference-navigation" name="reference-navigation"></a>

このリポジトリの参照先は多いので、**「今の状況」→「見るべきファイル/見出し」** をここに集約します。

### 0) 迷ったらまずここ（毎回の基本）

- **運用者の入口（参照。どのフォルダを開く/どれをコピペする）**: `docs/windsurf_workflow/OPEN_HERE.md`（このリポジトリ内） / `.shared-workflows/docs/windsurf_workflow/OPEN_HERE.md`（プロジェクト側 / Submodule）
- **コピペ用プロンプト集**: `prompts/`（このリポジトリ内） / `.shared-workflows/prompts/`（プロジェクト側 / Submodule）
- **SSOT（最新版）**: `docs/Windsurf_AI_Collab_Rules_latest.md`（プロジェクト側 / Submodule）
  - 見る箇所: `0. 起動シーケンス` / `1. 基本原則` / `3. 必須フロー（Tier 2の標準）`
- **プロジェクトの状態**: プロジェクトルート `AI_CONTEXT.md`
  - 見る箇所: `現在のミッション` / `次の中断可能点` / `リスク/懸念` / `短期（Next）`
- **全体進行（任意）**: プロジェクトルート `ORCHESTRATION_PROMPT.md`
  - 見る箇所: `毎回のプロンプト（オーケストレーター用）` / `エッジケース早見表` / `デモ`
- **タスク堆積（必須）**: `docs/tasks/` / `docs/inbox/` / `docs/HANDOVER.md`
  - 見る箇所:
    - `docs/tasks/`: `Status: OPEN/IN_PROGRESS/DONE`（チケットのSSOT）
    - `docs/inbox/`: `REPORT_...md`（Worker納品物。次回Orchestratorが回収）
    - `docs/HANDOVER.md`: 全体進捗、ブロッカー、運用フラグ（例: `GitHubAutoApprove: true`）
- **巡回監査（任意）**: `node .shared-workflows/scripts/orchestrator-audit.js`
  - 見る箇所: Warnings/Anomalies（報告漏れ/乖離の検知）

### 1) 作業開始（新規/再開）

- **SSOT**: `docs/Windsurf_AI_Collab_Rules_latest.md`（このリポジトリ内） / `.shared-workflows/docs/Windsurf_AI_Collab_Rules_latest.md`（プロジェクト側 / Submodule）
  - 見る箇所: `0. 起動シーケンス`
- **AI_CONTEXT.md**
  - 見る箇所: `進捗` / `次の中断可能点`

### 2) Issue化・計画（Goal/DoDの明文化）

- **SSOT**: `docs/Windsurf_AI_Collab_Rules_latest.md`
  - 見る箇所: `3. 必須フロー（Tier 2の標準）` の `Step 1: Issue作成`
- **テンプレ**: `templates/ISSUE_TEMPLATE.md`

### 3) 実装（Tier 2の標準）

- **役割別プロンプト（実装者）**: `templates/ROLE_PROMPT_IMPLEMENTER.md`
  - 見る箇所: `毎回のプロンプト（コピペ用）` / `デモ`
- **SSOT**: `docs/Windsurf_AI_Collab_Rules_latest.md`
  - 見る箇所: `Step 3: 実装` → `Step 4: クリーンアップチェック` → `Step 5: Pre-flight Check` → `Step 6: コミット`
- **クリーンアップ**: `templates/cleanup.sh`（各プロジェクトで `scripts/cleanup.sh` に配置）

### 4) PR作成・レビュー

- **SSOT**: `docs/Windsurf_AI_Collab_Rules_latest.md`
  - 見る箇所: `Step 7: PR自動作成` / `Step 8: CI実行（AIは待機）` / `Step 9: 自動マージ`
- **役割別プロンプト（レビュア）**: `templates/ROLE_PROMPT_REVIEWER.md`
- **テンプレ**: `templates/PR_TEMPLATE.md`

### 5) CIが失敗した（最優先で復旧）

- **役割別プロンプト（CI対応）**: `templates/ROLE_PROMPT_CI_HANDLER.md`
  - 見る箇所: `毎回のプロンプト（コピペ用）` / `判断基準` / `デモ`
- **SSOT**: `docs/Windsurf_AI_Collab_Rules_latest.md`
  - 見る箇所: `Step 5: Pre-flight Check` / `Step 8: CI実行（AIは待機）`
- **オーケストレーションテンプレ**: `templates/ORCHESTRATION_PROMPT.md`
  - 見る箇所: `デモ3: CIが失敗する` / `デモ5: 権限不足` / `デモ7: Secrets/環境変数が足りない`

（補足）Worker起動プロンプトの作り方は `.shared-workflows/docs/windsurf_workflow/WORKER_PROMPT_TEMPLATE.md` を参照。

### 6) リリース（本番系はTier 3になりやすい）

- **役割別プロンプト（リリース担当）**: `templates/ROLE_PROMPT_RELEASE_MANAGER.md`
- **SSOT**: `docs/Windsurf_AI_Collab_Rules_latest.md`
  - 見る箇所: `2. 簡素化されたTier分類` の `Tier 3（人間承認必須）`

### 7) よくある詰まり（まとめ）

- **オーケストレーションテンプレ**: `templates/ORCHESTRATION_PROMPT.md`
  - 見る箇所: `エッジケース早見表` / `デモ2: pushが拒否される` / `デモ6: PR自動マージが働かない`

## 関連リンク

- [Windsurf AI 協調開発ルール（最新版 / SSOT）](./docs/Windsurf_AI_Collab_Rules_latest.md)
- [変更履歴（v2.0）](./docs/Windsurf_AI_Collab_Rules_v2.0.md#変更履歴)
- [Issue同期用バックログ（docs/ISSUES.md）](./docs/ISSUES.md)
- [参照ナビ（いつ・何を見るか）](#reference-navigation)
