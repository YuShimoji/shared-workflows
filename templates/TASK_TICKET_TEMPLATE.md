# Task: <タスク名>
Status: OPEN
Tier: <1/2/3>
Branch: <main または feature/...>
Owner: <担当名>
Created: <ISO8601>
Report:
Milestone: <SG-X / MG-X>
Test Phase: <Slice / Stable / Hardening>

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
- **Test Phase**: <Slice / Stable / Hardening>
- **テスト対象**: （どの public API をテストするか）
- **テスト種別**: Unit / E2E / Build — Test Phase に応じた必須/推奨を明記
- **期待結果**: （observable な振る舞いで記述。実装詳細に依存しないこと）
- **テスト不要の場合**: （理由を明記）

## Verification Gate (A/B for measurement tasks)
- Layer A (AI-completable): 計装、手順書、テンプレ、検証スクリプト、再現条件の固定
- Layer B (manual measurement): Unity/実機の手動実行、測定値回収、証跡保存
- 非実測タスクの場合は `N/A` と明記する

## Impact Radar
- **コード**: （直接変更するファイル/クラス）
- **テスト**: （既存テストへの影響）
- **パフォーマンス**: （実行速度・メモリへの影響）
- **UX**: （ユーザー体験への影響）
- **連携**: （他機能・他システムとの接続点）

## DoD
- [ ] 目的が達成されている
- [ ] 主要パスの検証が完了している
- [ ] **Test Phase に応じたテスト通過**（Slice: ビルド成功+スモーク / Stable: 全テスト通過 / Hardening: 全テスト+エッジケース通過。テスト不要の場合は理由が明記）
- [ ] **ビルド成功**
- [ ] データ外部化チェック: ハードコードされたテキスト・設定値・パラメータがないことを確認
- [ ] Layer A 完了（実測タスクの場合）: 計装/手順/引き渡し資料が揃っている
- [ ] Layer B 完了（実測タスクの場合）: 実測結果と証跡がリポジトリ内に保存され比較可能
- [ ] docs/inbox/ にレポート（REPORT_...md）が作成されている
- [ ] 本チケットの Report 欄にレポートパスが追記されている

## Notes
- Status は OPEN / IN_PROGRESS / BLOCKED / DONE を想定
- BLOCKED の場合は、事実/根拠/次手（候補）を本文に追記し、Report に docs/inbox/REPORT_...md を必ず設定
- BLOCKED は次の正規形を必須とする:
  - Blocker Type
  - AI-Completable Scope (Layer A)
  - User Runbook (Layer B)
  - Resume Trigger
  - Re-proposal Suppression Rule（同一Blockerなら新規提案せず、手順提示に遷移）
