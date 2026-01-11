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
- **Unity Editor上での手動検証が必要な場合の明記**
- **Unity Test Runnerでのテスト実行要件**
- **Assets/構造への制約（ProjectSettings/Packages変更禁止等）**
- **EditorOnlyコードの適切な分離（#if UNITY_EDITOR）**
- 

## DoD
- [ ] 目的が達成されている
- [ ] 主要パスの検証が完了している
- [ ] **Unity Editor上での動作確認完了**
- [ ] **Unity Test Runnerでのテスト成功確認（該当する場合）**
- [ ] **コンパイルエラーなし（Unity Editorで確認）**
- [ ] docs/inbox/ にレポート（REPORT_...md）が作成されている
- [ ] 本チケットの Report 欄にレポートパスが追記されている

## Notes
- Status は OPEN / IN_PROGRESS / BLOCKED / DONE を想定
- BLOCKED の場合は、事実/根拠/次手（候補）を本文に追記し、Report に docs/inbox/REPORT_...md を必ず設定
- **Unity固有の検証手順**:
  - Unity Editor上での動作確認は、実際にUnity Editorを起動して確認すること
  - Unity Test Runnerでのテスト実行結果を記録すること
  - コンパイルエラーはUnity EditorのConsoleで確認すること
- **Unity API使用時の注意点**:
  - ScriptableObject、AssetDatabase等のUnity APIを使用する場合は、適切なエラーハンドリングを実装すること
  - EditorOnlyコードは `#if UNITY_EDITOR` で適切に分離すること
