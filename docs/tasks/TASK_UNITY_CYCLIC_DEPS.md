# Task: Unity アセンブリ循環依存の解決

Status: BLOCKED
Tier: 2
Branch: main
Owner: Worker-1
Created: 2025-01-05T00:00:00+09:00
Report: docs/inbox/REPORT_UNITY_CYCLIC_DEPS_20250105.md

## Blocked Reason
Unity プロジェクトへのアクセスが不可能な環境のため、タスクを実行できません。

### 事実
- 現在のワークスペース（`C:\Users\PLANNER007\shared-workflows`）には Unity プロジェクトが存在しません。
- タスクファイルに記載されているパス（`Assets/Scripts/Camera/Vastcore.Camera.asmdef` など）に対応するファイルが見つかりません。
- 親ディレクトリやユーザーのホームディレクトリを探索しましたが、Unity プロジェクトは見つかりませんでした。

### 次手
1. Unity プロジェクトのワークスペースを開く
2. Unity プロジェクトの絶対パスを指定
3. Unity プロジェクトを作成（まだ作成されていない場合）

### 根拠ログ
- `Get-ChildItem -Recurse -Filter "*.asmdef"`: 0件
- `Test-Path "Assets"`: False
- `Get-ChildItem -Path .. -Directory | Where-Object { Test-Path (Join-Path $_.FullName "Assets") }`: 0件

## Objective
- Unity プロジェクトのアセンブリ定義（.asmdef）間で発生している循環依存エラーを解決する
- コンパイルエラーを解消し、プロジェクトをビルド可能な状態にする

## Context

### エラー内容
以下のアセンブリ間で循環依存が検出されています：

```
One or more cyclic dependencies detected between assemblies: 
- Assembly-CSharp-Editor
- Assembly-CSharp
- Assets/Scripts/Camera/Vastcore.Camera.asmdef
- Assets/Editor/StructureGenerator/Vastcore.Editor.StructureGenerator.asmdef
- Assets/Scripts/Editor/Vastcore.Editor.asmdef
- Assets/Scripts/Game/Vastcore.Game.asmdef
- Assets/Scripts/Generation/Vastcore.Generation.asmdef
- Assets/Scripts/Player/Vastcore.Player.asmdef
- Assets/Scripts/Terrain/Vastcore.Terrain.asmdef
- Assets/Scripts/Testing/Vastcore.Testing.asmdef
- Assets/Tests/EditMode/Vastcore.Tests.EditMode.asmdef
- Assets/Scripts/UI/Vastcore.UI.asmdef
```

### 影響範囲
- Unity エディタでのコンパイルが失敗している
- プロジェクトのビルドが不可能な状態

### 解決方針
1. 各アセンブリ定義ファイル（.asmdef）の依存関係を分析
2. 循環依存の原因を特定
3. 依存関係を再設計（共通インターフェースの抽出、依存方向の変更など）
4. アセンブリ定義を修正
5. コンパイルが成功することを確認

## Focus Area
- `Assets/**/*.asmdef` ファイルの分析と修正
- アセンブリ間の依存関係の可視化と再設計
- コンパイルエラーの解消

## Forbidden Area
- 既存のコードロジックの変更（アセンブリ定義の修正のみ）
- テストコードの追加（主要パスの検証のみ実施）
- 新規アセンブリの作成（既存アセンブリの再構成のみ）

## Constraints
- テスト: 主要パスのみ（Unity エディタでのコンパイル成功を確認）
- フォールバック: 新規追加禁止
- 既存のコードロジックは変更しない（アセンブリ定義のみ修正）

## DoD
- [ ] 循環依存の原因を特定し、ドキュメント化している
- [ ] すべてのアセンブリ定義ファイルを修正している
- [ ] Unity エディタでコンパイルエラーが発生しないことを確認している
- [ ] 依存関係の変更内容を `docs/inbox/REPORT_UNITY_CYCLIC_DEPS_*.md` に記録している
- [ ] 本チケットの Report 欄にレポートパスが追記されている

## Notes
- アセンブリ定義の修正は慎重に行う（依存関係の変更は他の部分に影響する可能性がある）
- 修正前後で依存関係の変更内容を明確に記録する
- コンパイルが成功した後、実際の動作確認も実施する（可能な範囲で）

## 参考情報
- Unity アセンブリ定義の公式ドキュメント
- 循環依存の解決パターン（共通インターフェース、依存性逆転など）
