# Worker Prompt�E�新設計！E
> こ�Eドキュメント�E、リファクタリング後�E Worker プロンプトの設計思想と使用方法を説明します、E
## 設計思想

### 1. 状態管琁E��ァイル�E�EISSION_LOG.md�E��E連携

Worker は作業開始時に `.cursor/MISSION_LOG.md` を読み込み、現在のフェーズと進捗を確認します。これにより、Worker が�E身の立ち位置を正確に把握できます、E
**使用方況E**
- 作業開始時に MISSION_LOG.md を読み込み、現在のフェーズと進捗を確誁E- 吁E��ェーズ完亁E��に MISSION_LOG.md を更新
- 作業完亁E��に最終的な進捗を記録

### 2. XMLタグによる構造匁E
Orchestrator と同様に、XMLタグを用ぁE��構造化�Eロンプトに変更しました、E
**主要タグ:**
- `<instruction>`: 基本皁E��役割と目皁E- `<context>`: MISSION_LOG、SSOT参�E、前提条件、墁E��定義
- `<workflow>`: フェーズ別の詳細な手頁E- `<stop_conditions>`: 停止条件の明示
- `<stop_output>`: 停止時�E忁E��アウト�EチE��
- `<output_format>`: 納品レポ�Eト�EフォーマッチE- `<self_correction>`: 自己修正のルール

### 3. 動的パス確認�E徹庁E
ファイルパスはハ�Eドコードせず、存在確認してから参�Eするように変更しました、E
**実裁E��E**
- `Test-Path <TICKET_PATH>` また�E `ls <TICKET_PATH>` で存在確誁E- Focus Area の存在確誁E- 存在しなぁE��合�E停止条件として扱ぁE
### 4. フェーズ別の明確な進捗管琁E
吁E��ェーズで MISSION_LOG.md を更新し、E��捗を記録します、E
## フェーズ構�E

### Phase 0: 参�Eと整傁E- `.cursor/MISSION_LOG.md` を読み込み
- SSOT ファイルの確誁E- チケチE��の確認（存在確認してから�E�E
### Phase 1: 前提の固宁E- Tier / Branch / Report Target の確誁E- GitHubAutoApprove の確誁E- ブランチ�E替�E�忁E��時�E�E
### Phase 2: 墁E��確誁E- Focus Area / Forbidden Area の確誁E- DoD の確誁E
### Phase 3: 実行ルール
- 実行ルールの確誁E- ダブルチェチE��の実施

### Phase 4: 納品 & 検証
- チケチE��めEDONE に更新
- レポ�Eト作�Eと検証
- `docs/HANDOVER.md` の更新
- Git コミッチEプッシュ

### Phase 5: チャチE��出劁E- 完亁E��また�EブロチE��ー継続時の1行報呁E
## 停止条件

以下�E条件に該当する場合�E、作業を停止し、忁E��アウト�EチE��を残しまぁE

- Forbidden Area に触れなぁE��解決できなぁE- 仕様仮定が3件以丁E- SSOT が取得できなぁE/ `ensure-ssot.js` でも解決不可
- 依存追加 / 外部通信�E�Eetch/pull/push 等）が忁E��で GitHubAutoApprove=true が未確誁E- 破壊的・復旧困難操作！Eebase/reset/force push 等）が忁E��E- 数刁E��上�E征E��が忁E��、また�Eタイムアウト趁E��が見込まれる

## 停止時�E忁E��アウト�EチE��

1. チケチE��めEIN_PROGRESS/BLOCKED のまま更新�E�事宁E/ 根拠ログ要点 / 次扁E1-3 件 / Report パスを忁E��追記！E2. `docs/inbox/` に未完亁E��ポ�Eトを作�E
3. 変更は commit する�E�Eush は GitHubAutoApprove=true の場合�Eみ�E�E4. チャチE�� 1 行で報呁E5. MISSION_LOG.md を更新�E�停止琁E��と次手を記録�E�E
## 納品レポ�EトフォーマッチE
```
# Report: <タスク吁E

**Timestamp**: <ISO8601>  
**Actor**: Worker  
**Ticket**: <TICKET_PATH>  
**Type**: Worker  
**Duration**: <所要時閁E  
**Changes**: <変更量要紁E

## Changes
- <file>: <詳細変更冁E��>

## Decisions
- <decision>: <琁E��>

## Verification
- <command>: <result>

## Risk
- <潜在リスク>

## Remaining
- なぁE/ <残件>

## Blocked�E�Etate: BLOCKED の場合！E- Reason / Evidence / Options�E�E、E�E�E
## Handover
- Orchestrator への申し送り

## Proposals�E�任意！E- 拁E��外で気づぁE��改喁E���E次回タスク候裁E```

## 使用方況E
1. **Worker 起動時:**
   - Orchestrator が生成しぁEWorker プロンプトを貼り付けめE   - プロンプトには MISSION_LOG.md の最新状態が含まれてぁE��

2. **作業開始時:**
   - `.cursor/MISSION_LOG.md` を読み込み、現在のフェーズと進捗を確誁E
3. **吁E��ェーズ完亁E��:**
   - MISSION_LOG.md を更新

4. **作業完亁E��:**
   - 最終的な進捗を MISSION_LOG.md に記録

## 注意事頁E
- ファイルパスは **動的に確誁E* すること�E�Els`, `find`, `Test-Path` 等を使用�E�。ハードコード禁止、E- エラーが発生した場合�E、MISSION_LOG.md に記録し、復旧手頁E��試行する、E- 3回試行しても解決しなぁE��合�Eみ、状況と試行�E容を整琁E��てユーザーに判断を仰ぐ、E- MISSION_LOG.md は常に最新状態を保つこと。各フェーズ完亁E��に忁E��更新する、E
