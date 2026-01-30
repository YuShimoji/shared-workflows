# shared-workflows

共通�E開発ワークフローと AI 協調開発ルール�E�Eingle Source of Truth�E�を提供する中央リポジトリです、E
## 最新ルール

- **ルール本体（最新牁E/ SSOT�E�E*: `docs/Windsurf_AI_Collab_Rules_latest.md`
  - v1.1/v2.0 の改喁E��取り込んだ単一のエントリポインチE  - 実行フローの完�E明確化、クリーンアチE�Eの義務化を定義

## 吁E�Eロジェクトでの運用

吁E�Eロジェクト�E本リポジトリのルールを参照し、�Eロジェクト直下�E `AI_CONTEXT.md` を運用してください、E
### チE��プレーチE
- `templates/AI_CONTEXT.md` - AI作業状態記録用チE��プレーチE- `templates/ORCHESTRATION_PROMPT.md` - オーケストレーション用プロンプト�E�任意！E- `templates/PROJECT_KICKSTART_PROMPT.md` - 初回セチE��アチE�E用プロンプト�E�参照。説明付き / フォールバック�E�E- `docs/windsurf_workflow/OPEN_HERE.md` - 運用老E�E入口�E�参照。どのフォルダを開ぁE/ どれをコピ�Eする、を1枚に雁E��E��E- `docs/windsurf_workflow/ORCHESTRATOR_METAPROMPT.md` - Orchestrator起動用�E�参照�E�E- `docs/windsurf_workflow/WORKER_PROMPT_TEMPLATE.md` - Orchestrator が毎回生�Eする Worker 起動用プロンプトのチE��プレ�E�Eつ目のチE��プレ / 参�E用�E�E- `prompts/first_time/PROJECT_KICKSTART.txt` - 初回セチE��アチE�E用プロンプト�E�コピ�E用�E�E- `prompts/every_time/ORCHESTRATOR_DRIVER.txt` - Orchestrator起勁E再開�E�毎回コピ�E用 / **1つに統一**�E�E- `prompts/global/WINDSURF_GLOBAL_RULES.txt` - Windsurf Global Rules�E�端末ごとの統一 / コピ�E用�E�E- `prompts/role/ROLE_PROMPT_*.txt` - 役割別プロンプト�E�コピ�E用 / 参老E�Eフォールバック�E�E- `templates/TASK_TICKET_TEMPLATE.md` - docs/tasks/TASK_*.md の雛形�E�ErchestratorがチケチE��発行時に使用�E�E- `templates/ROLE_PROMPT_IMPLEMENTER.md` - 役割別プロンプト�E�実裁E��E/ 参�E。説明�EチE��付き�E�E- `templates/ROLE_PROMPT_REVIEWER.md` - 役割別プロンプト�E�レビュア / 参�E。説明�EチE��付き�E�E- `templates/ROLE_PROMPT_CI_HANDLER.md` - 役割別プロンプト�E�EI対忁E/ 参�E。説明�EチE��付き�E�E- `templates/ROLE_PROMPT_RELEASE_MANAGER.md` - 役割別プロンプト�E�リリース拁E��E/ 参�E。説明�EチE��付き�E�E- `templates/ISSUE_TEMPLATE.md` - Issue作�E用チE��プレーチE- `templates/PR_TEMPLATE.md` - PR作�E用チE��プレーチE- `templates/cleanup.sh` - クリーンアチE�EチェチE��スクリプト

## v2.0 の主な改喁E��

### 問顁E: 自動PR・自動�Eージ直前での停止 ↁE解決

- **CI成功 = 即座に自動�Eージ** の単純ルール
- 中断禁止ゾーン�E�ER作�E�E��Eージ�E�で人間�E介�Eを排除
- タイムアウト�E琁E�E明確匁E
### 問顁E: 不要なコード（デバッグ、コメントアウト）�E残留 ↁE解決

