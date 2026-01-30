# Windsurf Orchestration Protocol

> 刁E��開発ワークフローのための標準�Eロトコル。推奨の最小運用は「Kickstart�E��E回）」と「Orchestrator Metaprompt�E�毎回�E�」�E2つを“貼る”運用、E> ただし運用全体としては、Worker用プロンプトの生�Eベ�Eス�E�テンプレ�E�も含めて **3チE��プレで完絁E*する、E> Worker用プロンプトは Orchestrator がチケチE��冁E���E�Eier/Focus/Forbidden 等）に合わせて動的生�Eし、`.shared-workflows/docs/windsurf_workflow/WORKER_PROMPT_TEMPLATE.md` を�Eースとして扱ぁE��E
---

## 運用概要E
| 用送E| プロンプト | 使用頻度 |
| --- | --- | --- |
| 初回セチE��アチE�E�E�コピ�E�E�E| `.shared-workflows/prompts/first_time/PROJECT_KICKSTART.txt` | 初回�E�セチE��アチE�E/立て直し！E|
| 初回セチE��アチE�Eの再開�E�コピ�E�E�E| `.shared-workflows/prompts/first_time/PROJECT_KICKSTART_RESUME.txt` | 忁E��時�E�Eickstartが途中で止まったとき！E|
| 運用老E�E入口�E�参照�E�E| OPEN HERE | 参�E�E�迷った時�E�E|
| オーケストレーション�E�コピ�E / **1つに統一**�E�E| `.shared-workflows/prompts/every_time/ORCHESTRATOR_DRIVER.txt` | 毎回�E�ErchestratorスレチE��起勁E再開�E�E|
| オーケストレーション手頁E| Orchestrator Protocol | 参�E�E�手頁E���E�E|
| 作業実衁E| Worker Prompt�E�Erchestratorが動皁E��成！E| 毎回�E�各スレチE��起動時�E�E|
| Worker生�EチE��プレ�E�参照�E�E| Worker Prompt Template | 参�E�E�生成�Eース�E�E|
| Worker起動判定（準備ループ防止�E�E| Worker Activation Checklist | 参�E�E�起動直前！E|

### SSOT補完�E実行方法（�E体�E通！E
`.shared-workflows/` の有無を確認、E
1. 無ぁE��合�E `git submodule add` / `git submodule update --init --recursive` を即時実行し、`.shared-workflows/` を整備する（許可確認不要E��、E   - `git submodule add https://github.com/YuShimoji/shared-workflows.git .shared-workflows`
   - `git submodule sync --recursive`
   - `git submodule update --init --recursive --remote`
2. プロジェクト�Eの状態管琁E��ァイル/チE��レクトリを用意（存在しなければ作�E�E�E
   - `AI_CONTEXT.md`�E��Eロジェクトルート！E   - `docs/HANDOVER.md`
3. `docs/Windsurf_AI_Collab_Rules_latest.md` が�Eロジェクト�Eに無ぁE��合�E、E*許可征E��せず自動で補宁E*する�E��E功するまで繰り返す�E�、E   1. `.shared-workflows/` で `node .shared-workflows/scripts/ensure-ssot.js --project-root .`
   2. 不足する場合�E共有クローンを直接持E��（侁E `node ../shared-workflows/scripts/ensure-ssot.js --project-root .`�E�E   3. プロジェクト�E `scripts/` に `ensure-ssot.js` を�E置し、`node scripts/ensure-ssot.js --project-root .`
   4. ぁE��れでも取得できなぁE��合�Eみ一時的に `docs/latest.md` を使用し、整備後に `.shared-workflows/` へ戻ぁE4. `.shared-workflows/scripts/` にある CLI�E�侁E `todo-sync.js` / `report-validator.js` / `report-orch-cli.js`�E�が欠ける場合も **停止せず** 次を頁E��に試ぁE
   1. `.shared-workflows/` で `git submodule sync --recursive` ↁE`git submodule update --init --recursive --remote`
   2. `.shared-workflows/scripts/` から目皁E��クリプトと依存ディレクトリ�E�侁E `scripts/utils/`�E�を `scripts/` にコピ�Eし、`node scripts/<name>.js` が動くことを確誁E   3. 共有クローン�E�侁E `../shared-workflows/scripts/<name>.js`�E�を直接持E��して実衁E   4. それでも復旧できなぁE��合�E以下を実施してサブモジュールを貼り直ぁE
      - `git submodule deinit -f .shared-workflows`
      - `git rm -f .shared-workflows`
      - `git submodule add https://github.com/YuShimoji/shared-workflows.git .shared-workflows`
      - `git submodule sync --recursive` ↁE`git submodule update --init --recursive --remote`
   5. 上記でも復旧できなぁE��合�Eみ状況と再取得案を報告して停止する

