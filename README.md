# shared-workflows

共通の開発ワークフローと AI 協調開発ルール（Single Source of Truth）を提供する中央リポジトリです。

## 最新ルール

- **ルール本体（最新版 / SSOT）**: `docs/Windsurf_AI_Collab_Rules_latest.md`
  - 現在の latest は v2.0 を指します（将来はここが更新されます）
  - v1.1 の問題点（自動PR/マージ直前での停止、不要なコード残留）を根絶
  - 実行フローの完全明確化、クリーンアップの義務化を実現
- **旧バージョン**: `docs/Windsurf_AI_Collab_Rules_v1.1.md` (非推奨)

## 各プロジェクトでの運用

各プロジェクトは本リポジトリのルールを参照し、プロジェクト直下の `AI_CONTEXT.md` を運用してください。

### テンプレート

- `templates/AI_CONTEXT.md` - AI作業状態記録用テンプレート
- `templates/ORCHESTRATION_PROMPT.md` - オーケストレーション用プロンプト（任意）
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

1. プロジェクトルートに `AI_CONTEXT.md` を配置（`templates/AI_CONTEXT.md` をコピー）
2. `scripts/cleanup.sh` を配置（`templates/cleanup.sh` をコピーしてカスタマイズ）
3. （任意）プロジェクトルートに `ORCHESTRATION_PROMPT.md` を配置（`templates/ORCHESTRATION_PROMPT.md` をコピー）
4. CI設定にPre-flightチェックを組み込む
5. AI に最新版SSOT（`docs/Windsurf_AI_Collab_Rules_latest.md`）を参照させる
6. （任意）`docs/ISSUES.md` を起点にバックログを管理し、Issue同期ワークフロー（`.github/workflows/sync-issues.yml`）でGitHub Issueに反映する

## 関連リンク

- [Windsurf AI 協調開発ルール（最新版 / SSOT）](./docs/Windsurf_AI_Collab_Rules_latest.md)
- [変更履歴（v2.0）](./docs/Windsurf_AI_Collab_Rules_v2.0.md#変更履歴)
- [Issue同期用バックログ（docs/ISSUES.md）](./docs/ISSUES.md)
