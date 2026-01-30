# OPEN HERE�E�運用老E�E入口�E�E
こ�Eドキュメント�E、E*shared-workflows を運用する人閁E*が「どのフォルダを開ぁE��、どのチE��プレをコピ�Eするか」を迷わなぁE��め�E入口です、E
- プロジェクdト�E�E�Eubmodule運用�E�E `.shared-workflows/docs/windsurf_workflow/OPEN_HERE.m`
- こ�Eリポジトリ直読み: `docs/windsurf_workflow/OPEN_HERE.md`

---

## 最短ルート（迷ったらこれだけ！E
開くフォルダ�E�参照�E�E

- `.shared-workflows/docs/windsurf_workflow/`

開くフォルダ�E�コピ�E�E�E

- `.shared-workflows/prompts/`

毎回コピ�Eするも�E�E�E*1つに統一**�E�E

- **Orchestrator起勁E再開�E�毎回これだけ！E*: `.shared-workflows/prompts/every_time/ORCHESTRATOR_DRIVER.txt`

初回だけコピ�Eするも�E�E�環墁E��未整備�E場合！E

- **Kickstart�E��E回！E*: `.shared-workflows/prompts/first_time/PROJECT_KICKSTART.txt`
- **Kickstart再開�E�セチE��アチE�Eが途中で止まった場合！E*: `.shared-workflows/prompts/first_time/PROJECT_KICKSTART_RESUME.txt`

補足:
- 以前�E `.shared-workflows/prompts/every_time/ORCHESTRATOR_METAPROMPT.txt` と `ORCHESTRATOR_RESUME.txt` は互換ラチE��ー�E�Eeprecated�E�。貼ってめEDriver へ誘導される、E
Global Rules�E�エチE��タごとの統一�E�E

- **Windsurf**: Windsurf Global Rules に `.shared-workflows/prompts/global/WINDSURF_GLOBAL_RULES.txt` を貼り付け
- **Cursor**: PowerShell�E�推奨: スクリプトで一括適用�E�E
  ```powershell
  # 消費側プロジェクト！Eshared-workflows がある！E  pwsh -NoProfile -File .shared-workflows/scripts/apply-cursor-rules.ps1 -ProjectRoot .

  # shared-workflows リポジトリ直下で試ぁE  pwsh -NoProfile -File scripts/apply-cursor-rules.ps1 -ProjectRoot .
  ```

  代替�E�非推奨: 手動での取りこぼぁE運用ブレが�EめE��ぁE��E
  - `.cursorrules` と `.cursor/rules.md` めEtemplates からコピ�Eする

参�Eするも�E�E�コピ�Eは原則しなぁE��E

- **毎回の運用SSOT�E�最優先！E*: `.shared-workflows/docs/windsurf_workflow/EVERY_SESSION.md`

- **Worker生�EチE��プレ�E�参照�E�E*: `.shared-workflows/docs/windsurf_workflow/WORKER_PROMPT_TEMPLATE.md`
  - Orchestrator がチケチE��冁E���E�Eier/Focus/Forbidden/DoD�E�に合わせて Worker Prompt を�E度生�Eするためのベ�Eス
- **Worker起動判定（準備ループ防止�E�E*: `.shared-workflows/docs/windsurf_workflow/WORKER_ACTIVATION_CHECKLIST.md`
  - Worker 投�Eの直前に GO/NO-GO を判断し、整合取りで停滞するループを防ぁE
- **実運用手頁E���E劁E失敗判定つき！E*: `.shared-workflows/docs/windsurf_workflow/OPERATIONS_RUNBOOK.md`

- **チE���E�EritingPage等�E消費側でどぁE��ぁE���E�E*: `.shared-workflows/docs/windsurf_workflow/DEMO_SCENARIOS.md`

- **更新チェチE���E�推奨�E�E*: `.shared-workflows/scripts/sw-update-check.js`
  - 侁E `node .shared-workflows/scripts/sw-update-check.js`

- **終亁E��チェチE���E�推奨�E�E*: `.shared-workflows/scripts/session-end-check.js`
  - 侁E `node .shared-workflows/scripts/session-end-check.js --project-root .`

---

## 運用ストレージ�E��Eロジェクト�Eで忁E��見る場所�E�E
- `AI_CONTEXT.md`�E��Eロジェクトルート！E 状慁E中断可能点/意思決宁E- `docs/HANDOVER.md`: 全体�E進捗、ブロチE��ー、E��用フラグ�E�侁E `GitHubAutoApprove: true`�E�E- `docs/tasks/`: チケチE���E�Etatus: OPEN/IN_PROGRESS/DONE がSSOT�E�E- `docs/inbox/`: Worker の納品レポ�Eト（次囁EOrchestrator が回収して HANDOVER に統合！E
---

## 迷ぁE��ちなポイント（判断だけ固定！E
- GitHub操作！Eush/PR/merge�E�を承認征E��で止めなぁE��用にしたぁE��合�E、`docs/HANDOVER.md` に `GitHubAutoApprove: true` を記載して判断根拠を固定する、E- ただぁE`rebase` / `reset` / `force push` など **破壊的/復旧困難な操作�E常に停止して合意を取めE*、E
---

## 追加の参�E�E�忁E��なときだけ！E
- ルール本体！ESOT�E�E `.shared-workflows/docs/Windsurf_AI_Collab_Rules_latest.md`
- Worker起動判定（準備ループ防止�E�E `.shared-workflows/docs/windsurf_workflow/WORKER_ACTIVATION_CHECKLIST.md`
- チE��プレ一覧: `.shared-workflows/docs/PROMPT_TEMPLATES.md`
- オーケストレーション手頁E��参照�E�E `.shared-workflows/docs/windsurf_workflow/ORCHESTRATOR_PROTOCOL.md`
- コピ�E用プロンプト雁E��貼るだけ！E `.shared-workflows/prompts/`
- 進行�E全体像�E�任意！E プロジェクトルーチE`ORCHESTRATION_PROMPT.md`�E�採用してぁE��場合�Eみ�E�E- SSOTファイル�E�Edocs/Windsurf_AI_Collab_Rules_latest.md`�E�がプロジェクトに無ぁE��合�E、作業開始前に以下いずれかで `scripts/ensure-ssot.js --project-root .` を実行して補完すめE
  1. Submodule推奨: `node .shared-workflows/scripts/ensure-ssot.js --project-root .`
  2. 共有ディレクトリを直接参�E: `node ../shared-workflows/scripts/ensure-ssot.js --project-root .` 筁E  3. プロジェクト�E `scripts/` にコピ�Eした `ensure-ssot.js` を実衁E  - ぁE��れも `.shared-workflows/` が無くてめESSOT を揃えられる。コマンドで解決できなぁE��合�E停止して参�E方法を調整する、E
