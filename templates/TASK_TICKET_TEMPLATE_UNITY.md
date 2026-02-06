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
- `.shared-workflows/` 配下（submodule）
- `ProjectSettings/`, `Packages/`（必要が出たら必ず相談）
- 既存の大規模リファクタ（ファイル移動/削除を伴う変更）

## Constraints
- テスト: 主要パスのみ（網羅テストは後続タスクへ分離）
- フォールバック: 新規追加禁止
- **Unity固有の制約**:
  - Unity Editor上での手動検証が必要な場合、具体的な検証手順を明記する
  - Unity Test Runnerでのテスト実行が必要な場合、テストクラスとテストメソッドを明記する
  - `Assets/` 構造への制約（ProjectSettings/Packages変更禁止等）を明記する
  - EditorOnlyコード（`#if UNITY_EDITOR`）の適切な分離を考慮する
  - ScriptableObject、AssetDatabase等のUnity API使用時の注意点を明記する
- **データ分離（`templates/DESIGN_PRINCIPLES.md` 参照）**:
  - テキストは ScriptableObject or Localization Table に外部化
  - パラメータは ScriptableObject に外部化
  - ハードコードされた文字列・数値がないことをDoDで確認
- 

## Test Plan
- **テスト対象**: （どのクラス/機能をテストするか）
- **EditMode テスト**: （ロジック検証。テストクラス名を明記）
- **PlayMode テスト**: （ランタイム動作検証。テストクラス名を明記）
- **ビルド検証**: （target platform でエラーなし）
- **期待結果**: （何をもってテスト成功とするか）
- **テスト不要の場合**: （理由を明記）

## Impact Radar
- **コード**: （直接変更するファイル/クラス）
- **テスト**: （既存テストへの影響）
- **パフォーマンス**: （実行速度・メモリ・GCへの影響）
- **UX**: （ユーザー体験への影響）
- **連携**: （他機能・シーン・アセットとの接続点）
- **アセット**: （Prefab / ScriptableObject / シーンへの影響）
- **プラットフォーム**: （ターゲットプラットフォーム固有の影響）

## DoD
- [ ] 目的が達成されている
- [ ] 主要パスの検証が完了している
- [ ] **Unity Editor上での動作確認が完了している**（Unity Editorを起動し、実際に動作を確認した結果を記録）
- [ ] **EditModeテスト全通過**（テスト実行結果を記録: `<テストクラス名>=<成功/失敗>`, `<テスト数>=<成功数>/<総数>`）
- [ ] **PlayModeテスト全通過**（テスト実行結果を記録）
- [ ] **ビルド成功**（Unity Editorで確認: `Unity Editor=コンパイル成功`）
- [ ] **データ分離チェック**: ハードコードされたテキスト・設定値がなく、SO/Localizationに外部化されていることを確認
- [ ] docs/inbox/ にレポート（REPORT_...md）が作成されている
- [ ] 本チケットの Report 欄にレポートパスが追記されている

## Notes
- Status は OPEN / IN_PROGRESS / BLOCKED / DONE を想定
- BLOCKED の場合は、事実/根拠/次手（候補）を本文に追記し、Report に docs/inbox/REPORT_...md を必ず設定
- **Unity固有の注意点**:
  - Unity Editor上での手動検証が必要な場合、検証手順を具体的に記録する
  - Unity Test Runnerでのテスト実行が必要な場合、テスト実行結果を記録する
  - ScriptableObject、AssetDatabase等のUnity APIを使用する場合、適切なエラーハンドリングを実装する
  - EditorOnlyコードは `#if UNITY_EDITOR` で適切に分離する
