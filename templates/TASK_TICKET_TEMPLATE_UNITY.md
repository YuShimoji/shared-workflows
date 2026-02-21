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
- `.shared-workflows/` 配下（submodule）
- `ProjectSettings/`, `Packages/`（必要が出たら必ず相談）
- 既存の大規模リファクタ（ファイル移動/削除を伴う変更）

## Target Assemblies

- <変更対象の asmdef 名を列挙する（例: Vastcore.Terrain, Vastcore.Generation）>
- 参照: `docs/02_design/ASSEMBLY_ARCHITECTURE.md`

## Constraints

- テスト: 主要パスのみ（網羅テストは後続タスクへ分離）
- フォールバック: 新規追加禁止
- **アセンブリ境界の制約**:
  - 変更対象アセンブリは上記 Target Assemblies に限定する
  - asmdef 参照の追加/変更時は ASSEMBLY_ARCHITECTURE.md を同時更新する
  - 同名型の重複定義を作らない（型追加前に `rg "class TypeName"` で確認）
  - 依存方向は DAG に従う（下位→上位のみ。逆方向禁止）
- **Unity固有の制約**:
  - Unity Editor上での手動検証が必要な場合、具体的な検証手順を明記する
  - Unity Test Runnerでのテスト実行が必要な場合、テストクラスとテストメソッドを明記する
  - `Assets/` 構造への制約（ProjectSettings/Packages変更禁止等）を明記する
  - EditorOnlyコード（`#if UNITY_EDITOR`）の適切な分離を考慮する
  - C# 9.0 制約: 引数なし struct コンストラクタ、global using 等は使用禁止
  - 条件コンパイル: `#if` の外にオプショナルシンボル参照を漏らさない
  - ScriptableObject、AssetDatabase等のUnity API使用時の注意点を明記する
  - **Namespace**: `shared-workflows/data/unity_namespace_map.md` を参照し、フォルダ→namespace→asmdef の対応を厳守する。新規フォルダ追加時は対応表を先に更新する
- **データ分離（`templates/DESIGN_PRINCIPLES.md` 参照）**:
  - テキストは ScriptableObject or Localization Table に外部化
  - パラメータは ScriptableObject に外部化
  - ハードコードされた文字列・数値がないことをDoDで確認
- 

## Test Plan
- **Test Phase**: <Slice / Stable / Hardening>
- **テスト対象**: （どの public API をテストするか）
- **EditMode テスト**: （Slice: 推奨1-2本 / Stable以降: 必須。テストクラス名を明記。契約テストとして public API の振る舞いのみ検証）
- **PlayMode テスト**: （Slice: 推奨スモーク1本 / Stable以降: 必須。テストクラス名を明記）
- **ビルド検証**: （全 Phase 必須。target platform でエラーなし）
- **期待結果**: （observable な振る舞いで記述。実装詳細に依存しないこと）
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
- [ ] **コンパイルエラーがない**（Unity Editorで確認: `Unity Editor=コンパイル成功`）
- [ ] **アセンブリ整合性チェック**:
  - [ ] 追加した using ごとに asmdef 参照が存在することを確認
  - [ ] 同名型の重複がないことを確認（`rg "class TypeName"` で検索）
  - [ ] asmdef を変更した場合 ASSEMBLY_ARCHITECTURE.md を更新済み
- [ ] **Unity Editor上での動作確認が完了している**（Unity Editorを起動し、実際に動作を確認した結果を記録）
- [ ] **EditModeテスト全通過**（テスト実行結果を記録: `<テストクラス名>=<成功/失敗>`, `<テスト数>=<成功数>/<総数>`）
- [ ] **PlayModeテスト全通過**（テスト実行結果を記録）
- [ ] **Test Phase に応じたテスト通過**（Slice: ビルド成功+スモーク / Stable: EditMode+PlayMode全通過 / Hardening: 全テスト+エッジケース通過。テスト実行結果を記録: `<テストクラス名>=<成功/失敗>`, `<テスト数>=<成功数>/<総数>`）
- [ ] **ビルド成功**（Unity Editorで確認: `Unity Editor=コンパイル成功`）
- [ ] **Namespace 整合**: 変更/追加した全 .cs ファイルの namespace が `shared-workflows/data/unity_namespace_map.md` と一致
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
