# Orchestrator Prompt�E�新設計！E
> こ�Eドキュメント�E、リファクタリング後�E Orchestrator プロンプトの設計思想と使用方法を説明します、E
## 設計思想

### 1. 状態管琁E��ァイル�E�EISSION_LOG.md�E��E導�E

従来のワークフローでは、AIが長ぁE��業中に自身の立ち位置を見失ぁE��題がありました。これを解決するため、`.cursor/MISSION_LOG.md` とぁE��状態管琁E��ァイルを導�Eしました、E
**特徴:**
- Orchestrator と Worker が�E通で参�E・更新する
- 現在のフェーズ、E��捗、タスク一覧、コンチE��スト情報を一允E��琁E- 吁E��ェーズ完亁E��に忁E��更新し、常に最新状態を保つ

**使用方況E**
- 作業開始時に MISSION_LOG.md を読み込み、現在のフェーズと進捗を確誁E- 吁E��ェーズ完亁E��に MISSION_LOG.md を更新
- Worker 起動時には、MISSION_LOG.md の最新状態を Worker プロンプトに含める

### 2. XMLタグによる構造匁E
自然言語�Eダラダラとした持E��ではなく、`<instruction>`, `<context>`, `<workflow>`, `<output_format>` などのXMLタグを用ぁE��、機械可読性の高いプロンプトへ書き換えました、E
**利点:**
- AIが指示を正確に解析できる
- 構造が�E確で、忁E��な惁E��を素早く見つけられる
- プロンプトの保守性が向丁E
**主要タグ:**
- `<instruction>`: 基本皁E��役割と目皁E- `<context>`: 参�Eファイル、前提条件、MISSION_LOG の説昁E- `<workflow>`: フェーズ別の詳細な手頁E- `<output_format>`: 出力形式�E持E��E- `<self_correction>`: 自己修正のルール

### 3. 動的パス確認�E徹庁E
ファイルパスはハ�Eドコードせず、「`ls` めE`find` で現状の構造を確認してからパスを特定せよ」とぁE��動的な持E��に変更しました、E
**実裁E��E**
- `Test-Path .shared-workflows` また�E `ls -d .shared-workflows` で存在確誁E- 存在確認してから参�Eする
- 存在しなぁE��合�E代替パスを試ぁE
### 4. Multi-Thread 模倣

褁E��のタスク�E�ファイル作�E、リファクタリング、テスト）を並行してリストアチE�Eし、E��E��消化するロジチE��を絁E��ました、E
**実裁E**
- Phase 3: 刁E��と戦略で、並列化可能性を判断
- 独立作業が可能なめEWorker 数を決定（最大3�E�E- 依存が強ぁE��ら単一 Worker
- MISSION_LOG.md にタスク刁E��結果と Worker 割り当てを記録

### 5. 改喁E��案！Eew Feature Proposal�E�セクション

ワークフローの最後に「改喁E��案」セクションを設け、AIが�E動的にコード�Eースの改喁E��提案する仕絁E��を追加しました、E
**実裁E**
- Phase 6 の Orchestrator Report に「改喁E��案」セクションを追加
- 提案�E優先度�E�Eigh/Medium/Low�E�と琁E��を�E訁E- MISSION_LOG.md の「改喁E��案」セクションにも記録

## フェーズ構�E

### Phase -1: Bootstrap�E��E囁E環墁E��整備�Eみ�E�E- `.shared-workflows/` の有無を確誁E- プロジェクト�Eの状態管琁E��ァイル/チE��レクトリを用愁E- `.cursor/MISSION_LOG.md` を作�E

### Phase 0: SSOT確誁E- `.cursor/MISSION_LOG.md` を読み込み
- SSOT ファイルの確認と補宁E- 参�Eファイルの確認（存在確認してから参�E�E�E
### Phase 1: Sync & Merge
- `git fetch origin`
- `docs/inbox/` のレポ�Eト回収と `docs/HANDOVER.md` への統吁E
### Phase 1.5: 巡回監査
- `docs/tasks/`, `docs/inbox/`, `docs/HANDOVER.md` の整合性確誁E- 異常検知時�E是正実施

### Phase 1.75: Complete Gate�E�完亁E��定ゲート！E- 全ての完亁E��件を満たすまで Phase 2/6 に進まなぁE
### Phase 2: 状況把握
- `docs/HANDOVER.md` の読み込み
- `docs/tasks/` の OPEN/IN_PROGRESS チケチE��列挙
- `todo_list` の更新

### Phase 3: 刁E��と戦略�E�Eulti-Thread 模倣�E�E- タスクめETier 1/2/3 で刁E��E- 並列化可能性を判断
- 吁EWorker の Focus Area / Forbidden Area を決宁E
### Phase 4: チケチE��発衁E- `docs/tasks/` に `TASK_XXX_*.md` を作�E
- DoD をチェチE��リストで定義

### Phase 5: Worker起動用プロンプト生�E
- 吁E��ケチE��ごとに Worker プロンプトを生戁E- MISSION_LOG.md の最新状態を含める

### Phase 6: Orchestrator Report
- チャチE��出力（固宁Eセクション�E�E- レポ�Eト保存と検証
- **改喁E��案セクションを追加**

## 使用方況E
1. **初回セチE��アチE�E晁E**
   - `prompts/first_time/PROJECT_KICKSTART.txt` を貼り付けめE
2. **毎回の Orchestrator 起動時:**
   - `prompts/every_time/ORCHESTRATOR_DRIVER.txt` を貼り付ける！E*毎回これだぁE*�E�E
3. **MISSION_LOG.md の確誁E**
   - 作業開始時に `.cursor/MISSION_LOG.md` を読み込む
   - 吁E��ェーズ完亁E��に更新する

## 注意事頁E
- ファイルパスは **動的に確誁E* すること�E�Els`, `find`, `Test-Path` 等を使用�E�。ハードコード禁止、E- エラーが発生した場合�E、MISSION_LOG.md に記録し、復旧手頁E��試行する、E- 3回試行しても解決しなぁE��合�Eみ、状況と試行�E容を整琁E��てユーザーに判断を仰ぐ、E- MISSION_LOG.md は常に最新状態を保つこと。各フェーズ完亁E��に忁E��更新する、E
