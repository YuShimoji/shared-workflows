# Task: <タスク名>
Status: OPEN
Tier: <1/2/3>
Branch: <main または feature/...>
Owner: <担当名>
Created: <ISO8601>
Report: 
Milestone: <SG-X / MG-X>

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

## Test Plan
- **テスト対象**: （どのクラス/機能をテストするか）
- **テスト種別**: Unit / E2E / Build
- **期待結果**: （何をもってテスト成功とするか）
- **テスト不要の場合**: （理由を明記）

## Impact Radar
- **コード**: （直接変更するファイル/クラス）
- **テスト**: （既存テストへの影響）
- **パフォーマンス**: （実行速度・メモリへの影響）
- **UX**: （ユーザー体験への影響）
- **連携**: （他機能・他システムとの接続点）

## DoD
- [ ] 目的が達成されている
- [ ] 主要パスの検証が完了している
- [ ] **テスト全通過**（テスト不要の場合は理由が明記）
- [ ] **ビルド成功**
- [ ] データ外部化チェック: ハードコードされたテキスト・設定値・パラメータがないことを確認
- [ ] docs/inbox/ にレポート（REPORT_...md）が作成されている
- [ ] 本チケットの Report 欄にレポートパスが追記されている

## Notes
- Status は OPEN / IN_PROGRESS / BLOCKED / DONE を想定
- BLOCKED の場合は、事実/根拠/次手（候補）を本文に追記し、Report に docs/inbox/REPORT_...md を必ず設定