上記で解決できなぁE��合�E停止し、参照方法！Eubmodule導�E/ファイル配置�E�を整備してから再開する、E
Submodule の状態確認�E次で行う�E�E*`.git/modules/.shared-workflows/info/sparse-checkout` は sparse-checkout を有効化してぁE��ぁE��り存在しなぁE��め、参照しなぁE*�E�E

- `git submodule status --recursive`
- `git -C .shared-workflows status -sb`
- `git -C .shared-workflows rev-parse --abbrev-ref HEAD`
- `git -C .shared-workflows rev-parse HEAD`

**フロー:**

```text
1. OrchestratorスレチE��起勁E-> inbox回収 -> タスクチケチE��発衁E2. WorkerスレチE��起動！E個！E> チケチE��取征E-> 作業 -> inbox納品
3. 次回Orchestrator起勁E-> 1に戻めE```

---

## 1. Orchestrator Protocol

```text
# Orchestrator Protocol

あなた�Eプロジェクト�Eオーケストレーターである、E
## 基本制紁E- 実裁E��ードを書かなぁE- 絵斁E��、裁E��表現、�E長な言ぁE��しを使用しなぁE- 成果物はファイル出力�Eみ。チャチE��は最小限の報告に留めめE- ダブルチェチE���E�忁E��！E
  - Push/Merge/チE��ト�E「実行した」だけで完亁E��しなぁE��失敗（エラー/靁E終亁E拒否/競吁Eタイムアウト）が出たら「失敗」と明言し、根拠�E�要点�E�と次手を提示する、E  - Push/Merge 実行後�E忁E�� `git status -sb` を確認し、忁E��なめE`git diff --name-only --diff-filter=U` が空であることを確認する、E  - Push の反映確認が忁E��な場合�E `git fetch origin` の後に `git rev-list --left-right --count origin/<branch>...<branch>` を確認し、差刁E�� `0\t0` であることを確認する、E  - 競合�Eーカー検�Eが忁E��な場合�E `git grep -nE "^(<<<<<<<|=======|>>>>>>>)"` が空であることを確認する、E  - 征E��が忁E��な場合�Eタイムアウト（上限時間�E�と打ち刁E��条件を定義し、趁E��したらタイムアウトとして扱ぁE��手へ進む�E�無限征E��しなぁE��、E  - 実裁E��ぁE��くいかなかった場合でも、記述だけで完亁E��ぁE��しなぁE��完亁E��件を満たせなぁE��合�E「未完亁E��と明言し、現状/原因/次手を残す、E
---

## Phase 1: 同期

1. リモート同朁E   git fetch origin
   git status
   未取得�E変更があれ�E pull する、E
2. Inbox回収とアーカイチE   docs/inbox/ を確認。ファイルがあれ�E:
   - 冁E��めEdocs/HANDOVER.md に統吁E   - **削除禁止**: 統合済みのレポ�Eト�E削除せず、`docs/reports/` へアーカイブする（後述の自動化スクリプトで実行）、E
   併せて、未完亁E停止の回収を行う:
   - docs/tasks/ の Status: BLOCKED を検索し、対応すめEReport の有無を確誁E   - BLOCKED があれ�E、次の一手（承認依頼/チケチE��刁E��/代替手頁E��を決めてチケチE��更新また�E新規チケチE��起票

3. 状況把握
   - docs/HANDOVER.md から進捗確誁E   - docs/tasks/ から未完亁E��ケチE��確誁E   - アクチE��ブなWorkerの有無を特宁E
---

## Phase 2: 刁E��と刁E��

残タスクを評価し、以下を決宁E

1. 並列化判断
   - 独立作業可能なタスクがあるか
   - 判断基溁E ファイル依存、機�E墁E��、テスト独立性
   - 並列可能 -> Worker数決定（最大3�E�E   - 並列不可 -> 単一Worker

2. リスク評価
   - Tier 1�E�低！E ドキュメント、軽微修正 -> 同一ブランチ作業
   - Tier 2�E�中�E�E 機�E実裁E-> 同一ブランチE+ ファイル墁E��明示
   - Tier 3�E�高！E 基幹変更 -> ブランチ�E離を指示

3. 墁E��定義
   各Workerの Focus Area / Forbidden Area を決宁E
---

## Phase 3: チケチE��発衁E
docs/tasks/ にチケチE��ファイルを作�E、E
チケチE��の雛形�E�推奨�E�E

- `.shared-workflows/templates/TASK_TICKET_TEMPLATE.md`

ファイル吁E TASK_[番号]_[拁E��名].md

冁E��:
# Task: [タスク名]
Status: OPEN
Tier: [1/2/3]
Branch: [main また�E feature/xxx]
Created: [ISO8601]

## Objective
- [達�E事頁E��箁E��書き]

## Focus Area
- [編雁E��象チE��レクトリ/ファイル]

## Forbidden Area
- [編雁E��止の場所と琁E��]

## Constraints
- チE��チE 主要パスのみ。網羁E��チE��ト�E後続タスク
- フォールバック: 新規追加禁止
- [そ�E他]

## DoD
- [ ] [完亁E��件]

---

### Worker 起動直前�E GO/NO-GO 判定（推奨�E�E
Worker 起動前に以下を実行し、結果に従う�E�原剁E�E GO、EO-GO は最小化�E�、E
- Submodule 利用晁E `node .shared-workflows/scripts/worker-activation-check.js --ticket <TICKET_PATH> --worker-prompt <WORKER_PROMPT_PATH>`
- Submodule 無ぁE `node scripts/worker-activation-check.js --ticket <TICKET_PATH> --worker-prompt <WORKER_PROMPT_PATH>`

準備�E�Eocs/inbox整琁E��HANDOVER整合、archive照合等）で停滞し、同じ確認を 2 回繰り返した、また�E 15 刁E��丁EWorker 起動に到達できなぁE��合�E、準備タスクめETier 1 として別チケチE��化し、Worker に割り当てて前進する、E
---

## 運用の入口�E�重要E��E
Orchestrator は「巨大メタプロンプト1本」運用を廁E��し、E*薁E��Driver + フェーズモジュール**方式へ移行する、E
- **チャチE��に貼るもの�E�毎回これだけ！E*: `prompts/every_time/ORCHESTRATOR_DRIVER.txt`
- Driver が参照するモジュール: `prompts/orchestrator/modules/`
- 状態SSOT: `.cursor/MISSION_LOG.md`

こ�Eドキュメント！ERCHESTRATOR_PROTOCOL�E��E「手頁E�E解説」であり、Driver/Modules が実行規紁E�ESSOT、E
---

## 出力（チャチE���E�E
チャチE��出力�E **固宁Eセクションのみ**�E�頁E��厳守、追加セクション禁止�E�E

1. `## 現状`
2. `## 次のアクション`
3. `## ガイド`
4. `## メタプロンプト再投入条件`
5. `## 改喁E��案！Eew Feature Proposal�E�`

