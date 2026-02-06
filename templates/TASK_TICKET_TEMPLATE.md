# Task: <タスク名>
Status: OPEN
Tier: <1/2/3>
Branch: <main または feature/...>
Owner: <担当名>
Created: <ISO8601>
Report: 

## Objective
- 

## Context
- 

## Focus Area
- 

## Forbidden Area
- 

## Constraints
- テスト: 主要パスのみ（網羅テストは後続タスクへ分離）
- フォールバック: 新規追加禁止
- データ外部化: テキスト・設定値・パラメータのハードコード禁止（`templates/DESIGN_PRINCIPLES.md` 参照）
- 

## DoD
- [ ] 目的が達成されている
- [ ] 主要パスの検証が完了している
- [ ] データ外部化チェック: ハードコードされたテキスト・設定値・パラメータがないことを確認
- [ ] docs/inbox/ にレポート（REPORT_...md）が作成されている
- [ ] 本チケットの Report 欄にレポートパスが追記されている

## Notes
- Status は OPEN / IN_PROGRESS / BLOCKED / DONE を想定
- BLOCKED の場合は、事実/根拠/次手（候補）を本文に追記し、Report に docs/inbox/REPORT_...md を必ず設定
