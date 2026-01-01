# Orchestrator Prompt（新設計）

> このドキュメントは、リファクタリング後の Orchestrator プロンプトの設計思想と使用方法を説明します。

## 設計思想

### 1. 状態管理ファイル（MISSION_LOG.md）の導入

従来のワークフローでは、AIが長い作業中に自身の立ち位置を見失う問題がありました。これを解決するため、`.cursor/MISSION_LOG.md` という状態管理ファイルを導入しました。

**特徴:**
- Orchestrator と Worker が共通で参照・更新する
- 現在のフェーズ、進捗、タスク一覧、コンテキスト情報を一元管理
- 各フェーズ完了時に必ず更新し、常に最新状態を保つ

**使用方法:**
- 作業開始時に MISSION_LOG.md を読み込み、現在のフェーズと進捗を確認
- 各フェーズ完了時に MISSION_LOG.md を更新
- Worker 起動時には、MISSION_LOG.md の最新状態を Worker プロンプトに含める

### 2. XMLタグによる構造化

自然言語のダラダラとした指示ではなく、`<instruction>`, `<context>`, `<workflow>`, `<output_format>` などのXMLタグを用いた、機械可読性の高いプロンプトへ書き換えました。

**利点:**
- AIが指示を正確に解析できる
- 構造が明確で、必要な情報を素早く見つけられる
- プロンプトの保守性が向上

**主要タグ:**
- `<instruction>`: 基本的な役割と目的
- `<context>`: 参照ファイル、前提条件、MISSION_LOG の説明
- `<workflow>`: フェーズ別の詳細な手順
- `<output_format>`: 出力形式の指定
- `<self_correction>`: 自己修正のルール

### 3. 動的パス確認の徹底

ファイルパスはハードコードせず、「`ls` や `find` で現状の構造を確認してからパスを特定せよ」という動的な指示に変更しました。

**実装例:**
- `Test-Path .shared-workflows` または `ls -d .shared-workflows` で存在確認
- 存在確認してから参照する
- 存在しない場合は代替パスを試す

### 4. Multi-Thread 模倣

複数のタスク（ファイル作成、リファクタリング、テスト）を並行してリストアップし、順次消化するロジックを組みました。

**実装:**
- Phase 3: 分割と戦略で、並列化可能性を判断
- 独立作業が可能なら Worker 数を決定（最大3）
- 依存が強いなら単一 Worker
- MISSION_LOG.md にタスク分割結果と Worker 割り当てを記録

### 5. 改善提案（New Feature Proposal）セクション

ワークフローの最後に「改善提案」セクションを設け、AIが能動的にコードベースの改善を提案する仕組みを追加しました。

**実装:**
- Phase 6 の Orchestrator Report に「改善提案」セクションを追加
- 提案は優先度（High/Medium/Low）と理由を明記
- MISSION_LOG.md の「改善提案」セクションにも記録

## フェーズ構成

### Phase -1: Bootstrap（初回/環境未整備のみ）
- `.shared-workflows/` の有無を確認
- プロジェクト側の状態管理ファイル/ディレクトリを用意
- `.cursor/MISSION_LOG.md` を作成

### Phase 0: SSOT確認
- `.cursor/MISSION_LOG.md` を読み込み
- SSOT ファイルの確認と補完
- 参照ファイルの確認（存在確認してから参照）

### Phase 1: Sync & Merge
- `git fetch origin`
- `docs/inbox/` のレポート回収と `docs/HANDOVER.md` への統合

### Phase 1.5: 巡回監査
- `docs/tasks/`, `docs/inbox/`, `docs/HANDOVER.md` の整合性確認
- 異常検知時の是正実施

### Phase 1.75: Complete Gate（完了判定ゲート）
- 全ての完了条件を満たすまで Phase 2/6 に進まない

### Phase 2: 状況把握
- `docs/HANDOVER.md` の読み込み
- `docs/tasks/` の OPEN/IN_PROGRESS チケット列挙
- `todo_list` の更新

### Phase 3: 分割と戦略（Multi-Thread 模倣）
- タスクを Tier 1/2/3 で分類
- 並列化可能性を判断
- 各 Worker の Focus Area / Forbidden Area を決定

### Phase 4: チケット発行
- `docs/tasks/` に `TASK_XXX_*.md` を作成
- DoD をチェックリストで定義

### Phase 5: Worker起動用プロンプト生成
- 各チケットごとに Worker プロンプトを生成
- MISSION_LOG.md の最新状態を含める

### Phase 6: Orchestrator Report
- チャット出力（固定5セクション）
- レポート保存と検証
- **改善提案セクションを追加**

## 使用方法

1. **初回セットアップ時:**
   - `prompts/first_time/PROJECT_KICKSTART.txt` を貼り付ける

2. **毎回の Orchestrator 起動時:**
   - `prompts/every_time/ORCHESTRATOR_DRIVER.txt` を貼り付ける（**毎回これだけ**）

3. **MISSION_LOG.md の確認:**
   - 作業開始時に `.cursor/MISSION_LOG.md` を読み込む
   - 各フェーズ完了時に更新する

## 注意事項

- ファイルパスは **動的に確認** すること（`ls`, `find`, `Test-Path` 等を使用）。ハードコード禁止。
- エラーが発生した場合は、MISSION_LOG.md に記録し、復旧手順を試行する。
- 3回試行しても解決しない場合のみ、状況と試行内容を整理してユーザーに判断を仰ぐ。
- MISSION_LOG.md は常に最新状態を保つこと。各フェーズ完了時に必ず更新する。

