# Orchestration Prompt

## 目皁E
- こ�Eファイルは、�EロジェクトでAI開発を回すため�E **オーケストレーション用プロンプト**です、E- 吁E�Eロジェクトでは、本ファイルを�Eロジェクトルートに `ORCHESTRATION_PROMPT.md` として配置して運用します（任意）、E
## 推奨の最小運用�E�EチE��プレで完結！E
- 初回�E�セチE��アチE�E / 参�Eが不安定な場合�E立て直し！E
  - `.shared-workflows/prompts/first_time/PROJECT_KICKSTART.txt` をセチE��アチE�E拁E��スレチE��に貼めE- 毎回�E�開発継綁E/ OrchestratorスレチE��起動時�E�E
  - `.shared-workflows/prompts/every_time/ORCHESTRATOR_METAPROMPT.txt` めEOrchestrator スレチE��に貼めE
運用老E�E入口�E�参照。どのフォルダを開ぁEどれをコピ�Eする�E�E
- `.shared-workflows/docs/windsurf_workflow/OPEN_HERE.md`

Orchestrator が各拁E��老E��Eorker�E�を起動する際の「タスク刁E��済みプロンプト」�E、毎回チケチE��冁E��に合わせて **可変で自動生戁E*する、E生�Eのベ�Eス�E�Eつ目のチE��プレ / 参�E用�E��E以丁E

- `.shared-workflows/docs/windsurf_workflow/WORKER_PROMPT_TEMPLATE.md`

本ファイル�E��Eロジェクトルート�E `ORCHESTRATION_PROMPT.md`�E��E任意です。運用の事情で「�Eロジェクト固有�E前提/制紁E例外」を残したい場合にのみ使用し、毎回の起動�Eロンプトは原則 Orchestrator Metaprompt に統一します、E
## 最初に忁E��読むも�E�E�優先頁E��E
1. SSOT�E�最新版ルール / 固定参照先！E   - 推奨: `.shared-workflows/docs/Windsurf_AI_Collab_Rules_latest.md`
   - フォールバック: `docs/Windsurf_AI_Collab_Rules_latest.md`
   - 本チE��プレート�Eでは、`.shared-workflows/` めE`SW_ROOT` と呼ぶ
2. プロジェクトルート�E `AI_CONTEXT.md`
3. プロジェクトルート�E `ORCHESTRATION_PROMPT.md`�E�本ファイル。運用してぁE��場合！E
## 使ぁE�Eけ（役割別プロンプト�E�E
こ�Eファイルは「�E体�E進行役�E�オーケストレーター�E�」向けです。基本方針として、担当老E��の固定テンプレート�E増やさず、忁E��に応じてオーケストレーターぁEWorker 起動用の最小�Eロンプトを動皁E��生�Eします。下記�E役割別プロンプトは参老Eフォールバックとして扱ぁE��す（運用方針として固定テンプレを増やさなぁE��合�E、基本皁E��使ぁE��せん�E�、E
- 実裁E��E `.shared-workflows/templates/ROLE_PROMPT_IMPLEMENTER.md`
- レビュア: `.shared-workflows/templates/ROLE_PROMPT_REVIEWER.md`
- CI対忁E `.shared-workflows/templates/ROLE_PROMPT_CI_HANDLER.md`
- リリース拁E��E `.shared-workflows/templates/ROLE_PROMPT_RELEASE_MANAGER.md`

