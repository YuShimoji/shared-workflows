# 進捗機能実装計画書

**作成日**: 2026-01-05  
**対象**: shared-workflows 中央リポジトリ  
**ステータス**: 設計完了・実装準備中

---

## 実装済み機能

### ✅ 改善提案機能の明確化
- **実装内容**: 
  - `templates/ORCHESTRATOR_REPORT_TEMPLATE.md` の改善提案セクションを拡張
  - プロジェクト側とShared Workflow側を明示的に分離
  - Workerプロンプトにプロジェクト側改善提案の指示を追加
- **変更ファイル**:
  - `templates/ORCHESTRATOR_REPORT_TEMPLATE.md`
  - `prompts/orchestrator/modules/P6_report.md`
  - `prompts/every_time/WORKER_COMPLETION_DRIVER.txt`

### ✅ 次のアクション選択肢の柔軟化
- **実装内容**:
  - `templates/ORCHESTRATOR_REPORT_TEMPLATE.md` の次のアクションセクションを拡張
  - 推奨度ランク付け（⭐⭐⭐/⭐⭐/⭐）を追加
  - タスク連携情報を追加
  - `scripts/generate-action-choices.js` を新規作成
- **変更ファイル**:
  - `templates/ORCHESTRATOR_REPORT_TEMPLATE.md`
  - `docs/windsurf_workflow/EVERY_SESSION.md`
  - `scripts/generate-action-choices.js`（新規）

---

## 実装予定機能（中優先度）

### 📋 進捗ダッシュボード機能

**目的**: アイデアと実装度合いを対照できる視覚的な表を提供

**実装内容**:
1. `scripts/progress-dashboard.js` を新規作成
   - `docs/tasks/` からタスク情報を読み込み
   - `docs/HANDOVER.md` から進捗情報を読み込み
   - `AI_CONTEXT.md` の Backlog セクションからバックログを読み込み
   - Markdown形式のテーブルを生成

2. `docs/PROGRESS_DASHBOARD.md` を自動生成
   - アイデア/機能、優先度、状態、進捗、担当の列を持つテーブル
   - バックログと実装済みタスクを対照

**出力例**:
```markdown
# プロジェクト進捗ダッシュボード

**最終更新**: 2026-01-05T12:00:00+09:00

## 全体サマリ
- 完了タスク: 8/10
- 進行中: 1
- 未着手: 1
- 全体進捗: 80%

## 進捗一覧

| アイデア/機能 | 優先度 | 状態 | 進捗 | 担当 | タスクID |
|------------|--------|------|------|------|----------|
| Gemini API実装 | High | 設計済み | 30% | - | - |
| YouTube API連携 | Medium | 準備完了 | 50% | - | - |
| Git status代替手段 | Low | 実装済み | 100% | Worker | TASK_012 |
```

**使用方法**:
```bash
node scripts/progress-dashboard.js [--project-root <path>] [--output <path>]
```

**実装見積もり**: 2-3時間

---

### 📋 テスト分離ドキュメント機能

**目的**: 手動テストと自動テストを分離し、ユーザー向けのステップバイステップ手順を提供

**実装内容**:
1. `templates/TEST_MANUAL_TEMPLATE.md` を新規作成
   - 手動テスト手順のテンプレート
   - 確認コスト（所要時間）の記載欄

2. `scripts/generate-test-steps.js` を新規作成
   - Workerレポートの `## Verification` セクションを解析
   - 手動テストと自動テストを分離
   - 手動テスト手順をステップバイステップで抽出
   - 確認コストを各ステップに記載

**出力例**:
```markdown
# 手動テスト手順（ユーザー実行）

## 概要
- 対象タスク: TASK_012
- 推定所要時間: 10分
- 実行者: ユーザー

## ステップ1: 環境確認（所要時間: 2分）
1. `node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-bootstrap` を実行
2. ERROR が無いことを確認
3. 期待される結果: `✓ All checks passed`

## ステップ2: 機能確認（所要時間: 5分）
1. [具体的な操作手順]
2. [期待される結果]

## 自動テスト結果（AI実行済み）
- `report-validator.js`: ✅ PASS
- `sw-doctor.js`: ✅ PASS
```

**使用方法**:
```bash
node scripts/generate-test-steps.js <REPORT_PATH> [--output <path>]
```

**実装見積もり**: 2-3時間

---

## 実装予定機能（低優先度）

### 📋 視覚的進捗表示機能

**目的**: コマンドラインでの記号を用いた装飾・メーターを提供

**実装内容**:
1. `scripts/progress-meter.js` を新規作成
   - `docs/tasks/` から進捗を集計
   - Unicode記号を使用したプログレスバーを生成
   - 優先度別の進捗表示

**出力例**:
```bash
$ node scripts/progress-meter.js

📊 プロジェクト進捗
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
全体進捗: ████████████████░░░░ 80%
完了タスク: 8/10
進行中: 1
未着手: 1

🎯 優先度別進捗
High:   ████████████████████ 100% (2/2)
Medium: ████████████░░░░░░░░  60% (3/5)
Low:    ██████░░░░░░░░░░░░░░  30% (1/3)

📈 最近の完了タスク
- TASK_012: Git status代替手段 (2026-01-05)
- TASK_011: レポート検証自動化 (2026-01-05)
- TASK_010: Workerプロンプトテンプレート更新 (2026-01-05)
```

**使用方法**:
```bash
node scripts/progress-meter.js [--project-root <path>] [--format <text|json>]
```

**実装見積もり**: 1-2時間

---

## 実装スケジュール

### Phase 1: 高優先度機能（完了）
- ✅ 改善提案機能の明確化
- ✅ 次のアクション選択肢の柔軟化

### Phase 2: 中優先度機能（実装予定）
- 📋 進捗ダッシュボード機能
- 📋 テスト分離ドキュメント機能

### Phase 3: 低優先度機能（実装予定）
- 📋 視覚的進捗表示機能

---

## 検証方法

### 進捗ダッシュボード
```bash
# 実行
node scripts/progress-dashboard.js

# 確認
cat docs/PROGRESS_DASHBOARD.md
```

### テスト分離
```bash
# 実行
node scripts/generate-test-steps.js docs/inbox/REPORT_TASK_012_*.md

# 確認
# 生成された手動テスト手順が正しく抽出されているか確認
```

### 視覚的進捗表示
```bash
# 実行
node scripts/progress-meter.js

# 確認
# プログレスバーが正しく表示されているか確認
```

---

## 注意事項

1. **後方互換性**: 既存のワークフローを破壊しないよう、新機能はオプションとして実装
2. **エラーハンドリング**: ファイルが存在しない場合やパースエラーの場合、適切なエラーメッセージを表示
3. **パフォーマンス**: 大量のタスクがある場合でも、スクリプトが高速に動作するよう最適化
4. **ドキュメント**: 各スクリプトにはJSDoc形式のコメントを追加

---

## 次のステップ

1. 本計画書をレビューし、実装方針を決定
2. Phase 2（中優先度機能）の実装開始
3. 実装後、動作確認とユーザーフィードバック収集
4. 必要に応じて改善を繰り返す
