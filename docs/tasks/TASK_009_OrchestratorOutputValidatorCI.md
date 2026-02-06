# Task: orchestrator-output-validator.js を CI パイプラインに組み込む

Status: DONE
Tier: 2
Branch: main
Owner: Worker
Created: 2025-01-03T00:00:00+09:00
Report: docs/inbox/REPORT_TASK_009_20260105_0048.md

## Objective
- orchestrator-output-validator.js を CI パイプラインに組み込み、Orchestratorのチャット出力を自動検証する仕組みを整備
- Orchestratorの出力品質を継続的に向上させる
- 固定5セクション形式の遵守を自動的に検証できるようにする

## Context
- `scripts/orchestrator-output-validator.js` は既に存在し、固定5セクション形式を検証する機能が実装済み
- 固定5セクション（現状/次のアクション/ガイド/メタプロンプト再投入条件/改善提案）の存在確認
- セクションの順序確認
- ユーザー返信テンプレ（完了判定 + 選択肢1-3）の確認
- 禁止セクション（作業評価/結論など）の検出
- `.github/workflows/doctor-health-check.yml` が既に存在し、`sw-doctor.js` をCIに統合している
- `docs/CI_INTEGRATION.md` にCI統合のガイドが存在

## Focus Area
- `.github/workflows/doctor-health-check.yml`（新しいjobの追加）
- `docs/inbox/REPORT_ORCH_*.md`（検証対象）
- `scripts/orchestrator-output-validator.js`（既存の実装を活用）

## Forbidden Area
- 既存のCIパイプラインの動作を破壊する変更（既存のjobは維持）
- `orchestrator-output-validator.js` の検証ロジックの変更（既存の機能は維持）

## Constraints
- テスト: 主要パスのみ（既存のOrchestratorレポートを使用した検証）
- フォールバック: 新規追加禁止
- 既存のCIパイプライン（`doctor-health-check.yml`）のパターンを参考にする
- 検証失敗時はCIを失敗させる

## DoD
- [x] `.github/workflows/doctor-health-check.yml` に `orchestrator-output-validation` jobを追加
- [x] `docs/inbox/REPORT_ORCH_*.md` を検証対象とする
- [x] 検証失敗時はCIを失敗させ、エラー内容を出力
- [x] 実装後、実際のOrchestratorレポートで動作確認
- [ ] CIパイプラインでOrchestratorレポートが自動検証されることを確認（CI実行待ち）
- [x] `sw-doctor.js` でシステム健全性を確認
- [x] docs/inbox/ にレポート（REPORT_TASK_009_*.md）が作成されている
- [x] 本チケットの Report 欄にレポートパスが追記されている

## Notes
- Status は OPEN / IN_PROGRESS / BLOCKED / DONE を想定
- BLOCKED の場合は、事実/根拠/次手（候補）を本文に追記し、Report に docs/inbox/REPORT_...md を必ず設定
- 実装は既存のCIパイプライン（`doctor-health-check.yml`）のjob構造を参考にする