- **クリーンアチE�EチェチE��** の義務化�E�ER作�E前に忁E��！E- 自動検�Eスクリプト�E�Ecleanup.sh`�E��E提侁E- Pre-flightチェチE��の一部として絁E��込み

### 運用: コマンド実行�E事前承認（効玁E���E�E
- 最新牁ESOT�E�Eatest�E�に **「コマンド実行�Eリシー�E�高速化�E�、E* の運用ルールを含みまぁE- 原則として、ローカルで安�Eなコマンド�E AI が�E律実行し、作業を止めずに進めまぁE- 外部通信/破壊的操佁E依存関係追加/長時間実行などは事前承認を取り、忁E��な場合�Eワンストップ！E回�E承認）でまとめて提示します（ただし、GitHub操作を普段から自動承認する運用なら承認征E��で停止しなぁE��E
## クイチE��スターチE
最小運用�E�推奨�E�E

- 初回のみ `prompts/first_time/PROJECT_KICKSTART.txt` を使ぁE��各プロジェクトに `.shared-workflows/`�E�Eubmodule�E�を導�E
- 運用老E�E入口�E�参照。どのフォルダを開ぁEどれをコピ�Eする�E�E `.shared-workflows/docs/windsurf_workflow/OPEN_HERE.md`
- 毎回 `.shared-workflows/prompts/every_time/ORCHESTRATOR_DRIVER.txt` めEOrchestrator スレチE��に貼る！E*これだぁE*�E�E- Worker 用プロンプトは Orchestrator がチケチE��冁E���E�Eier/Focus/Forbidden 等）に合わせて動的生�Eする
  - 生�Eベ�Eス�E�参照用チE��プレ�E�E `.shared-workflows/docs/windsurf_workflow/WORKER_PROMPT_TEMPLATE.md`

端末ごとの統一�E�推奨�E�E

- Windsurf の Global Rules に `.shared-workflows/prompts/global/WINDSURF_GLOBAL_RULES.txt` を貼めE
1. プロジェクトルートに `AI_CONTEXT.md` を�E置�E�Etemplates/AI_CONTEXT.md` をコピ�E�E�E2. `scripts/cleanup.sh` を�E置�E�Etemplates/cleanup.sh` をコピ�Eしてカスタマイズ�E�E3. �E�任意）�Eロジェクトルートに `ORCHESTRATION_PROMPT.md` を�E置�E�Etemplates/ORCHESTRATION_PROMPT.md` をコピ�E�E�E4. CI設定にPre-flightチェチE��を絁E��込む
5. AI に最新牁ESOT�E�E.shared-workflows/docs/Windsurf_AI_Collab_Rules_latest.md`�E�を参�EさせめE6. �E�任意）`docs/ISSUES.md` を起点にバックログを管琁E��、Issue同期ワークフロー�E�E.github/workflows/sync-issues.yml`�E�でGitHub Issueに反映する

役割が�E確な場合�E、`templates/ROLE_PROMPT_*.md` の「毎回のプロンプト�E�コピ�E用�E�」を使ぁE��、返信フォーマットとエチE��ケース対応まで一貫します（運用方針として固定テンプレを増やさなぁE��合�E、Orchestrator ぁEWorker 用の最小�Eロンプトを動皁E��成してもよぁE��、E
## 参�Eナビ�E�いつ・何を見るか！E
<a id="reference-navigation" name="reference-navigation"></a>

