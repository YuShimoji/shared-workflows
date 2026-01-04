# Task: Worker完了レポートの自動統合スクリプト作成

Status: DONE
Tier: 2
Branch: main
Owner: Worker
Created: 2025-01-03T00:00:00+09:00
Report: docs/inbox/REPORT_TASK_008_20250103.md

## Objective
- Worker完了レポートを自動的に `docs/inbox/` から回収し、`docs/HANDOVER.md` に統合するスクリプト機能を実装
- Orchestratorの作業負荷を軽減し、統合漏れのリスクを排除
- `finalize-phase.js` にWorkerレポート統合機能を追加

## Context
- `scripts/finalize-phase.js` は既に存在し、レポートのアーカイブ（`docs/inbox/` → `docs/reports/`）は実装済み
- しかし、`docs/HANDOVER.md` への自動統合機能は実装されていない
- Orchestratorは手動でWorkerレポートを読み取り、HANDOVER.mdに統合する必要がある
- `scripts/report-orch-cli.js` には `updateHandoverLatest` 関数があり、Orchestratorレポート用のHANDOVER更新は実装済み（79-107行目）
- WorkerレポートをHANDOVERに統合する機能は未実装
- `docs/HANDOVER.md` の36行目に「`finalize-phase.js` の HANDOVER 自動更新機能追加（現在は Task のみ）」というバックログ項目が既に存在

## Focus Area
- `scripts/finalize-phase.js`（Workerレポート統合機能の追加）
- `docs/HANDOVER.md` の「統合レポート」セクション
- Workerレポートの主要情報抽出ロジック（Ticket、Changes、Handover）

## Forbidden Area
- 既存の `finalize-phase.js` の動作を破壊する変更（アーカイブ機能は維持）
- `docs/HANDOVER.md` の既存セクション構造の破壊的変更
- Orchestratorレポート統合機能（`report-orch-cli.js`）の変更

## Constraints
- テスト: 主要パスのみ（既存のWorkerレポートを使用した検証）
- フォールバック: 新規追加禁止
- 既存のOrchestratorレポート統合機能（`report-orch-cli.js` の `updateHandoverLatest`）のパターンを参考にする
- Workerレポートから主要情報（Ticket、Changes、Handover）を抽出してHANDOVERに統合

## DoD
- [x] `scripts/finalize-phase.js` にWorkerレポート統合機能を追加
  - 根拠: `extractWorkerReportInfo()` と `integrateWorkerReports()` 関数を実装し、`main()` に統合処理を追加
- [x] Workerレポートから主要情報（Ticket、Changes、Handover）を抽出するロジックを実装
  - 根拠: `extractWorkerReportInfo()` 関数でTicket、Changes、Handover情報を抽出するロジックを実装
- [x] `docs/HANDOVER.md` の「統合レポート」セクションにWorkerレポートのサマリーを自動追加
  - 根拠: `integrateWorkerReports()` 関数でHANDOVER.mdの「統合レポート」セクションにWorkerレポートを自動追加する機能を実装
- [x] 実装後、実際のWorkerレポートで動作確認
  - 根拠: `node scripts/test-worker-integration.js` で5つのWorkerレポートを検出し、2つの新しいレポートをHANDOVER.mdに統合することを確認
- [x] Orchestratorの作業負荷が軽減されることを確認（手動統合が不要になる）
  - 根拠: `finalize-phase.js` を実行すると、Workerレポートが自動的にHANDOVER.mdに統合されるため、手動統合が不要
- [x] `sw-doctor.js` でシステム健全性を確認
  - 根拠: `node scripts/sw-doctor.js --profile shared-orch-doctor --format text` を実行し、重大なエラーなしを確認
- [x] docs/inbox/ にレポート（REPORT_TASK_008_*.md）が作成されている
  - 根拠: `docs/inbox/REPORT_TASK_008_20250103.md` を作成
- [x] 本チケットの Report 欄にレポートパスが追記されている
  - 根拠: Report 欄に `docs/inbox/REPORT_TASK_008_20250103.md` を追記

## Notes
- Status は OPEN / IN_PROGRESS / BLOCKED / DONE を想定
- BLOCKED の場合は、事実/根拠/次手（候補）を本文に追記し、Report に docs/inbox/REPORT_...md を必ず設定
- 実装は既存のコードパターン（`report-orch-cli.js` の `updateHandoverLatest`）を参考にする
- Workerレポートのフォーマットは `docs/windsurf_workflow/WORKER_PROMPT_TEMPLATE.md` の `output_format` を参照
