# Central Repository Reference

本ファイルは、shared-workflows リポジトリを他�Eロジェクトから参照する際�E惁E��を提供する、E
## SSOTの参�E方況E
中央リポジトリ�E�Ehared-workflows�E�にあるSSOTファイルを参照します、E
### SSOT バ�Eジョンのフォールバック頁E��（�E動補完！E
shared-workflows サブモジュールのバ�Eジョンによって、SSOT ファイルの名称が異なる場合があります。`scripts/ensure-ssot.js` は、以下�E頁E��でファイルを探索し、�E動的に `docs/Windsurf_AI_Collab_Rules_latest.md` として配置します、E
1. `.shared-workflows/docs/Windsurf_AI_Collab_Rules_latest.md`
2. `.shared-workflows/docs/Windsurf_AI_Collab_Rules_v2.0.md`
3. `.shared-workflows/docs/Windsurf_AI_Collab_Rules_v1.1.md`

AI は常に `latest.md` をエントリポイントとして参�Eしてください、E
## リポジトリ惁E��

- **リポジトリ吁E*: shared-workflows
- **絶対パス**: `<your-local-path-to-shared-workflows>`�E�環墁E��存！E- **GitHub URL**: https://github.com/YuShimoji/shared-workflows

## SSOT (Single Source of Truth)

| ファイル | 役割 |
|----------|------|
| `docs/Windsurf_AI_Collab_Rules_latest.md` | 中央ルール�E�単一エントリポインチE/ latest�E�E|
| `docs/PROMPT_TEMPLATES.md` | チE��プレート集 |
| `prompts/first_time/PROJECT_KICKSTART.txt` | 初回セチE��アチE�E�E�コピ�E用�E�E|
| `templates/PROJECT_KICKSTART_PROMPT.md` | 初回セチE��アチE�E�E�参照。説明付き / フォールバック�E�E|
| `docs/windsurf_workflow/OPEN_HERE.md` | 運用老E�E入口�E�どのフォルダを開ぁE/ どれをコピ�Eする�E�E|
| `docs/windsurf_workflow/EVERY_SESSION.md` | 毎回の運用SSOT�E�終亁E��チE��プレ/完亁E��件/推奨コマンド�E固定！E|
| `prompts/` | コピ�E用プロンプト雁E��貼るだけ！E|
| `prompts/global/WINDSURF_GLOBAL_RULES.txt` | Windsurf Global Rules�E�端末ごとの統一 / コピ�E用�E�E|
| `prompts/every_time/ORCHESTRATOR_DRIVER.txt` | Orchestrator起勁E再開�E�毎回コピ�E / **1つに統一**�E�E|
| `docs/windsurf_workflow/ORCHESTRATOR_METAPROMPT.md` | Orchestrator起動（参照�E�E|
| `docs/windsurf_workflow/ORCHESTRATOR_PROTOCOL.md` | オーケストレーション・プロトコル |
| `docs/windsurf_workflow/WORKER_PROMPT_TEMPLATE.md` | Worker起動�Eロンプト生�EチE��プレ�E�参照用�E�E|
| `templates/TASK_TICKET_TEMPLATE.md` | チケチE��雛形�E�Eocs/tasks/TASK_*.md�E�E|
| `scripts/orchestrator-audit.js` | 巡回監査�E�任意。tasks/inbox/HANDOVER の乖離検知�E�E|
| `scripts/sw-doctor.js` | 環墁E�Eスクリプト・ワークフロー診断�E�推奨。�E期セチE��アチE�E検証・定期監査�E�E|
| `REPORT_CONFIG.yml` | レポ�Eト設宁E|

## 参�Eの確実性�E�重要E��E
- Windsurf/AI のファイル参�Eは「現在開いてぁE��プロジェクト（ワークスペ�Eス�E��E」に限定される場合がある、E- そ�Eため、Memory に絶対パスを書くだけでは、AI ぁESSOT を実際に読めてぁE��かを自動検証できなぁE��とがある、E- **確実に参�Eさせたい場合�E「方況E: Git Submodule」を推奨**�E�少なくとめESSOT 本斁E�Eワークスペ�Eス冁E��置く）、E
## 他�Eロジェクトから�E参�E方況E
### 方況E: Windsurfグローバルメモリに登録

Windsurfの Settings > Memories に以下を追加:

```
中央リポジトリ: <your-local-path-to-shared-workflows>
作業開始時は上記リポジトリの docs/Windsurf_AI_Collab_Rules_latest.md を参照すること、E```

### 方況E: プロジェクト�Eに参�Eファイルを�E置

吁E�Eロジェクト�Eルートに `AI_CONTEXT.md` を作�Eし、以下を記輁E

```markdown
## 中央ルール参�E
- Path: <your-local-path-to-shared-workflows>
- SSOT: docs/Windsurf_AI_Collab_Rules_latest.md
```

### 方況E: Git Submodule

```bash
git submodule add https://github.com/YuShimoji/shared-workflows.git .shared-workflows
```

参�E: `.shared-workflows/docs/Windsurf_AI_Collab_Rules_latest.md`

#### 運用メモ�E�推奨�E�E
- 初回導�E/立て直し�E、中央リポジトリの `prompts/first_time/PROJECT_KICKSTART.txt` を�Eロジェクト�EセチE��アチE�E拁E��スレチE��に貼り付けて実行する、E- 以降�E作業は、�Eロジェクト�Eの `.shared-workflows/` を参照することで「中央リポジトリの存在を示唁E��ず」に SSOT を安定参照できる、E
## Doctor�E�診断チE�Eル�E��E利用

`sw-doctor.js` は、�Eロジェクト�E環墁E�Eスクリプト・ワークフロー状態を自動診断するチE�Eルです、E
### 基本皁E��使用方況E
```bash
# Bootstrap プロファイル�E��E期セチE��アチE�E検証�E�Enode .shared-workflows/scripts/sw-doctor.js --profile shared-orch-bootstrap --format text

# Full プロファイル�E�定期皁E��監査�E�Enode .shared-workflows/scripts/sw-doctor.js --profile shared-orch-doctor --format text

# CI Strict プロファイル�E�本番環墁E���E�Enode .shared-workflows/scripts/sw-doctor.js --profile ci-strict --format text

# JSON 出力！EI 連携用�E�Enode .shared-workflows/scripts/sw-doctor.js --profile shared-orch-doctor --format json
```

詳細は `docs/CLIENT_PROJECT_DOCTOR_GUIDE.md` を参照、E
## サブモジュールが利用できなぁE��合�Eフォールバック

shared-workflows がサブモジュールとして導�EされてぁE��ぁE��吁E
1. 親リポジトリの `scripts/` チE��レクトリから忁E��なスクリプトを直接コピ�Eして使用する
2. `docs/windsurf_workflow/` 冁E�Eファイルを直接参�Eする
3. プロジェクトルートに `AI_CONTEXT.md` を手動で作�Eする

侁E `report-validator.js` が忁E��な場吁E```bash
cp /path/to/source/shared-workflows/scripts/report-validator.js ./scripts/
```

侁E `sw-doctor.js` が忁E��な場吁E```bash
cp /path/to/source/shared-workflows/scripts/sw-doctor.js ./scripts/
cp -r /path/to/source/shared-workflows/scripts/utils ./scripts/
```
