# Worker Prompt（新設計）

> このドキュメントは、リファクタリング後の Worker プロンプトの設計思想と使用方法を説明します。

## 設計思想

### 1. 状態管理ファイル（MISSION_LOG.md）の連携

Worker は作業開始時に `.cursor/MISSION_LOG.md` を読み込み、現在のフェーズと進捗を確認します。これにより、Worker が自身の立ち位置を正確に把握できます。

**使用方法:**
- 作業開始時に MISSION_LOG.md を読み込み、現在のフェーズと進捗を確認
- 各フェーズ完了時に MISSION_LOG.md を更新
- 作業完了時に最終的な進捗を記録

### 2. XMLタグによる構造化

Orchestrator と同様に、XMLタグを用いた構造化プロンプトに変更しました。

**主要タグ:**
- `<instruction>`: 基本的な役割と目的
- `<context>`: MISSION_LOG、SSOT参照、前提条件、境界定義
- `<workflow>`: フェーズ別の詳細な手順
- `<stop_conditions>`: 停止条件の明示
- `<stop_output>`: 停止時の必須アウトプット
- `<output_format>`: 納品レポートのフォーマット
- `<self_correction>`: 自己修正のルール

### 3. 動的パス確認の徹底

ファイルパスはハードコードせず、存在確認してから参照するように変更しました。

**実装例:**
- `Test-Path <TICKET_PATH>` または `ls <TICKET_PATH>` で存在確認
- Focus Area の存在確認
- 存在しない場合は停止条件として扱う

### 4. フェーズ別の明確な進捗管理

各フェーズで MISSION_LOG.md を更新し、進捗を記録します。

## フェーズ構成

### Phase 0: 参照と整備
- `.cursor/MISSION_LOG.md` を読み込み
- SSOT ファイルの確認
- チケットの確認（存在確認してから）

### Phase 1: 前提の固定
- Tier / Branch / Report Target の確認
- GitHubAutoApprove の確認
- ブランチ切替（必要時）

### Phase 2: 境界確認
- Focus Area / Forbidden Area の確認
- DoD の確認

### Phase 3: 実行ルール
- 実行ルールの確認
- ダブルチェックの実施

### Phase 4: 納品 & 検証
- チケットを DONE に更新
- レポート作成と検証
- `docs/HANDOVER.md` の更新
- Git コミット/プッシュ

### Phase 5: チャット出力
- 完了時またはブロッカー継続時の1行報告

## 停止条件

以下の条件に該当する場合は、作業を停止し、必須アウトプットを残します:

- Forbidden Area に触れないと解決できない
- 仕様仮定が3件以上
- SSOT が取得できない / `ensure-ssot.js` でも解決不可
- 依存追加 / 外部通信（fetch/pull/push 等）が必要で GitHubAutoApprove=true が未確認
- 破壊的・復旧困難操作（rebase/reset/force push 等）が必要
- 数分以上の待機が必須、またはタイムアウト超過が見込まれる

## 停止時の必須アウトプット

1. チケットを IN_PROGRESS/BLOCKED のまま更新（事実 / 根拠ログ要点 / 次手 1-3 件 / Report パスを必ず追記）
2. `docs/inbox/` に未完了レポートを作成
3. 変更は commit する（push は GitHubAutoApprove=true の場合のみ）
4. チャット 1 行で報告
5. MISSION_LOG.md を更新（停止理由と次手を記録）

## 納品レポートフォーマット

```
# Report: <タスク名>

**Timestamp**: <ISO8601>  
**Actor**: Worker  
**Ticket**: <TICKET_PATH>  
**Type**: Worker  
**Duration**: <所要時間>  
**Changes**: <変更量要約>

## Changes
- <file>: <詳細変更内容>

## Decisions
- <decision>: <理由>

## Verification
- <command>: <result>

## Risk
- <潜在リスク>

## Remaining
- なし / <残件>

## Blocked（State: BLOCKED の場合）
- Reason / Evidence / Options（1〜3）

## Handover
- Orchestrator への申し送り

## Proposals（任意）
- 担当外で気づいた改善案・次回タスク候補
```

## 使用方法

1. **Worker 起動時:**
   - Orchestrator が生成した Worker プロンプトを貼り付ける
   - プロンプトには MISSION_LOG.md の最新状態が含まれている

2. **作業開始時:**
   - `.cursor/MISSION_LOG.md` を読み込み、現在のフェーズと進捗を確認

3. **各フェーズ完了時:**
   - MISSION_LOG.md を更新

4. **作業完了時:**
   - 最終的な進捗を MISSION_LOG.md に記録

## 注意事項

- ファイルパスは **動的に確認** すること（`ls`, `find`, `Test-Path` 等を使用）。ハードコード禁止。
- エラーが発生した場合は、MISSION_LOG.md に記録し、復旧手順を試行する。
- 3回試行しても解決しない場合のみ、状況と試行内容を整理してユーザーに判断を仰ぐ。
- MISSION_LOG.md は常に最新状態を保つこと。各フェーズ完了時に必ず更新する。

