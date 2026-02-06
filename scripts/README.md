# scripts/ — スクリプト機能マップ

shared-workflows のスクリプト一覧。カテゴリ別に整理。

## 毎回の運用（頻度: 高）

| スクリプト | 用途 | 使用例 |
|-----------|------|--------|
| `sw-doctor.js` | 環境診断 | `node scripts/sw-doctor.js --profile shared-orch-bootstrap --format text` |
| `sw-update-check.js` | submodule 更新チェック | `node scripts/sw-update-check.js` |
| `session-end-check.js` | 終了時チェック | `node scripts/session-end-check.js --project-root .` |
| `ensure-ssot.js` | SSOT 補完 | `node scripts/ensure-ssot.js --project-root .` |
| `apply-cursor-rules.ps1` | Cursor ルール適用 | `pwsh -NoProfile -File scripts/apply-cursor-rules.ps1 -ProjectRoot .` |

## レポート・監査

| スクリプト | 用途 | 使用例 |
|-----------|------|--------|
| `report-validator.js` | レポート検証 | `node scripts/report-validator.js <REPORT_PATH>` |
| `report-orch-cli.js` | Orchestrator レポート生成 | `node scripts/report-orch-cli.js` |
| `orchestrator-audit.js` | 巡回監査 | `node scripts/orchestrator-audit.js` |
| `orchestrator-output-validator.js` | 出力フォーマット検証 | `node scripts/orchestrator-output-validator.js <REPORT>` |
| `finalize-phase.js` | レポートアーカイブ + HANDOVER 統合 | `node scripts/finalize-phase.js` |

## タスク管理

| スクリプト | 用途 | 使用例 |
|-----------|------|--------|
| `todo-sync.js` | タスク同期 (tasks → AI_CONTEXT → todo_list) | `node scripts/todo-sync.js` |
| `todo-leak-preventer.js` | TODO 漏れ検知 | `node scripts/todo-leak-preventer.js` |
| `worker-dispatch.js` | Worker プロンプト自動生成 | `node scripts/worker-dispatch.js --ticket docs/tasks/TASK_XXX.md` |
| `worker-activation-check.js` | Worker 起動 GO/NO-GO 判定 | `node scripts/worker-activation-check.js --ticket <PATH>` |
| `worker-monitor.js` | Worker 状態監視 | `node scripts/worker-monitor.js` |

## プロジェクト検出・セットアップ

| スクリプト | 用途 |
|-----------|------|
| `detect-project-type.js` | プロジェクト種別自動検出 |
| `onboard-test.js` | オンボーディング検証 |
| `dev-check.js` | 開発環境チェック |
| `dev-server.js` | 開発サーバ起動 |
| `command-safety-check.js` | コマンド安全性チェック |

## 表示・出力補助

| スクリプト | 用途 |
|-----------|------|
| `progress-meter.js` | 進捗バー生成（presentation.json 準拠） |
| `progress-dashboard.js` | 進捗ダッシュボード表示 |
| `report-style-hint.js` | レポートスタイルヒント生成 |
| `adapt-response.js` | 応答スタイル適応 |
| `creativity-booster.js` | 創造性トリガー |
| `generate-action-choices.js` | アクション選択肢生成 |
| `generate-test-steps.js` | テスト手順生成 |

## ユーティリティ (`utils/`)

| スクリプト | 用途 |
|-----------|------|
| `utils/presentation.js` | presentation.json パーサー |
| `utils/doctor-profiles.js` | sw-doctor プロファイル定義 |
| `utils/filename-sanitize.js` | Windows ファイル名サニタイズ |
| `utils/sw-path.js` | shared-workflows パス解決 |

## その他

| スクリプト | 用途 |
|-----------|------|
| `fix-encoding.ps1` | エンコーディング修正 |
| `ahk/` | AutoHotKey 自動化スクリプト群 |