こ�Eリポジトリの参�E先�E多いので、E*「今�E状況」�E「見るべきファイル/見�Eし、E* をここに雁E��E��ます、E
### 0) 迷ったらまずここ（毎回の基本�E�E
- **運用老E�E入口�E�参照。どのフォルダを開ぁEどれをコピ�Eする�E�E*: `docs/windsurf_workflow/OPEN_HERE.md`�E�このリポジトリ冁E��E/ `.shared-workflows/docs/windsurf_workflow/OPEN_HERE.md`�E��Eロジェクト�E / Submodule�E�E- **毎回の運用SSOT�E�最優先！E*: `docs/windsurf_workflow/EVERY_SESSION.md`�E�このリポジトリ冁E��E/ `.shared-workflows/docs/windsurf_workflow/EVERY_SESSION.md`�E��Eロジェクト�E / Submodule�E�E- **コピ�E用プロンプト雁E*: `prompts/`�E�このリポジトリ冁E��E/ `.shared-workflows/prompts/`�E��Eロジェクト�E / Submodule�E�E- **SSOT�E�最新版！E*: `docs/Windsurf_AI_Collab_Rules_latest.md`�E��Eロジェクト�E / Submodule�E�E  - 見る箁E��: `0. 起動シーケンス` / `1. 基本原則` / `3. 忁E��フロー�E�Eier 2の標準）`
- **プロジェクト�E状慁E*: プロジェクトルーチE`AI_CONTEXT.md`
  - 見る箁E��: `現在のミッション` / `次の中断可能点` / `リスク/懸念` / `短期！Eext�E�`
- **全体進行（任意！E*: プロジェクトルーチE`ORCHESTRATION_PROMPT.md`
  - 見る箁E��: `毎回のプロンプト�E�オーケストレーター用�E�` / `エチE��ケース早見表` / `チE��`
- **タスク堁E��（忁E��！E*: `docs/tasks/` / `docs/inbox/` / `docs/HANDOVER.md`
  - 見る箁E��:
    - `docs/tasks/`: `Status: OPEN/IN_PROGRESS/DONE`�E�チケチE��のSSOT�E�E    - `docs/inbox/`: `REPORT_...md`�E�Eorker納品物。次回Orchestratorが回収！E    - `docs/HANDOVER.md`: 全体進捗、ブロチE��ー、E��用フラグ�E�侁E `GitHubAutoApprove: true`�E�E- **巡回監査�E�任意！E*: `node .shared-workflows/scripts/orchestrator-audit.js`
  - 見る箁E��: Warnings/Anomalies�E�報告漏れ/乖離の検知�E�E
### 1) 作業開始（新要E再開�E�E
- **SSOT**: `docs/Windsurf_AI_Collab_Rules_latest.md`�E�このリポジトリ冁E��E/ `.shared-workflows/docs/Windsurf_AI_Collab_Rules_latest.md`�E��Eロジェクト�E / Submodule�E�E  - 見る箁E��: `0. 起動シーケンス`
- **AI_CONTEXT.md**
  - 見る箁E��: `進捗` / `次の中断可能点`

### 2) Issue化�E計画�E�Eoal/DoDの明文化！E
- **SSOT**: `docs/Windsurf_AI_Collab_Rules_latest.md`
  - 見る箁E��: `3. 忁E��フロー�E�Eier 2の標準）` の `Step 1: Issue作�E`
- **チE��プレ**: `templates/ISSUE_TEMPLATE.md`

### 3) 実裁E��Eier 2の標準！E
- **役割別プロンプト�E�実裁E��E��E*: `templates/ROLE_PROMPT_IMPLEMENTER.md`
  - 見る箁E��: `毎回のプロンプト�E�コピ�E用�E�` / `チE��`
- **SSOT**: `docs/Windsurf_AI_Collab_Rules_latest.md`
  - 見る箁E��: `Step 3: 実裁E ↁE`Step 4: クリーンアチE�EチェチE��` ↁE`Step 5: Pre-flight Check` ↁE`Step 6: コミッチE
- **クリーンアチE�E**: `templates/cleanup.sh`�E�各プロジェクトで `scripts/cleanup.sh` に配置�E�E
### 4) PR作�E・レビュー

- **SSOT**: `docs/Windsurf_AI_Collab_Rules_latest.md`
  - 見る箁E��: `Step 7: PR自動作�E` / `Step 8: CI実行！EIは征E��）` / `Step 9: 自動�Eージ`
