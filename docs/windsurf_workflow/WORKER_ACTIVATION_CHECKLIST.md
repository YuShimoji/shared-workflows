# Worker Activation Checklist

最終更新: 2025-12-23  
更新老E Cascade

目皁E Orchestrator が「準備作業の整合取り」に滞留して Worker を起動できなぁE��態（準備ループ）を防ぐ、E
原則: **起動を止める琁E��は最小化する�E�Etop the loop�E�、E*

- 大半�E整合崩れ！Eandover/Inbox/Archiveの不一致、Reportの整琁E��E��等）�E Worker タスクとして刁E��出して進められる、E- **本当に危険な状態だけを NO-GO とする、E*

---

## 1. GO / NO-GO 判定（最小！E
- GO�E�起動してよい�E�E
  - チケチE���E�Edocs/tasks/TASK_*.md`�E�が存在し、Focus/Forbidden/DoD が定義されてぁE��
  - Worker に渡す最小�Eロンプト�E�侁E `docs/inbox/WORKER_PROMPT_TASK_*.md`�E�が作�Eできる

- NO-GO�E�起動を止める�E�E
  - Git 競合がある�E�Enmerged paths / conflict markers�E�E  - 持E��したチケチE��ファイルが存在しなぁE��E--ticket` 持E��時�E�E  - 持E��しぁEWorker Prompt が存在しなぁE��E--worker-prompt` 持E��時�E�E
上記以外�E、基本皁E�� WARNING として扱ぁE��起動を止めなぁE��E
---

## 2. ループブレーカー�E�忁E��運用�E�E
準備作業が次のぁE��れかに当てはまる場合、以降�E「整合取りを続ける」�EではなぁE**Worker タスクへ刁E��出して前進する**、E
- 同じ確認！Eandover/Inbox/Archive照吁E等）を 2 回以上繰り返しぁE- 15 刁E��上、チケチE��発衁EWorker 起動に到達できてぁE��ぁE
対忁E

1. 既存チケチE��めE`IN_PROGRESS` のまま保つ�E�EONE にしなぁE��E2. 「準備タスク」を Tier 1 の別チケチE��として発行する（侁E `TASK_XXX_prep_cleanup.md`�E�E3. Worker は prep チケチE��を�E琁E��る（�E果�E Report + チケチE��更新 + commit�E�E4. Orchestrator は「prep が終わる�Eを征E��」ではなく、次の Worker 起動に進む

---

## 3. 推奨コマンド！Eコマンド判定！E
Worker 起動�E直前に次を実行し、�E力に従う、E
- Submodule 利用晁E
  - `node .shared-workflows/scripts/worker-activation-check.js --ticket docs/tasks/TASK_XXX.md --worker-prompt docs/inbox/WORKER_PROMPT_TASK_XXX.md`

- Submodule 無し（�Eロジェクトに scripts/ がコピ�EされてぁE��場合！E
  - `node scripts/worker-activation-check.js --ticket docs/tasks/TASK_XXX.md --worker-prompt docs/inbox/WORKER_PROMPT_TASK_XXX.md`

---

## 4. 出力�E解釁E
- `GO`:
  - Worker を起動する（準備は Worker タスクに含めてよい�E�E
- `NO-GO`:
  - Blocker を解消すめE  - 解消が重い場合�E、Blocker 解消�E体をチケチE��化して Worker に割り当てめE