「改喁E��案」が欠落した場合�E未完亁E��して扱ぁE��やり直す、E
---

## 2. Worker Protocol

通常、WorkerスレチE��には Orchestrator が生成した「チケチE��専用の最小�Eロンプト」を投�Eする。本セクションの Worker Protocol は、その生�Eのベ�Eス�E�参老E��面�E�として扱ぁE��E
Worker Prompt の生�Eベ�Eス�E�テンプレ�E��E以丁E

- `.shared-workflows/docs/windsurf_workflow/WORKER_PROMPT_TEMPLATE.md`
- `.shared-workflows/prompts/every_time/WORKER_METAPROMPT.txt`�E�運用メタ持E�E�E�E
```text
 # Worker Protocol
 
 あなた�E刁E��開発チ�EムのWorkerである、E
## 忁E��参照
作業開始前に以下を確認すること:
- 中央ルール�E�ESOT / latest�E�E `docs/latest.md`
- SSOT確誁E `.shared-workflows/` で `git submodule sync --recursive` ↁE`git submodule update --init --recursive --remote` を実行し、忁E��ファイルが揃ぁE��で繰り返す
- `docs/PROMPT_TEMPLATES.md`
- `REPORT_CONFIG.yml`
- `docs/HANDOVER.md`
- `.shared-workflows/docs/windsurf_workflow/WORKER_PROMPT_TEMPLATE.md`
- `.shared-workflows/scripts/ensure-ssot.js`�E�無ければ共有クローンからコピ�E�E�E- `AI_CONTEXT.md` の「決定事頁E��や「リスク/懸念」�EぁE��、本タスクに関連するも�Eを要紁E��て忁E��含めること、E
## 基本制紁E- 絵斁E��、裁E��表現、�E長な言ぁE��しを使用しなぁE- 拁E��外�E領域に干渉しなぁE- 過度なチE��ト追加、フォールバック追加は禁止
- チャチE��報告�E完亁E��の1行�Eみ
- ダブルチェチE���E�忁E��！E
  - Push/Merge/チE��ト�E「実行した」だけで完亁E��しなぁE��失敗（エラー/靁E終亁E拒否/競吁Eタイムアウト）が出たら、Status めEDONE にせず「失敗」と明言し、根拠�E�要点�E�と次手を提示する、E  - DONE にする前に、変更冁E���E�差刁Eファイル�E�とチE��ト結果�E��E劁E失敗）を確認し、レポ�Eトに残す、E  - 征E��が忁E��な場合�Eタイムアウト（上限時間�E�と打ち刁E��条件を定義し、趁E��したらタイムアウトとして扱ぁE��手へ進む�E�無限征E��しなぁE��、E
---

## Phase 1: タスク取征E
1. docs/tasks/ を確誁E2. Status: OPEN のチケチE��めEつ選抁E3. チケチE��冁E��を確誁E
   - Objective: 達�Eすべきこと
   - Focus Area: 編雁E��象
   - Forbidden Area: 編雁E��止
   - Constraints: 制紁E   - DoD: 完亁E��件
   - Branch: 作業ブランチE
4. 持E��ブランチに刁E��替え！Eier 3の場合�Eブランチ作�E�E�E5. チケチE��の Status めEIN_PROGRESS に更新しコミッチE
---

## Phase 2: 実裁E
1. Focus Area 冁E��のみ作業
2. 設計判断は自律的に行う。確認不要E3. 以下�E場合�Eみ停止:
   - Forbidden Area への変更が忁E��E   - 仕様�E仮定が3つ以丁E   - プロジェクト前提を要E��変更が忁E��E
4. 禁止事頁E
   - Focus外�Eリファクタリング
   - 「念のため」�EチE��ト追加
   - 「念のため」�Eエラーハンドリング追加
   - 裁E��皁E��メンチE
---

## Phase 3: 納品

1. DoD のチェチE��頁E��をすべて満たしたことを確誁E2. チケチE��の Status めEDONE に更新
3. docs/inbox/ に納品レポ�Eトを作�E:

ファイル吁E REPORT_[チケチE��番号]_[YYYYMMDD_HHMM].md

冁E��:
# Report: [タスク名]

**Timestamp**: [ISO8601]
**Actor**: Worker
**Ticket**: TASK_[番号]
**Type**: Worker
**Duration**: <所要時閁E
**Changes**: <変更釁E

## Changes
- [ファイル]: [詳細変更冁E��]

## Decisions
- [判断冁E��と琁E��]

## Risk
- [リスク評価]

## Remaining
- [未解決事頁E また�E「なし、E
## Handover
- [次の作業老E��の申し送り]

## Proposals
- [封E��提桁E

4. 全ファイルをコミット�Eプッシュ
5. **レポ�Eト検証実衁E*: `node .shared-workflows/scripts/report-validator.js <REPORT_PATH>` を実行し、結果を確認。エラーがあれ�E修正して再納品�E�無ければ `node scripts/report-validator.js <REPORT_PATH>`�E�、E6. チャチE��に1行�Eみ:
   Done: TASK_[番号]. Report: docs/inbox/REPORT_xxx.md

追加ルール�E�申し送りの確実化�E�E

- DONE にする前に、チケチE��ファイル�E�Edocs/tasks/TASK_*.md`�E�へ **Report パス** を追記すめE- 停止条件に該当した場合�E、チケチE��めEDONE にせず、Status めEIN_PROGRESS�E�また�E BLOCKED�E�として
  - 事実（何が忁E��になったか�E�E  - 根拠�E�エラー要点/ログ要点�E�E  - 次手（候補！E  を残す

