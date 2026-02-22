# Orchestrator Report Template

**Timestamp**: <ISO8601>
**Actor**: Cascade
**Issue/PR**: <関連Issue/PR>
**Mode**: <mode>
**Type**: Orchestrator
**Duration**: <例: 2.0h>
**Changes**: <主要変更点（要約）>

## 概要
- <概要（目的/達成状況/主要インパクト）>

## 現状
- <現状詳細（アクティブチケット・進行タスク・リスク）>

## 次のアクション
- <次に実施するアクション（担当/優先度）>

**ユーザー返信テンプレ（必須）**:
- 【確認】完了判定: 完了 / 未完了
- 【次に私（ユーザー）が返す内容】以下から1つ選んで返信します:

### 推奨アクション
1) <アイコン> ⭐⭐⭐ 「選択肢1を実行して」: [<タスク種類>] <選択肢1> - <理由・影響>
2) <アイコン> ⭐⭐ 「選択肢2を実行して」: [<タスク種類>] <選択肢2> - <理由・影響>

### その他の選択肢
3) <アイコン> ⭐ 「選択肢3を実行して」: [<タスク種類>] <選択肢3> - <理由・影響>
<追加の選択肢がある場合は4, 5...と続ける>

**アイコン一覧**: 🎨 UI, 🧪 テスト, 🚫 ブロッカー, 🐛 バグ修正, ✨ 機能実装, 📝 ドキュメント, 🔧 リファクタリング, ⚙️ CI/CD, 📋 その他

### 現在積み上がっているタスクとの連携
- 選択肢1を実行すると、<TASK_ID>（優先度: High/Medium/Low）の<前提条件/並行作業/依存関係>が整います
- 選択肢2を実行すると、<TASK_ID>（優先度: High/Medium/Low）と並行して進められます

## ガイド
- <作業の中項目（HANDOVER更新 / Inbox整理 / Worker再投入 / Git反映 など）>

## メタプロンプト再投入条件
- <次にDriverを再投入する条件（例: Worker納品回収後 / 新規タスク起票後 / ブロッカー発生時）>

## 改善提案（New Feature Proposal）

### プロジェクト側（<PROJECT_NAME>）
- 優先度: High/Medium/Low - <提案内容> - <状態（設計済み/準備完了/未着手など）>
- 優先度: High/Medium/Low - <提案内容> - <状態>

### Shared Workflow側（.shared-workflows submodule）
- 優先度: High/Medium/Low - <提案内容> - <状態>
- 優先度: High/Medium/Low - <提案内容> - <状態>

**注記**: プロジェクト側の改善提案は、プロジェクト固有の機能改善や要件を対象とします。Shared Workflow側の改善提案は、共通ワークフローやツールの改善を対象とします。

## Verification
- <実行したコマンドと結果（例: report-validator.js=OK）>
- <git status -sb がクリーンであること（または Git リポジトリではない旨）>
- <push 済み/未push（pending）の明記>
- <MCP_CONNECTIVITY=AVAILABLE/UNAVAILABLE>
- <Verification Mode=AUTO_VERIFIED/PARTIALLY_COMPLETED/MANUAL_PENDING>
- <Manual Pending Items=なし/項目一覧>
- <完了不適合時の差し戻し理由（証跡不足/MCP未接続/手動未実施）>

## Integration Notes
- <docs/HANDOVER.md / docs/tasks/ / docs/reports/ への反映要約>
