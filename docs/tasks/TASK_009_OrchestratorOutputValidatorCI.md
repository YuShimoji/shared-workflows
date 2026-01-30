# Task: orchestrator-output-validator.js めECI パイプラインに絁E��込む

Status: DONE
Tier: 2
Branch: main
Owner: Worker
Created: 2025-01-03T00:00:00+09:00
Report: docs/inbox/REPORT_TASK_009_20260105_0048.md

## Objective
- orchestrator-output-validator.js めECI パイプラインに絁E��込み、OrchestratorのチャチE��出力を自動検証する仕絁E��を整傁E- Orchestratorの出力品質を継続的に向上させる
- 固宁Eセクション形式�E遵守を自動的に検証できるようにする

## Context
- `scripts/orchestrator-output-validator.js` は既に存在し、固宁Eセクション形式を検証する機�Eが実裁E��み
- 固宁Eセクション�E�現状/次のアクション/ガイチEメタプロンプト再投入条件/改喁E��案）�E存在確誁E- セクションの頁E��確誁E- ユーザー返信チE��プレ�E�完亁E��宁E+ 選択肢1-3�E��E確誁E- 禁止セクション�E�作業評価/結論など�E��E検�E
- `.github/workflows/doctor-health-check.yml` が既に存在し、`sw-doctor.js` をCIに統合してぁE��
- `docs/CI_INTEGRATION.md` にCI統合�Eガイドが存在

## Focus Area
- `.github/workflows/doctor-health-check.yml`�E�新しいjobの追加�E�E- `docs/inbox/REPORT_ORCH_*.md`�E�検証対象�E�E- `scripts/orchestrator-output-validator.js`�E�既存�E実裁E��活用�E�E
## Forbidden Area
- 既存�ECIパイプラインの動作を破壊する変更�E�既存�Ejobは維持E��E- `orchestrator-output-validator.js` の検証ロジチE��の変更�E�既存�E機�Eは維持E��E
## Constraints
- チE��チE 主要パスのみ�E�既存�EOrchestratorレポ�Eトを使用した検証�E�E- フォールバック: 新規追加禁止
- 既存�ECIパイプライン�E�Edoctor-health-check.yml`�E��Eパターンを参老E��する
- 検証失敗時はCIを失敗させる

## DoD
- [x] `.github/workflows/doctor-health-check.yml` に `orchestrator-output-validation` jobを追加
- [x] `docs/inbox/REPORT_ORCH_*.md` を検証対象とする
- [x] 検証失敗時はCIを失敗させ、エラー冁E��を�E劁E- [x] 実裁E��、実際のOrchestratorレポ�Eトで動作確誁E- [ ] CIパイプラインでOrchestratorレポ�Eトが自動検証されることを確認！EI実行征E���E�E- [x] `sw-doctor.js` でシスチE��健全性を確誁E- [x] docs/inbox/ にレポ�Eト！EEPORT_TASK_009_*.md�E�が作�EされてぁE��
- [x] 本チケチE��の Report 欁E��レポ�Eトパスが追記されてぁE��

## Notes
- Status は OPEN / IN_PROGRESS / BLOCKED / DONE を想宁E- BLOCKED の場合�E、事宁E根拠/次手（候補）を本斁E��追記し、Report に docs/inbox/REPORT_...md を忁E��設宁E- 実裁E�E既存�ECIパイプライン�E�Edoctor-health-check.yml`�E��Ejob構造を参老E��する
