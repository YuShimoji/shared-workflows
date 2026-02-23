# Phase 2: 状況把握

## 目的
現在の目標/進捗/ブロッカー/バックログを把握する。

## 手順
1. `docs/HANDOVER.md` を読み、目標/進捗/ブロッカー/バックログを抽出
2. `docs/tasks/` を確認し、OPEN/IN_PROGRESS を列挙
3. `node scripts/todo-sync.js` を実行
4. `docs/WORKFLOW_STATE_SSOT.md` を読み、空/薄い場合は先に更新する（新規タスク提案より優先）
5. **マイルストーン確認**: `docs/MILESTONE_PLAN.md` を読み、現在の短期/中期/長期目標を確認する。未作成なら `templates/MILESTONE_PLAN.md` から作成する。
6. **目標アライメント**: 現在のOPEN/IN_PROGRESSタスクがどのマイルストーンに属するか確認する。属さないタスクがあれば、優先度を再检討する。
7. **振り返り判定**: 5タスク以上完了している場合、またはマイルストーン達成時に、KPT振り返りを実施し MILESTONE_PLAN.md に追記する。
8. MISSION_LOG.md を更新（Phase 2 完了を記録）

## 完了条件
- 現在のタスク状況が把握できている
- MISSION_LOG.md に進捗が記録されている
- **マイルストーンが確認/更新されている**

## 次フェーズ
- OPEN/IN_PROGRESS タスクがある場合: **P2.5（発散思考）**
- 全タスク完了の場合: P6（Orchestrator Report）