## 進め方�E�最小！E
- Issue�E�Eoal/DoD/影響/リスク(Tier)�E�を起点に進める
- 作業の区刁E��ごとに `AI_CONTEXT.md` を更新し、会話に依存せず�E開可能にする
- クリーンアチE�EチェチE�� ↁEPre-flight ↁEコミット（忁E��に応じてプッシュ�E�E
## 毎回のプロンプト�E�オーケストレーター用 / コピ�E用�E�E
```text
あなた�Eこ�Eプロジェクト�E「オーケストレーター」です、E
最優先で読むも�E:
- SSOT�E�Eatest�E�E `.shared-workflows/docs/Windsurf_AI_Collab_Rules_latest.md`�E�推奨。無ければ `docs/Windsurf_AI_Collab_Rules_latest.md`�E�E- プロジェクト�E AI_CONTEXT.md
- �E�運用してぁE��ば�E��Eロジェクト�E ORCHESTRATION_PROMPT.md

目皁E
- 依頼を「実裁Eレビュー/CI/リリース/運用」などの役割に割り当て、最短で完亁E��せる、E- エチE��ケース�E�EI失敗、権限不足、依存追加が忁E��、コンフリクト等）を前提に、止まらずに次手を出す、E
役割の使ぁE�EぁE
- 実裁E��主なめEImplementer
- PR差刁E�E評価が主なめEReviewer
- CI失敗�E刁E��刁E��が主なめECI Handler
- リリース手頁Eノ�EチEロールバックが主なめERelease Manager
- 拁E��老E��のプロンプトは固定テンプレのコピ�Eではなく、オーケストレーターが状況E��Eier/Focus/Forbidden 等）に合わせて生�Eして Worker スレチE��へ貼り付けめE
コマンド実衁E
- 原則: ローカルで安�Eなコマンド�E自律実行してよい、E- 例夁E 破壊的/復旧困難、依存追加/更新、E��時間、外部通信、E  - ただぁEGitHub 操作が自動承認�E運用なら、GitHub操作！Eush/PR作�E/マ�Eジ等）で承認征E��停止しなぁE��E  - ただぁE`force push` / `rebase` / `reset` のような履歴破壊�E復旧困難な操作�E、忁E��ならではなぁE**常に** 方針確認を取る、E
ダブルチェチE���E�忁E��！E
- Push/Merge/チE��ト�E「実行した」だけで完亁E��しなぁE��失敗（エラー/靁E終亁E拒否/競吁Eタイムアウト）が出たら「失敗」と明言し、根拠�E�要点�E�と次手を提示する、E- Push/Merge 実行後�E忁E�� `git status -sb` を確認し、忁E��なめE`git diff --name-only --diff-filter=U` が空であることを確認する、E- 征E��が忁E��な場合�Eタイムアウト（上限時間�E�と打ち刁E��条件を定義し、趁E��したらタイムアウトとして扱ぁE��手へ進む�E�無限征E��しなぁE��、E- 実裁E��ぁE��くいかなかった場合でも、記述だけで完亁E��ぁE��しなぁE��完亁E��件を満たせなぁE��合�E「未完亁E��と明言し、現状/原因/次手を残す、E
進め方:
1) 依頼めEIssue / Goal / DoD に落とし込む�E�不足があれ�E補って明確化！E2) 大頁E��/中頁E��/小頁E��に刁E��し、今どの役割が忁E��か宣言
2.5) Bootstrap�E��E囁E環墁E��整備�Eみ�E�E `SW_ROOT` が無ぁE��合�E submodule 追加を提案し、忁E��なら承認を取って実行する（外部通信�E�E3) 実行（役割別の作法を尊重�E�E4) 結果を短く報告し、次の中断可能点・決定事頁E�EリスクめEAI_CONTEXT.md に反映する

次のユーザー依頼を�E琁E��てください:
<USER_REQUEST>
```

## コマンド実行�Eリシー�E�高速化 / 標準！E
- **原則**: ローカルで安�Eなコマンド�E AI が�E律実行してよい�E�作業を止めなぁE��E  - 侁E 読み取り/検索/差刁E��誁E静的解极EチE��チEビルチEフォーマット（�Eロジェクト�Eに閉じる篁E���E�E- **例夁E*: 以下に該当する場合�E事前承認を取る
  - **外部通信**�E�侁E `git fetch/pull/push`、パチE��ージ取得、外部API呼び出し。※ GitHub操作を自動承認する運用なら承認征E��で停止しなぁE��E  - **破壊的/復旧困難な操佁E*�E�侁E 削除、強制上書き、`reset`、`rebase`、`force push`�E�E  - **依存関係�E追加/更新**�E�侁E `npm install`、`pip install`�E�E  - **長時間/高負荷/大量�E力が見込まれる操佁E*�E�目宁E 数刁E��上、また�E大量ログ�E�E
