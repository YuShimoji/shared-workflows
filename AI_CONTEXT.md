# AI Context

## 基本情報

- **最終更新**: 2026-02-06T15:15:00+09:00
- **更新者**: Cascade

## レポート設定（推奨）

- **report_style**: standard
- **mode**: orchestration
- **creativity_triggers**: 代替案を最低2件提示する / リスクとメリットを表形式で整理する

## 現在のミッション

- **タイトル**: Submodule Safety & SemVer
- **Issue**: サブモジュール運用安定化（互換性ゲート・SemVer・更新ガイド・エンコーディング強化）
- **ブランチ**: main
- **関連PR**: なし
- **進捗**: 完了

## 次の中断可能点

- 各 Phase 完了後

## 決定事項

- Orchestrator レポートは `report-orch-cli.js` を使用して生成し、`HANDOVER.md` を自動同期する。
- SSOT は `docs/Windsurf_AI_Collab_Rules_latest.md` を唯一のエントリポイントとし、プロンプト指示をこれに一本化する。
- 過去のバージョン（v1.1/v2.0）は「内部実装」として扱い、AI の表層的な指示からは隠蔽する。
- 表示ルールは `data/presentation.json` を SSOT とする（v3 移行完了）。
- サブモジュール更新前に `compat-check.js` で互換性検証を行う。
- SemVer 軽運用（`docs/VERSIONING.md`）。Breaking Change 時は MAJOR を上げる。

## リスク/懸念

- サブモジュール更新時に親プロジェクトが壊れるリスク（`compat-check.js` で緩和）。
- エンコーディング事故（Windows 環境での BOM/Shift-JIS 混在）。

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

- サブモジュール運用安定化完了（v1.0.0 タグ付与済み）

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
- 2026-02-06 12:45: Repository Modernization 完了（8 Phase、9 commits）
- 2026-02-06 15:15: Submodule Safety 改善（compat-check / SUBMODULE_GUIDE / VERSIONING / encoding CI / ensure-ssot fix）
