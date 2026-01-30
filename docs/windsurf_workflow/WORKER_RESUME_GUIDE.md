# Worker再開ガイチE
## 状況判断

Workerが停止した場合、以下�E2つの方法で再開できます！E
### 方況E: WORKER_COMPLETION_DRIVER.txt を使用�E�推奨�E�E
**適用条件**:
- 作業は進んでぁE��が、DoDの達�E確認が不十刁E- レポ�Eト�E作�EされてぁE��が、検証が完亁E��てぁE��ぁE- タスクのStatus更新は完亁E��てぁE��が、DoDチェチE��リストが未検証

**手頁E*:

1. **実際のプロジェクトで、停止したタスクの状態を確誁E*:
   ```powershell
   # WritingPageプロジェクトで実衁E   cd "C:\Users\thank\Storage\Media Contents Projects\WritingPage"
   
   # タスクファイルを確誁E   Get-Content docs/tasks/TASK_005_missing_reports.md
   
   # レポ�Eトファイルを確誁E   Get-ChildItem docs/inbox/REPORT_TASK_005*.md
   
   # HANDOVER.mdを確誁E   Get-Content docs/HANDOVER.md | Select-Object -First 50
   ```

2. **変数を埋めたWORKER_COMPLETION_DRIVER.txtを生戁E*:
   
   以下�EチE��プレートを使用し、実際の値に置き換えます！E   
   ```text
   あなた�E刁E��開発チ�Eムの Worker です、EoD / Report / チE��トを未完�Eまま残さず、以下�E残タスクを完亁E��せてください、E   
   ## Phase 0: 状況E   - Ticket: docs/tasks/TASK_005_missing_reports.md
   - Branch: main
   - Focus Area: docs/tasks/, docs/inbox/, docs/reports/, docs/HANDOVER.md
   - Forbidden Area: .shared-workflows/ の直接変更、破壊的Git操佁E   - Pending Items: 
     - DoD吁E��E��の実際の達�E確認！Eit history調査、原因刁E��、予防策実裁E��E     - 環墁E��存�Eタスク�E�EitリポジトリではなぁE��墁E���E適刁E��処琁E     - report-validator.jsの正しい実行と結果記録
   - Report Target: docs/inbox/REPORT_TASK_005_missing_reports_20250101.md�E�既存レポ�Eトを更新�E�E   - HANDOVER Sections: Latest Orchestrator Report, 進捁E バックログ
   
   ## Phase 1: ミッション
   1. docs/tasks/TASK_005_missing_reports.md を最新化！Etatus / Report パス / 事実追記！E   2. DoD めE1 頁E��ずつ検証し、差刁Eor チE��ト結果の根拠を残す
      - 特に「git history から欠損レポ�Eトを特定」につぁE��は、環墁E��存で実行不可能な場合�E代替手段を記録
      - 各DoD頁E��に対して、実際に実施した冁E��を�E体的に記録�E�「確認済み」などの表面皁E��記述は禁止�E�E   3. docs/inbox/REPORT_TASK_005_missing_reports_20250101.md を更新し、`report-validator.js` の実行結果を記録
   4. 忁E��テストを実行し、`<cmd>=<result>` 形式で残す
   5. docs/HANDOVER.md の Latest Orchestrator Report, 進捁E バックログ を更新
   6. `git status -sb` をクリーンにし、忁E��なめEcommit / push�E�Eush は GitHubAutoApprove=true の場合�Eみ自律実行！E   
   ## Phase 2: 停止条件�E�該当時は即報告！E   - Forbidden Area に触れなぁE�� DoD を満たせなぁE   - 仕様仮定が3件以上忁E��E   - 依存追加 / 外部通信 / 破壊的操佁E/ 長時間征E��が忁E��E   - SSOT めE��ンプレぁEobtain できなぁE��Eensure-ssot.js` でも不可�E�E   
   ## Phase 3: 忁E��アウト�EチE��
   - Report パス
   - 実行テストログ�E�E<cmd>=<result>`�E�E   - DoD 吁E��E��の允E��状況E��各頁E��に対して、実際に実施した冁E��を�E体的に記録�E�E   - `git status -sb` の結果�E�差刁E��残る場合�E琁E��と次手！E   
   ## Phase 4: チャチE��1衁E   - Done: `Done: docs/tasks/TASK_005_missing_reports.md. Report: docs/inbox/REPORT_TASK_005_missing_reports_20250101.md. Tests: <cmd>=<result>.`
   - Blocked: `Blocked: docs/tasks/TASK_005_missing_reports.md. Reason: <要点>. Next: <候裁E. Report: docs/inbox/REPORT_TASK_005_missing_reports_20250101.md.`
   ```

3. **WorkerスレチE��に貼り付けて実衁E*

### 方況E: 新しいWorkerプロンプトを貼り直ぁE
**適用条件**:
- 作業が�Eく進んでぁE��ぁE- レポ�Eトが作�EされてぁE��ぁE- タスクのStatus更新も完亁E��てぁE��ぁE- 最初からやり直したぁE
**手頁E*:

1. **WORKER_METAPROMPT.txtを読み込む**:
   ```powershell
   # shared-workflows-1リポジトリで実衁E   Get-Content prompts/every_time/WORKER_METAPROMPT.txt
   ```

2. **Orchestratorが生成したWorkerプロンプトを確誁E*:
   ```powershell
   # WritingPageプロジェクトで実衁E   Get-Content docs/inbox/WORKER_PROMPT_TASK_005_missing_reports.md
   ```

3. **WorkerスレチE��に貼り付けて実衁E*:
   - まぁE`WORKER_METAPROMPT.txt` を貼り付けめE   - 次に `docs/inbox/WORKER_PROMPT_TASK_005_missing_reports.md` の冁E��を貼り付けめE
## 推奨判断基溁E
| 状況E| 推奨方況E|
|------|---------|
| レポ�Eト�E作�EされてぁE��が、DoD検証が不十刁E| **方況E: WORKER_COMPLETION_DRIVER.txt** |
| タスクのStatus更新は完亁E��てぁE��が、DoDチェチE��リストが未検証 | **方況E: WORKER_COMPLETION_DRIVER.txt** |
| 作業が�Eく進んでぁE��ぁE| **方況E: 新しいWorkerプロンプト** |
| レポ�Eトが作�EされてぁE��ぁE| **方況E: 新しいWorkerプロンプト** |

## 注意事頁E
1. **環墁E��存�Eタスクの扱ぁE*:
   - gitリポジトリではなぁE��墁E��、git history調査が忁E��なDoD頁E��がある場吁E   - 停止条件として扱ぁE��、代替手段を取るかを判断する
   - 判断結果と琁E��をレポ�Eトに記録する

2. **DoDの達�E確誁E*:
   - 各DoD頁E��に対して、実際に実施した冁E��を�E体的に記録する
   - 「確認済み」などの表面皁E��記述は禁止
   - 環墁E��存で実行不可能な頁E��がある場合�E停止条件を�E確匁E
3. **report-validator.jsの実衁E*:
   - 正しい引数頁E��実行する！Enode .shared-workflows/scripts/report-validator.js <REPORT_PATH> --profile <PROFILE> <CONFIG_PATH>`�E�E   - 実行結果をレポ�Eトに記録する

4. **PowerShell構文エラーの回避**:
   - コマンド実行前に、`Get-Command <cmd>` で存在確誁E   - 褁E��な条件刁E���E、スクリプトファイルに刁E��する