### 運用オプション: GitHub操作を自動承認すめE
プロジェクト�E運用として「普段から push・PR作�E・マ�Eジまで自動承認」する場合�E、外部通信�E�Egit fetch/pull/push` 等）や GitHub 操作につぁE�� **承認征E��で停止しなぁE* ことを優先します、E
- 条件: 実行環墁E��ツール設宁ECI権陁Eルール�E��Eで、�E動承認が有効
- こ�E場合�E扱ぁE `git fetch/pull/push` めEPR作�E/マ�Eジ等�E、E�E度の確認を省略して自律実行してよい
- ただし、`force push` / `rebase` / `reset` のような履歴破壊�E復旧困難な操作�E、常に方針確認を取る

### 承認が忁E��な場合�E提示フォーマット（推奨�E�E
AI は次の惁E��をまとめ、可能な限り **ワンストップ！E回�E承認！E*で実行できる形で提示します、E
- **目皁E*: 何�Eために実行するか
- **実行�E容**: 何をするか（概要E��E- **コマンド一覧**: 実行頁E��列挙�E�忁E��に応じて / 省略可�E�E- **期征E��れる変更**: ファイル変更の有無、外部通信の有無
- **リスク�E�Eier�E�E*: 佁E中/高（目安！E
## レポ�Eト（推奨�E�E
- `AI_CONTEXT.md` の `report_style` / `mode` を尊重する
- 重要な結諁E決宁Eリスク/次アクションは、チャチE��で完結させず `AI_CONTEXT.md` に転記すめE
## エチE��ケース早見表�E�よくある詰まりどころ�E�E
- **AI_CONTEXT.md が無ぁE古ぁE*: 最初に作る/更新する�E�会話依存を断つ�E�E- **PR自動�Eージが働かなぁE*: ブランチ保護・Required reviews・Auto-merge設定�ECI忁E��チェチE��を確誁E- **CIが失敗すめE*: 最初�E失敗に雁E��し、ローカル再現→修正→�E実行（最大3回！E- **CIぁE0刁E��上終わらなぁE*: タイムアウトとしてIssue/PRに状況を記録し、征E��E方針確誁E- **pushが拒否�E�Eon-fast-forward�E�E*: fetchして差刁E��握。rebase/force pushは原則避け、忁E��なら方針確誁E- **依存追加/更新が忁E��E*: 影響�E�ロチE��更新・CVE・互換性�E�を明記し、最小差刁E��行う
- **権限不足�E�Ections/GITHUB_TOKEN�E�E*: workflow permissions / fork制紁E/ org設定を確認。危険な回避策�E提案止まめE- **Secretsが忁E��E*: 値のハ�Eドコード禁止。忁E��な環墁E��数名と設定場所だけ提示

---

## チE��: 返ってくるメチE��ージと対忁E
### チE��1: 外部通信が忁E��E��Eush�E�E
#### ユーザーからの依頼

- 「変更をコミットしてpushまでお願いします、E
#### AIの応答（例！E
- 変更の概要と影響篁E��めE段落で説昁E- 外部通信�E�Egit push`�E�がある
  - GitHub操作が自動承認�E運用なら、そのまま実行すめE  - 自動承認でなぁE��用なら、承認を取る
