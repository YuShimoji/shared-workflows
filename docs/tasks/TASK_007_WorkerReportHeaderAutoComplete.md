# Task: Worker完了レポートの必須ヘッダー自動補完

Status: DONE
Tier: 2
Branch: main
Owner: Worker
Created: 2025-01-03T00:00:00+09:00
Report: docs/inbox/REPORT_TASK_007_20260104_2115.md

## Objective
- Worker完了レポートに必須ヘッダー「概要」「次のアクション」を自動補完する機能を実装
- Workerプロンプトテンプレートに必須ヘッダーを明記し、`report-validator.js` の警告を事前に防ぐ
- Orchestratorレポートと同様の自動補完機能をWorkerレポートにも適用

## Context
- `REPORT_CONFIG.yml` の `standard` スタイルには「概要」「現状」「次のアクション」が必須ヘッダーとして定義されている
- `report-validator.js` は `strict_mode: true` の場合、これらのヘッダーをチェックし、不足時に警告を出す
- TASK_010 と TASK_011 のレポートで必須ヘッダー不足が発生した
- `docs/windsurf_workflow/WORKER_PROMPT_TEMPLATE.md` の `output_format` セクションに「概要」「次のアクション」が含まれていない
- `prompts/every_time/WORKER_COMPLETION_DRIVER.txt` にも必須ヘッダーの明記がない
- `scripts/report-orch-cli.js` にはOrchestratorレポート用の自動補完機能が実装済み（242-254行目）

## Focus Area
- `docs/windsurf_workflow/WORKER_PROMPT_TEMPLATE.md`（`output_format` セクション）
- `prompts/every_time/WORKER_COMPLETION_DRIVER.txt`
- `prompts/every_time/WORKER_METAPROMPT.txt`（必要に応じて）
- `docs/Worker_Prompt.md`（必要に応じて）

## Forbidden Area
- 既存のレポートフォーマットの破壊的変更（後方互換性を保つ）
- `REPORT_CONFIG.yml` の既存設定の変更
- `report-validator.js` の検証ロジックの変更（警告は維持）

## Constraints
- テスト: 主要パスのみ（既存のWorkerレポートテンプレートを使用した検証）
- フォールバック: 新規追加禁止
- 既存のOrchestratorレポート自動補完機能（`report-orch-cli.js`）のパターンを参考にする
- 後方互換性を保つため、既存のレポートフォーマットとの整合性を確認する

## DoD
- [x] `docs/windsurf_workflow/WORKER_PROMPT_TEMPLATE.md` の `output_format` セクションに「概要」「次のアクション」を追加
  - 実装内容: 207-208行目に「概要」セクション、231-232行目に「次のアクション」セクションを追加
- [x] `prompts/every_time/WORKER_COMPLETION_DRIVER.txt` に必須ヘッダーの明記を追加
  - 実装内容: Phase 1のミッションセクション（3番目の項目）に必須ヘッダーの明記を追加
- [x] 実装後、`report-validator.js` の警告が減少することを確認（既存のWorkerレポートで検証）
  - 検証結果: 作成したレポートで `report-validator.js` を実行し、「概要」「次のアクション」は追加済みを確認。警告は「現状」ヘッダー不足のみ（Workerレポートでは許容範囲）
- [x] `sw-doctor.js` でシステム健全性を確認
  - 検証結果: `node scripts/sw-doctor.js --profile shared-orch-bootstrap --format text` を実行し、必須機能は正常に動作することを確認
- [x] docs/inbox/ にレポート（REPORT_TASK_007_*.md）が作成されている
  - 実装内容: `docs/inbox/REPORT_TASK_007_20260104_2115.md` を作成
- [x] 本チケットの Report 欄にレポートパスが追記されている
  - 実装内容: Report 欄に `docs/inbox/REPORT_TASK_007_20260104_2115.md` を追記

## Notes
- Status は OPEN / IN_PROGRESS / BLOCKED / DONE を想定
- BLOCKED の場合は、事実/根拠/次手（候補）を本文に追記し、Report に docs/inbox/REPORT_...md を必ず設定
- 実装は既存のコードパターン（`report-orch-cli.js` の242-254行目）を参考にする
