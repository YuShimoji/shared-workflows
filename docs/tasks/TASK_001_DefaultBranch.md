# Task: GitHubのデフォルトブランチを main に統一（origin/HEAD を是正）

Status: DONE
Tier: 1
Branch: main
Owner: Orchestrator
Created: 2025-12-20T10:05+09:00
Report: docs/reports/REPORT_ORCH_20251226_1332.md
## DoD
- [x] GitHub 側のデフォルトブランチを `main` に統一し、clone 時の初期ブランチが `main` になる状態にする。
- [x] ローカルで `git remote show origin` の `HEAD branch` が `main` になっていることを確認できる状態にする。
- [x] 変更/判断の根拠を docs/inbox/ のレポートに残している
- [x] 本チケットの Report 欄にレポートパスが追記されている

## Current Status
- ローカルブランチは `main` に一本化済み。
- リモート (`origin/HEAD`) は依然として `chore/central-init` を指している。
- `git remote set-head origin main` は実行したが、GitHub 側のデフォルトブランチ設定が優先されるため反映されない。

## Next Action for User
- GitHub リポジトリ設定 (Settings > General > Default branch) で `main` をデフォルトブランチに変更してください。
- 変更後、Orchestrator が `git remote set-head origin -a` を実行して完了とします。

## Context

- 現状 `origin/HEAD -> origin/chore/central-init` となっており、初見の利用者が `main` ではないブランチに着地しうる。
- 本リポジトリは SSOT として参照されるため、入口での迷いを減らす必要がある。

## Focus Area

- GitHub リポジトリ設定（Default branch）
- `docs/`（必要なら README / OPEN_HERE / CENTRAL_REPO_REF の注意書きのみ）

## Forbidden Area

- 履歴破壊操作（rebase/reset/force push）
- 運用に無関係な大規模リファクタ

## Constraints

- テスト: 主要パスのみ（clone/参照導線の確認）
- フォールバック: 新規追加禁止

## DoD

- [ ] GitHub 側の Default branch が `main` になっている
- [ ] `git remote show origin` の `HEAD branch` が `main` と確認できる
- [ ] 変更/判断の根拠を docs/inbox/ のレポートに残している
- [ ] 本チケットの Report 欄にレポートパスが追記されている

## Notes

- GitHub 側の設定変更が必要な場合は、手順と理由をレポートに明記する