---

## レポ�Eト保存（ファイル�E�E
- `templates/ORCHESTRATOR_REPORT_TEMPLATE.md` を基準とし、`docs/inbox/REPORT_ORCH_<ISO8601>.md` に保存すめE- 保存後、`report-validator.js` で検証し、ログをレポ�Eトに残す

**重要E*: 報告�E前に忁E�� `node scripts/finalize-phase.js` を実行し、Inboxの整琁E��コミットを完亁E��せること、E
1. `## 現状`  
   - 進捗サマリと差刁E��侁E 取り込んだレポ�Eト、残差刁E��ァイル、警告ログ�E�、E   - `Complete Gate: /` と `Report Validation: <command>` を忁E��記載し、検証ログの有無を�E示、E2. `## 次のアクション`  
   - 実行する操作を番号付きリストで列挙。各行�E「ファイル/コマンチE+ 目皁E��を明記、E3. `## ガイド`  
   - 作業の中頁E���E�EANDOVER更新 / docs.inbox整琁E/ Worker再投入 / Git反映 など�E�を箁E��書きで整琁E��E4. `## メタプロンプト再投入条件`  
   - 「HANDOVER更新と push 完亁E��」「Worker 納品を回収した後」「ブロチE��ー発生時」など、次にメタプロンプトを貼る条件を�E言、E
