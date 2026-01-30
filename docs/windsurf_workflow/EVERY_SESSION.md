# EVERY_SESSION�E�毎回の運用SSOT / これだけ見れば迷わなぁE��E
目皁E shared-workflows の運用めE**毎回ブレずに**実行する、E 
こ�Eファイルは「運用まとめ」�E **Single Source of Truth (SSOT)**。他ドキュメント�E詳細/背景/補足であり、矛盾した場合�E本ファイルの方針を優先する、E
---

## 0. 入口�E�忁E��ここから�E�E
- **入口�E�運用老E��E*: `docs/windsurf_workflow/OPEN_HERE.md`
- **実運用の詳細�E�手頁E期征E��果�E�E*: `docs/windsurf_workflow/OPERATIONS_RUNBOOK.md`
- **具体シナリオ�E�EritingPage等！E*: `docs/windsurf_workflow/DEMO_SCENARIOS.md`

Submodule 運用�E�推奨�E��E場合�E、上記パスの先頭に `.shared-workflows/` を付けて読む:
- 侁E `.shared-workflows/docs/windsurf_workflow/EVERY_SESSION.md`

---

## 1. 非交渉ルール�E�毎回徹底！E
- **変更は忁E�� commit し、忁E��なめEpush する**�E�作業終亁E��に「push済み/未push」を曖昧にしなぁE��E- **プロジェクトをクリーンに保つ**�E�Egit status -sb` がクリーンであることを確認してから完亁E��名乗る�E�E- **推奨対応で強力に進める**�E�ただし、破壊的/復旧困難操作�E常に停止して合意を取る！E- **作業終亁E��は忁E��**:
  - **完亁E未完亁E*を�E言する
  - **次にユーザーが返すべきテンプレ**を提示する�E�下記、E. 終亁E��チE��プレ」！E
---

## 2. 毎回の実行（最短ルート！E
### Step A: 更新チェチE���E�推奨�E�E
Submodule を使ってぁE��場合！E.shared-workflows/` がある場合！E

- `node .shared-workflows/scripts/sw-update-check.js`

期征E��果:
- `Behind origin/main: 0` なら最新
- `Behind origin/main: N` なら更新が忁E��E��更新してから着手！E
### Step B: 環墁E��断�E�推奨�E�E
- `node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-bootstrap --format text`

期征E��果:
- 重大な ERROR が無ぁE- WARN は「理由が�EかってぁE��許容できる」ものだぁE
### Step C: ルール適用�E�Eursor / 推奨�E�E
- `pwsh -NoProfile -File .shared-workflows/scripts/apply-cursor-rules.ps1 -ProjectRoot .`

期征E��果:
- `.cursorrules` と `.cursor/rules.md` が�E置されめE
### Step D: Orchestrator 起動（毎回これだけ！E
- `.shared-workflows/prompts/every_time/ORCHESTRATOR_DRIVER.txt` をチャチE��に貼めE 
  �E��E開も同じ Driver で良ぁE��E
---

### Step E: 終亁E��チェチE���E�推奨�E�E
- `node .shared-workflows/scripts/session-end-check.js --project-root .`

期征E��果:
- `Result: OK`

補足:
- `--no-fetch` を付けると外部通信�E�Eetch�E�を抑制できる

---

## 2.5 Windsurf 側の推奨ユーザー対応（毎回�E�E
目皁E 「AIが止まっぁE終わった気になめE持E��無視」を、ユーザー側でめE**機械皁E��判宁E*できるようにする、E
- **ユーザーがやること�E�毎回�E�E*:
  - `node .shared-workflows/scripts/sw-update-check.js`
  - `node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-bootstrap --format text`
  - �E�Eursorなら）`pwsh -NoProfile -File .shared-workflows/scripts/apply-cursor-rules.ps1 -ProjectRoot .`
  - チャチE��に `.shared-workflows/prompts/every_time/ORCHESTRATOR_DRIVER.txt` を貼めE
- **期征E��れる結果�E��E功判定！E*:
  - `sw-update-check`: `Behind origin/main: 0`
  - `sw-doctor`: ERROR が無ぁE��EARN は琁E��が�E確�E�E  - Orchestrator のチャチE��出力が **固宁Eセクションのみ**�E�追加セクション無し！E  - `## 次のアクション` に **ユーザー返信チE��プレ�E�完亁E��宁E+ 選択肢1-3�E�E* が含まれる

