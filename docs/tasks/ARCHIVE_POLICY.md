# タスク・レポート アーカイブポリシー

## docs/tasks/

- Status: DONE のタスクは **30日間** `docs/tasks/` に保持する。
- 30日経過後、Orchestrator が `docs/tasks/archive/` に移動する（手動 or 自動スクリプト）。
- アーカイブ後もチケット番号（TASK_XXX）は再利用しない。

## docs/reports/

- 全レポートは `docs/reports/` に永続保管する（削除しない）。
- `docs/inbox/` のレポートは Orchestrator が Phase 1 で `docs/reports/` にアーカイブし、HANDOVER に統合後削除する。

## Deprecated ファイル

以下のファイルは互換ラッパーとして残存。新規参照は禁止。

| ファイル | 代替先 | 削除予定 |
|---------|--------|---------|
| `prompts/every_time/ORCHESTRATOR_METAPROMPT.txt` | `ORCHESTRATOR_DRIVER.txt` | 次回メジャー更新時 |
| `prompts/every_time/ORCHESTRATOR_RESUME.txt` | `ORCHESTRATOR_DRIVER.txt` | 次回メジャー更新時 |
| `docs/Windsurf_AI_Collab_Rules_v1.1.md` | `docs/Windsurf_AI_Collab_Rules_latest.md` | 参照がゼロになった時点 |
| `docs/Windsurf_AI_Collab_Rules_v2.0.md` | `docs/Windsurf_AI_Collab_Rules_latest.md` | 参照がゼロになった時点 |
