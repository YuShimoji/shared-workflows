# Phase 4: チケット発行

## 目的
Worker 用のタスクチケットを発行する。

## 手順
1. `docs/tasks/` に `TASK_XXX_*.md` を作成し、Status: OPEN で登録
2. DoD をチェックリストで定義（調査が必要な項目は Worker に委譲することを明記）
3. MISSION_LOG.md を更新（Phase 4 完了を記録）

## チケットに必ず含める項目
- Tier / Branch
- Focus Area / Forbidden Area
- Constraints / DoD
- 停止条件
- **Test Plan**（必須）:
  - テスト対象（どのクラス/機能をテストするか）
  - テスト種別（EditMode / PlayMode / ビルド / Unit / E2E）
  - 期待結果（何をもってテスト成功とするか）
  - テスト不要の場合はその理由を明記
- **Milestone**（必須）: このタスクが属する短期/中期目標（SG-X / MG-X）

## 完了条件
- チケットが発行されている
- DoD が定義されている
- **Test Plan が含まれている**
- **Milestone 紐付けが明記されている**

## 次フェーズ
P5（Worker起動用プロンプト生成）