- **失敗と判断する結果�E�即STOPして再投入/再試行！E*:
  - `Behind origin/main: N (N>0)`�E�Eubmodule更新が忁E��E��E  - `sw-doctor` ぁEERROR を�Eす（環墁E��備�E�E  - Orchestrator が固宁Eセクション以外を出力（侁E 結諁E作業評価�E�E  - `## 次のアクション` にユーザー返信チE��プレが無ぁE��E report-validator でめEERROR になる！E  - `git status -sb` が汚いのに「完亁E��と言ぁE��完亁E��件違反�E�E  - 「停止してぁE��せん」とぁE��返答をしたが、固宁Eセクション形式が不完�E�E��Eロトコル違反�E�E
- **終亁E��の推奨ユーザー返信�E�固定テンプレ�E�E*:
  - 本ファイル、E. 終亁E��チE��プレ」をそ�Eまま使ぁE
---

## 3. “同期が不要な仕絁E��”へ寁E��る方針（散逸対策！E
散逸しやすい惁E���E�運用まとめEルール/手頁EチE��プレ�E�を「手で同期」しなぁE��め、次を原剁E��する:

- **入口は `OPEN_HERE.md` に一本匁E*�E�導線だけを短く保つ�E�E- **運用SSOTは本ファイルに一本匁E*�E�毎回の判断/チE��プレはここ�E�E- **詳細は `OPERATIONS_RUNBOOK.md` に寁E��めE*�E�手頁E�E背景/侁Eトラブルシュート！E- **検査はスクリプトに寁E��めE*�E�Esw-update-check` / `sw-doctor` / `report-validator`�E�E
こ�E方針に反する新規ドキュメント追加は禁止�E�忁E��なら本ファイルぁERunbook を更新する�E�、E
---

## 4. 終亁E��チE��プレ�E�毎回ブレなぁE/ ユーザー返信用�E�E
作業終亁E���E�完亁E��も未完亁E��も）に、忁E��こ�EチE��プレを提示する、E 
チE��プレは **コピ�Eしてそ�Eまま送れめE*ことが要件�E��E容が薄ぁE��合�E「未完亁E��を選ぶ�E�、E
```text
【確認】完亁E��宁E 完亁E/ 未完亁E
【状況】！E-3行！E- ぁE��何が終わってぁE��、何が残ってぁE��ぁE

【次に私E��ユーザー�E�が返す冁E��】以下かめEつ選んで返信しまぁE

### 推奨アクション
1) ⭐⭐⭁E「選択肢1を実行して、E <ここに選択肢1> - <琁E��・影響>
2) ⭐⭁E「選択肢2を実行して、E <ここに選択肢2> - <琁E��・影響>

### そ�E他�E選択肢
3) ⭁E「選択肢3を実行して、E <ここに選択肢3> - <琁E��・影響>
<追加の選択肢がある場合�E4, 5...と続けめE

### 現在積み上がってぁE��タスクとの連携
- 選択肢1を実行すると、ETASK_ID>�E�優先度: High/Medium/Low�E��E<前提条件/並行作業/依存関俁Eが整ぁE��ぁE- 選択肢2を実行すると、ETASK_ID>�E�優先度: High/Medium/Low�E�と並行して進められまぁE
【補足�E�任意）、E- 制紁E優先度/締刁E
```

**注訁E*: 選択肢の数は3つに限定せず、状況に応じて増減可能。推奨度�E�⭐⭐⭁E⭐⭁E⭐）とタスク連携惁E��を忁E��含めること、E
### 完亁E��名乗る最低条件�E�強制�E�E
- `git status -sb` がクリーン�E�EM`/`??` が無ぁE��E- 変更がある場合�E commit 済み
- push が忁E��なめEpush 済み�E�また�E GitHubAutoApprove=false で **push pending を�E訁E*�E�E- Orchestrator/Worker のレポ�Eト保存が要求される場合�E `report-validator` を通過済み

---

## 5. 改喁E��案（提案するべき“類する機�E”！E
- **(導�E済み) session-end-check**: 終亁E��チE��プレの有無 / git clean / push pending を検査し、NOT OK を�Eす簡易チェチE��ー�E�Escripts/session-end-check.js`�E�E- **(提桁E docs-entrypoint-check**: `OPEN_HERE` が本ファイルと Runbook を参照してぁE��か、Driver が固宁Eセクションと終亁E��ンプレを要求してぁE��かを検査する�E�散逸の早期検知�E�E

