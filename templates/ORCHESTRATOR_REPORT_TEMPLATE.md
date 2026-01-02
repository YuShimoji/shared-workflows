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
- **ユーザー返信テンプレ（必須）**:
  - 【確認】完了判定: 完了 / 未完了
  - 【次に私（ユーザー）が返す内容】以下から1つ選んで返信します:
    - 1) 「選択肢1を実行して」: <選択肢1>
    - 2) 「選択肢2を実行して」: <選択肢2>
    - 3) 「選択肢3を実行して」: <選択肢3>

## ガイド
- <作業の中項目（HANDOVER更新 / Inbox整理 / Worker再投入 / Git反映 など）>

## メタプロンプト再投入条件
- <次にDriverを再投入する条件（例: Worker納品回収後 / 新規タスク起票後 / ブロッカー発生時）>

## 改善提案（New Feature Proposal）
- <最低1件。優先度（High/Medium/Low）と理由を明記>

## Verification
- <実行したコマンドと結果（例: report-validator.js=OK）>
- <git status -sb がクリーンであること（または Git リポジトリではない旨）>
- <push 済み/未push（pending）の明記>

## Integration Notes
- <docs/HANDOVER.md / docs/tasks/ / docs/reports/ への反映要約>