- **役割別プロンプト�E�レビュア�E�E*: `templates/ROLE_PROMPT_REVIEWER.md`
- **チE��プレ**: `templates/PR_TEMPLATE.md`

### 5) CIが失敗した（最優先で復旧�E�E
- **役割別プロンプト�E�EI対応！E*: `templates/ROLE_PROMPT_CI_HANDLER.md`
  - 見る箁E��: `毎回のプロンプト�E�コピ�E用�E�` / `判断基準` / `チE��`
- **SSOT**: `docs/Windsurf_AI_Collab_Rules_latest.md`
  - 見る箁E��: `Step 5: Pre-flight Check` / `Step 8: CI実行！EIは征E��）`
- **オーケストレーションチE��プレ**: `templates/ORCHESTRATION_PROMPT.md`
  - 見る箁E��: `チE��3: CIが失敗する` / `チE��5: 権限不足` / `チE��7: Secrets/環墁E��数が足りない`

�E�補足�E�Worker起動�Eロンプトの作り方は `.shared-workflows/docs/windsurf_workflow/WORKER_PROMPT_TEMPLATE.md` を参照、E
### 6) リリース�E�本番系はTier 3になりやすい�E�E
- **役割別プロンプト�E�リリース拁E��！E*: `templates/ROLE_PROMPT_RELEASE_MANAGER.md`
- **SSOT**: `docs/Windsurf_AI_Collab_Rules_latest.md`
  - 見る箁E��: `2. 簡素化されたTier刁E��` の `Tier 3�E�人間承認忁E��）`

### 7) よくある詰まり（まとめE��E
- **オーケストレーションチE��プレ**: `templates/ORCHESTRATION_PROMPT.md`
  - 見る箁E��: `エチE��ケース早見表` / `チE��2: pushが拒否される` / `チE��6: PR自動�Eージが働かない`

## バックログ管琁E��Essue同期�E�E
こ�Eリポジトリでは、`docs/ISSUES.md` を起点にバックログを管琁E��、GitHub Actions のワークフロー�E�E.github/workflows/sync-issues.yml`�E�で自動的に GitHub Issue に同期します、E
### 使ぁE��

1. **バックログの更新**: `docs/ISSUES.md` を編雁E��各セクション�E�E##` 見�Eし）が1つのIssueに対応！E2. **自動同朁E*: `docs/ISSUES.md` めE`main` ブランチに push すると自動実衁E3. **手動実衁E*: GitHub Actions の「Reusable Sync Issues from docs」ワークフローを手動実行！Eworkflow_dispatch`�E�も可能

### 運用ルール

- **更新**: 見�Eしタイトルを変えなければ同じIssueが更新されまぁE- **削除**: `docs/ISSUES.md` から削除された見�Eし�E、`managed:docs-sync` ラベル付きの既存Issueが�E動でクローズされまぁE- **実行方況E*: `docs/ISSUES.md` 更新時に自動実行！Eainのみ�E�し、忁E��なら手動実行！Eorkflow_dispatch�E�もできまぁE
詳細は [`docs/ISSUES.md`](./docs/ISSUES.md) を参照してください、E
## 関連リンク

- [Windsurf AI 協調開発ルール�E�最新牁E/ SSOT�E�](./docs/Windsurf_AI_Collab_Rules_latest.md)
- [変更履歴�E�E2.0�E�](./docs/Windsurf_AI_Collab_Rules_v2.0.md#変更履歴)
- [Issue同期用バックログ�E�Eocs/ISSUES.md�E�](./docs/ISSUES.md)
- [参�Eナビ�E�いつ・何を見るか）](#reference-navigation)
- [斁E��化け修正ガイド](./docs/ENCODING_FIX_GUIDE.md) - 斁E��化けが発生した場合�E対処�
