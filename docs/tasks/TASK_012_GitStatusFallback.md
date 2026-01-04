# Task: Git リポジトリ状態の確認（git status が失敗する場合の代替手段）

Status: DONE
Tier: 2
Branch: main
Owner: Worker
Created: 2025-01-03T00:00:00+09:00
Report: docs/inbox/REPORT_TASK_012_20260105_0033.md 

## Objective
- git status が失敗する場合の代替手段（.git ディレクトリの存在確認など）を追加
- Windows環境でのファイル名制約（コロン文字）への対応を追加
- Gitリポジトリではない環境でも動作可能にする

## Context
- `git status` が失敗する場合（Gitリポジトリではない、権限不足など）の代替手段がない
- Windows環境でのファイル名制約（コロン文字）への対応が必要
- 一部のスクリプト（`session-end-check.js`, `report-validator.js`）で `detectGitRoot` 関数を使用しているが、失敗時の処理が不十分
- `scripts/report-validator.js` の `detectGitRoot` 関数は `git rev-parse --show-toplevel` を使用
- `scripts/session-end-check.js` の `detectGitRoot` 関数も同様
- 失敗時は `null` を返すが、`.git` ディレクトリの存在確認などの代替手段がない
- Windows環境でのファイル名制約（コロン文字）への対応は未実装

## Focus Area
- `scripts/report-validator.js` の `detectGitRoot` 関数（.git ディレクトリの存在確認を追加）
- `scripts/session-end-check.js` の `detectGitRoot` 関数（同様の改善）
- Windows環境でのファイル名制約（コロン文字）への対応

## Forbidden Area
- 既存のGitコマンド実行ロジックの破壊的変更（既存の機能は維持）
- ファイルシステム操作の破壊的変更

## Constraints
- テスト: 主要パスのみ（Gitリポジトリではない環境での検証）
- フォールバック: 新規追加禁止
- 既存の `detectGitRoot` 関数のパターンを参考にする
- 後方互換性を保つため、既存の機能との整合性を確認する

## DoD
- [x] `detectGitRoot` 関数に `.git` ディレクトリの存在確認を追加
- [x] `git rev-parse` が失敗した場合、親ディレクトリを遡って `.git` ディレクトリを探す
- [x] Windows環境でのファイル名制約（コロン文字）への対応を追加
- [x] 実装後、Gitリポジトリではない環境で動作確認
- [x] Windows環境での動作確認
- [x] `sw-doctor.js` でシステム健全性を確認
- [x] docs/inbox/ にレポート（REPORT_TASK_012_*.md）が作成されている
- [x] 本チケットの Report 欄にレポートパスが追記されている

## Notes
- Status は OPEN / IN_PROGRESS / BLOCKED / DONE を想定
- BLOCKED の場合は、事実/根拠/次手（候補）を本文に追記し、Report に docs/inbox/REPORT_...md を必ず設定
- 実装は既存の `detectGitRoot` 関数のパターンを参考にする
- Windows環境でのファイル名制約（コロン文字）への対応は、ファイル名のサニタイズなどを検討する