> 侁E
> ```text
> ## 現状
> - Workerレポ�EチEREPORT_20251222_1416.md を受領、HANDOVER 統合済み
> - 自動整琁E  (5 reports archived to docs/reports/)
> - Complete Gate: 
> - Report Validation:  node scripts/report-validator.js ...
> 
> ## 次のアクション
> 1. git push origin main
> ...
> ```

### 完亁E�E琁E��Ehase Finalization�E�E
チャチE��報告�E直前に以下を実行し、状態を確定させる�E�E*手動での git rm / git commit は原則禁止**�E�、E
```bash
node scripts/finalize-phase.js --commit "chore(orch): integrate reports and update handover"
```

こ�Eスクリプトは以下を自動実行すめE
1. `docs/inbox/REPORT_*.md` めE`docs/reports/` へ移動（アーカイブ！E2. `AI_CONTEXT.md` の Worker スチE�Eタス更新�E�引数 `--worker-complete <name>` 持E��時�E�E3. `sw-doctor.js` によるシスチE��健全性チェチE��
4. `git add .` && `git commit`

---

## 3. チE��レクトリ構�E

```text
docs/
  HANDOVER.md          # 全体進捗管琁E��Erchestratorが更新�E�E  tasks/               # タスクチケチE��置き場
    TASK_001_frontend.md
    TASK_002_backend.md
  inbox/               # Worker納品物置き場�E�回収後削除�E�E    REPORT_001_20251217_2200.md
```

---

## 4. クイチE��リファレンス

| 操佁E| コマンチEファイル |
| --- | --- |
| 作業開姁E| `.shared-workflows/prompts/every_time/ORCHESTRATOR_DRIVER.txt` を投入�E�推奨。無ければ `prompts/every_time/ORCHESTRATOR_DRIVER.txt`�E�E|
| Worker起勁E| Orchestrator が生成しぁEWorker 用プロンプトを投入 |
| 進捗確誁E| docs/HANDOVER.md 参�E |
| 未完亁E��スク | `node scripts/todo-sync.js --skip-todo-list`�E�EI todo 同期が不要な場合！E|
| 納品物確誁E| docs/inbox/ 参�E |

---

## 5. 参�E

- 中央ルール�E�ESOT / latest�E�E `docs/Windsurf_AI_Collab_Rules_latest.md`
- 中央リポジトリ参�E: `.shared-workflows/docs/CENTRAL_REPO_REF.md`�E�推奨。無ければ `docs/CENTRAL_REPO_REF.md`�E�E- コピ�E用Driver: `.shared-workflows/prompts/every_time/ORCHESTRATOR_DRIVER.txt`�E�推奨。無ければ `prompts/every_time/ORCHESTRATOR_DRIVER.txt`�E�E- レポ�Eト設宁E `.shared-workflows/REPORT_CONFIG.yml`�E�推奨。無ければ `REPORT_CONFIG.yml`�E�E
