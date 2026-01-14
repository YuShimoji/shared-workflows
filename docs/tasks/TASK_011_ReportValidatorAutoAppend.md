# Task: レポート検証の自動化（report-validator.js の実行結果をレポートに自動追記）

Status: DONE
Tier: 2
Branch: main
Owner: Worker
Created: 2025-01-03T00:00:00+09:00
Report: docs/inbox/REPORT_TASK_011_20260105_0026.md 

## Objective
- report-validator.js の実行結果をレポートに自動追記する仕組みを追加
- WorkerやOrchestratorの作業負荷を軽減し、検証結果の記録漏れを防止
- レポートの品質を向上させる

## Context
- `report-validator.js` は現在、手動実行が必要
- 実行結果はコンソールに出力されるが、レポートファイルに自動追記されない
- WorkerやOrchestratorが手動で検証結果をレポートに記載する必要がある
- `scripts/report-validator.js` は既に存在し、検証機能が実装済み
- 検証結果は `console.log` で出力される（Errors, Warnings, Suggestions）
- `validateReport` 関数は `errors` と `warnings` を返すが、レポートファイルへの自動追記機能はない
- `scripts/report-orch-cli.js` では `runValidator` 関数で検証を実行しているが、結果をレポートに追記していない

## Focus Area
- `scripts/report-validator.js`（`--append-to-report` オプションの追加）
- レポートファイルの `## Verification` セクション（検証結果の自動追記）
- 既存の検証結果の処理（上書きまたは追記）

## Forbidden Area
- 既存の検証ロジックの変更（検証機能は維持）
- レポートファイルの破壊的変更（既存のセクション構造は維持）

## Constraints
- テスト: 主要パスのみ（既存のレポートを使用した検証）
- フォールバック: 新規追加禁止
- 既存の検証ロジック（`validateReport` 関数）を活用する
- 後方互換性を保つため、既存の機能との整合性を確認する

## DoD
- [x] `report-validator.js` に `--append-to-report` オプションを追加
- [x] 検証結果をレポートファイルの `## Verification` セクションに自動追記
- [x] 既存の検証結果がある場合は、上書きまたは追記する
- [x] 実装後、実際のレポートで動作確認
- [x] WorkerやOrchestratorの作業負荷が軽減されることを確認
- [x] `sw-doctor.js` でシステム健全性を確認（リンターエラーなし）
- [x] docs/inbox/ にレポート（REPORT_TASK_011_*.md）が作成されている
- [x] 本チケットの Report 欄にレポートパスが追記されている

## Notes
- Status は OPEN / IN_PROGRESS / BLOCKED / DONE を想定
- BLOCKED の場合は、事実/根拠/次手（候補）を本文に追記し、Report に docs/inbox/REPORT_...md を必ず設定
- 実装は既存の検証ロジック（`validateReport` 関数）を活用する