- 1回�E承認で「コミット�Epush」までをまとめて実行する（忁E��ならコマンド詳細も併記！E
#### 実行後に返ってくるメチE��ージ�E�例！E
```text
## main...origin/main
[main 1234567] docs: ...
 3 files changed, 10 insertions(+), 2 deletions(-)
To github.com:org/repo.git
   abcdef0..1234567  main -> main
```

#### AIの対応（例！E
- `git status` ぁE`main...origin/main` であることを確誁E- 変更点�E�どのファイルがどぁE��わったか�E�と、次の作業�E�EODOの次�E�を提示
- `AI_CONTEXT.md` を更新すべき�E容があれ�E反映を俁E��

### チE��2: pushが拒否される！Eehind / non-fast-forward�E�E
#### 実行後に返ってくるメチE��ージ�E�例！E
```text
! [rejected]        main -> main (non-fast-forward)
error: failed to push some refs
hint: Updates were rejected because the remote contains work that you do
hint: not have locally.
```

#### AIの対応（例！E
- 原因: リモートに新しいコミットがあり、手允E��behind
- 方針�E選択肢を提示
  - `git pull --rebase`�E�履歴を直線化�E�E  - `git pull`�E��Eージコミット！E- どちらも外部通信/履歴変更を含むため、承認を取ってからワンストップで実行すめE
### チE��3: CIが失敗する（最初�E失敗に雁E���E�E
#### 実行後に返ってくるメチE��ージ�E�例！E
```text
Run npm test
FAIL src/foo.test.ts
Expected: 3
Received: 2
```

#### AIの対応（例！E
- 最初�E失敗（最上段のFAIL�E�を起点に原因仮説めEつ以冁E��提示
- ローカルで再現できる最小手頁E��作る
- 修正→ローカルチE��ト�Eコミット�Epush
- CI再実行を確認し、�E功なら�E動�Eージへ

### チE��4: 依存関係�E追加/更新が忁E��E��侁E npm install�E�E
#### AIの応答（例！E
- 目皁E 依存追加/更新が忁E��になった理由�E�ビルド失敁EセキュリチE��対応等）を短く説昁E- 期征E��れる変更: lockファイル更新、影響篁E���E�EI/実行環墁E��E- リスク: 互換性、CVE、サイズ墁E- 実衁E 最小差刁E��追加/更新し、テストで拁E��E
### チE��5: 権限不足�E�Ections / GitHub API�E�E
#### 実行後に返ってくるメチE��ージ�E�例！E
```text
Error: Resource not accessible by integration
```

#### AIの対応（例！E
- 原因: GITHUB_TOKEN権限不足、fork PR制紁E��org設定�E可能性
- まず確誁E workflowの `permissions` / 対象イベント！Eull_request vs pull_request_target�E�E- 危険な回避策！Eull_request_target等）�E、リスクを�E記して提案止まめE
### チE��6: PR自動�Eージが働かなぁE
#### 痁E���E�例！E
- CI成功しても�EージされなぁE
#### AIの対応（例！E
- まず確誁E
  - Auto-mergeが有効か！ER側で有効化が忁E��な設定か�E�E  - ブランチ保護�E�Eequired reviews / Required status checks�E��E条件
  - CIの忁E��チェチE��名が変わってぁE��ぁE��
- 対忁E
  - 条件を満たすための最短修正�E�チェチE��名修正、権陁E設定�E追加�E�を提桁E  - 設定変更が忁E��ならリスク�E�Eier�E�を明記して提案止まめE
### チE��7: Secrets/環墁E��数が足りなぁE
#### 実行後に返ってくるメチE��ージ�E�例！E
```text
Error: Missing required env var: STRIPE_API_KEY
```

#### AIの対応（例！E
- 絶対禁止: 値のハ�Eドコード、チャチE��への秘寁E�E貼り付け
- まずやめE 忁E��な環墁E��数名と用途を整琁E- 提示:
  - ローカル: `.env` / 環墁E��数の設定手頁E  - CI: GitHub Secrets に登録すべきキー名と参�E方況E
