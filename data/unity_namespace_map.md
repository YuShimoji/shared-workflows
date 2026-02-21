# Unity Namespace Map（SSOT）

本ファイルは GlitchWorker プロジェクトのフォルダ → 名前空間 → Assembly Definition の対応表。
Worker が新規ファイルを作成する際、**必ずこの表を参照して namespace を決定する**。

## ルール
1. **フォルダパスから namespace を決定**: `Assets/_Project/Scripts/{Domain}/` → `GlitchWorker.{Domain}`
2. **サブフォルダは namespace をドットで拡張**: `Scripts/{Domain}/{Sub}/` → `GlitchWorker.{Domain}.{Sub}`
3. **Data サブフォルダは親 namespace を使う**: `Scripts/{Domain}/Data/` → `GlitchWorker.{Domain}`（Data は namespace に含めない）
4. **テストは専用 namespace**: `Tests/EditMode/` → `GlitchWorker.Tests.EditMode`, `Tests/PlayMode/` → `GlitchWorker.Tests.PlayMode`
5. **新規 Domain 追加時**: この表に行を追加してから実装する（表にない namespace は使用禁止）

## 対応表

| Folder Path | Namespace | Assembly (asmdef) | asmdef References |
|-------------|-----------|-------------------|-------------------|
| `Assets/_Project/Scripts/Camera/` | `GlitchWorker.Camera` | `GlitchWorker.Runtime` | Unity.InputSystem, URP |
| `Assets/_Project/Scripts/Player/` | `GlitchWorker.Player` | `GlitchWorker.Runtime` | Unity.InputSystem, URP |
| `Assets/_Project/Scripts/Player/States/` | `GlitchWorker.Player.States` | `GlitchWorker.Runtime` | (same) |
| `Assets/_Project/Scripts/Player/Data/` | `GlitchWorker.Player` | `GlitchWorker.Runtime` | (same) |
| `Assets/_Project/Scripts/Drone/` | `GlitchWorker.Drone` | `GlitchWorker.Runtime` | Unity.InputSystem, URP |
| `Assets/_Project/Scripts/Props/` | `GlitchWorker.Props` | `GlitchWorker.Runtime` | Unity.InputSystem, URP |
| `Assets/_Project/Scripts/Gimmicks/` | `GlitchWorker.Gimmicks` | `GlitchWorker.Runtime` | Unity.InputSystem, URP |
| `Assets/_Project/Scripts/Systems/` | `GlitchWorker.Systems` | `GlitchWorker.Runtime` | Unity.InputSystem, URP |
| `Assets/Tests/EditMode/` | `GlitchWorker.Tests.EditMode` | `Tests.EditMode` | GlitchWorker.Runtime, TestRunner |
| `Assets/Tests/PlayMode/` | `GlitchWorker.Tests.PlayMode` | `Tests.PlayMode` | GlitchWorker.Runtime, TestRunner |

## asmdef 詳細

### GlitchWorker.Runtime (`Assets/_Project/Scripts/GlitchWorker.Runtime.asmdef`)
- rootNamespace: `GlitchWorker`
- references: `Unity.InputSystem`, `Unity.RenderPipelines.Core.Runtime`, `Unity.RenderPipelines.Universal.Runtime`

### Tests.EditMode (`Assets/Tests/EditMode/EditMode.asmdef`)
- rootNamespace: `GlitchWorker.Tests.EditMode`
- references: `GlitchWorker.Runtime`, `UnityEngine.TestRunner`, `UnityEditor.TestRunner`
- includePlatforms: `Editor`
- defineConstraints: `UNITY_INCLUDE_TESTS`

### Tests.PlayMode (`Assets/Tests/PlayMode/PlayMode.asmdef`)
- rootNamespace: `GlitchWorker.Tests.PlayMode`
- references: `GlitchWorker.Runtime`, `UnityEngine.TestRunner`, `UnityEditor.TestRunner`
- defineConstraints: `UNITY_INCLUDE_TESTS`

## よくあるエラーと対策

| エラー | 原因 | 対策 |
|--------|------|------|
| `CS0246: type or namespace not found` | using ディレクティブの namespace が間違い | 上の対応表を確認し、正しい namespace を使用する |
| `Assembly 'X' not found` | asmdef の references に追加忘れ | テストの asmdef に `GlitchWorker.Runtime` があるか確認 |
| `namespace already contains a definition` | 同名クラスが別フォルダに存在 | フォルダ→namespace 対応を確認し、正しい場所に配置する |
| `inconsistent accessibility` | public class が internal namespace にある | namespace がフォルダに対応しているか確認 |
| `The type exists in both assemblies` | 複数の asmdef が同じファイルを含んでいる | .asmdef のフォルダスコープが重複していないか確認 |
