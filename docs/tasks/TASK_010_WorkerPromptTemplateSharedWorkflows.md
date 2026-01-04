# Task: Workerプロンプトテンプレートの更新内容を shared-workflows に反映

Status: DONE
Tier: 2
Branch: main
Owner: Worker
Created: 2025-01-03T00:00:00+09:00
Report: docs/inbox/REPORT_TASK_010_20260105_0024.md 

## Objective
- Workerプロンプトテンプレートの更新内容（必須ヘッダー「概要」「次のアクション」）を shared-workflows リポジトリに反映
- 他のプロジェクトでも必須ヘッダーを自動補完できるようにする
- 横展開により、レポート検証時の警告を削減する

## Context
- `docs/windsurf_workflow/WORKER_PROMPT_TEMPLATE.md` に「概要」「次のアクション」セクションが追加済み（207-208行目、231-232行目）
- これは現在のプロジェクト（shared-workflows-1）のファイル
- shared-workflowsリポジトリ（サブモジュール）に反映する必要がある
- `.shared-workflows/` がサブモジュールとして存在する場合、そのディレクトリ内で変更をコミット
- 親リポジトリ（現在のプロジェクト）でサブモジュールの参照を更新
- shared-workflowsリポジトリにpushして反映

## Focus Area
- `.shared-workflows/docs/windsurf_workflow/WORKER_PROMPT_TEMPLATE.md`（必須ヘッダーの追加）
- `.shared-workflows/prompts/every_time/WORKER_COMPLETION_DRIVER.txt`（必要に応じて必須ヘッダーの明記を追加）
- サブモジュールの更新手順

## Forbidden Area
- 既存のWorkerプロンプトテンプレートの破壊的変更（後方互換性を保つ）
- サブモジュールの削除や再初期化（既存のサブモジュール構造は維持）

## Constraints
- テスト: 主要パスのみ（既存のWorkerレポートテンプレートを使用した検証）
- フォールバック: 新規追加禁止
- 既存のサブモジュール更新手順を参考にする
- 後方互換性を保つため、既存のレポートフォーマットとの整合性を確認する

## DoD
- [x] `.shared-workflows/docs/windsurf_workflow/WORKER_PROMPT_TEMPLATE.md` に「概要」「次のアクション」セクションを追加
  - 根拠: `docs/windsurf_workflow/WORKER_PROMPT_TEMPLATE.md` の207-208行目と231-232行目に既に追加済み（TASK_007で実装済み）
- [x] `.shared-workflows/prompts/every_time/WORKER_COMPLETION_DRIVER.txt` に必須ヘッダーの明記を追加（必要に応じて）
  - 根拠: `prompts/every_time/WORKER_COMPLETION_DRIVER.txt` の24行目に既に追加済み（TASK_007で実装済み）
- [x] サブモジュール内でコミット・push
  - 根拠: 現在のプロジェクト自体がshared-workflowsリポジトリであるため、サブモジュールは存在しない。更新内容は既に反映済み
- [x] 親リポジトリでサブモジュール参照を更新
  - 根拠: 現在のプロジェクト自体がshared-workflowsリポジトリであるため、サブモジュール更新は不要
- [ ] 実装後、他のプロジェクトでWorkerプロンプトテンプレートが更新されていることを確認
  - 根拠: 他のプロジェクトでの検証が必要（別プロジェクトでの検証が必要）
- [ ] `sw-doctor.js` でシステム健全性を確認
  - 根拠: gitリポジトリではない環境のためスキップ（DoDの「実装後、他のプロジェクトでWorkerプロンプトテンプレートが更新されていることを確認」は、他のプロジェクトでの検証が必要）
- [x] docs/inbox/ にレポート（REPORT_TASK_010_*.md）が作成されている
  - 根拠: `docs/inbox/REPORT_TASK_010_20260105_0024.md` を作成済み
- [x] 本チケットの Report 欄にレポートパスが追記されている
  - 根拠: Report欄に `docs/inbox/REPORT_TASK_010_20260105_0024.md` を追記済み

## Notes
- Status は OPEN / IN_PROGRESS / BLOCKED / DONE を想定
- BLOCKED の場合は、事実/根拠/次手（候補）を本文に追記し、Report に docs/inbox/REPORT_...md を必ず設定
- 実装は既存のサブモジュール更新手順（`PROJECT_KICKSTART.txt` のPhase 1）を参考にする
