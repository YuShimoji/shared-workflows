# AI Context

## 基本情報

- **最終更新**: 2025-12-29T09:43:48+09:00
- **更新者**: Cascade

## レポート設定（推奨）

- **report_style**: standard
- **mode**: orchestration
- **creativity_triggers**: 代替案を最低2件提示する / リスクとメリットを表形式で整理する

## 現在のミッション

- **タイトル**: SSOT Entrypoint Unification & Workflow Stabilization
- **Issue**: #0 (Project-wide cleanup & optimization)
- **ブランチ**: main
- **関連PR**: なし
- **進捗**: 90%（SSOTフォールバック完了、一本化設計中、ドキュメント乖離是正中）

## 次の中断可能点

- SSOT エントリポイント化（latest.md への集約）とプロンプト参照の修正完了時
- TASK_001 / TASK_002 の完了時

## 決定事項

- Orchestrator レポートは `report-orch-cli.js` を使用して生成し、`HANDOVER.md` を自動同期する。
- SSOT は `docs/Windsurf_AI_Collab_Rules_latest.md` を唯一のエントリポイントとし、プロンプト指示をこれに一本化する。
- 過去のバージョン（v1.1/v2.0）は、サブモジュールのバージョン差異を吸収するための「内部実装」として扱い、AI の表層的な指示からは隠蔽する。

## リスク/懸念

- `AI_CONTEXT.md` と `HANDOVER.md` の記述が過去のセッション状態と混ざり、Worker が混乱する原因になっている。
- サブモジュールのコミットが古いため、最新のスクリプト機能が一部欠落している（プロジェクト側 `scripts/` で補完中）。

## Worker完了ステータス

- worker_ssot_fallback: completed
- worker_audit: completed

## Worker完了ステータス

- worker_ssot_fallback: completed

## Backlog（将来提案）

- [ ] `report-orch-cli.js` に `AI_CONTEXT.md` の `Worker完了ステータス` を自動解析・更新する機能を追加
- [ ] `sw-doctor.js` に SSOT の「中身」が `latest` に一本化されているかの検証を追加
- [ ] `docs/tasks/` の自動クリーンアップ（DONEから一定期間経過で削除/アーカイブ）

## タスク管理（短期/中期/長期）

### 短期（Next）

- [pending] プロジェクト監査と技術的負債の整理 (Technical Debt & Unimplemented Features) (ref: docs/tasks/TASK_006_TechDebtAudit.md, Status: OPEN)

### 中期（Later）

- [ ] AI_CONTEXT.md を自動整形するスクリプトを dev-check.js フローへ追加
- [ ] orchestrator-audit.js を CI へ統合して false completion を早期検知

### 長期（Someday）

- [ ] False completion 検出と Outlook/Next/Proposals 必須化を別リポジトリにも配布

## 備考（自由記述）

- 現在 docs/inbox/ は空（.gitkeep のみ）。REPORT_ORCH CLI で初の実レポートを作成予定。
- creativity / report hint は standard スタイルを採用済み。必要に応じて REPORT_CONFIG.yml を拡張。

## 履歴

- 2025-12-21 01:05: AI_CONTEXT.md を初期化
