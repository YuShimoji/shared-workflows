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

- 最新版SSOT（latest）に **「全コマンド事前承認（バッチ承認）」** の運用ルールを含みます
- スレッドごとに確認が挟まる問題に対し、AI は次に必要なコマンドをまとめて提示し、ユーザーが一括承認してから実行します

## クイックスタート

1. プロジェクトルートに `AI_CONTEXT.md` を配置（`templates/AI_CONTEXT.md` をコピー）
2. `scripts/cleanup.sh` を配置（`templates/cleanup.sh` をコピーしてカスタマイズ）
3. CI設定にPre-flightチェックを組み込む
4. AI に最新版SSOT（`docs/Windsurf_AI_Collab_Rules_latest.md`）を参照させる

## 関連リンク

- [Windsurf AI 協調開発ルール（最新版 / SSOT）](./docs/Windsurf_AI_Collab_Rules_latest.md)
- [変更履歴（v2.0）](./docs/Windsurf_AI_Collab_Rules_v2.0.md#変更履歴)
