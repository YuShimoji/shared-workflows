# AI Context

## 基本情報

- **最終更新**: 2026-02-06T12:30:00+09:00
- **更新者**: Cascade

## レポート設定（推奨）

- **report_style**: standard
- **mode**: orchestration
- **creativity_triggers**: 代替案を最低2件提示する / リスクとメリットを表形式で整理する

## 現在のミッション

- **タイトル**: Repository Modernization & Cleanup
- **Issue**: リポジトリ全体の効率化・高度化
- **ブランチ**: main
- **関連PR**: なし
- **進捗**: 作業中

## 次の中断可能点

- 各 Phase 完了後

## 決定事項

- Orchestrator レポートは `report-orch-cli.js` を使用して生成し、`HANDOVER.md` を自動同期する。
- SSOT は `docs/Windsurf_AI_Collab_Rules_latest.md` を唯一のエントリポイントとし、プロンプト指示をこれに一本化する。
- 過去のバージョン（v1.1/v2.0）は「内部実装」として扱い、AI の表層的な指示からは隠蔽する。
- 表示ルールは `data/presentation.json` を SSOT とする（v2→v3 移行中）。

## リスク/懸念

- プロンプト体系が分散しコンテキストウィンドウを浪費している（簡素化で対応中）。
- docs/ 直下にレガシードキュメントが混在し、新規参入者が迷う。

## Worker完了ステータス

- worker_ssot_fallback: completed
- worker_audit: completed
- worker_onboarding_std: completed
- TASK_007〜012: all completed

## Backlog（将来提案）

- [ ] `docs/tasks/` の自動クリーンアップ（DONE から一定期間経過でアーカイブ）
- [ ] `orchestrator-audit.js` を CI へ統合して false completion を早期検知
- [ ] False completion 検出を別リポジトリにも配布

## タスク管理（短期/中期/長期）

### 短期（Next）

- リポジトリ近代化（プロンプト簡素化、docs 構造整理、presentation.json v3、README 刷新）

### 中期（Later）

- CI パイプラインに orchestrator-audit を統合
- AI_CONTEXT.md を自動整形するスクリプトを dev-check.js フローへ追加

### 長期（Someday）

- CLI/監査フローを他リポジトリへ展開し、共通運用化

## 備考（自由記述）

- creativity / report hint は standard スタイルを採用済み。
- docs/inbox/ には REPORT_UNITY_CYCLIC_DEPS_20250105.md が1件残存（BLOCKED タスク関連）。

## 履歴

- 2025-12-21 01:05: AI_CONTEXT.md を初期化
- 2026-02-06 12:30: リポジトリ近代化に伴い全面クリーンアップ
