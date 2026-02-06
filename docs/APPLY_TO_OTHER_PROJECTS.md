# 他プロジェクトへの適用（再現手順）

## シナリオA: submodule で導入（推奨）

前提: 対象プロジェクトのリポジトリ直下で作業する。

1) submodule 導入（初回のみ）

```bash
git submodule add https://github.com/YuShimoji/shared-workflows.git .shared-workflows
git submodule update --init --recursive
```

補足（ローカルパスでのデモを回す場合）:
- Git の設定によっては `fatal: transport 'file' not allowed` になります。
- その場合は「そのコマンドだけ」許可します（グローバル変更不要）:

```bash
git -c protocol.file.allow=always submodule add <LOCAL_PATH_TO_SHARED_WORKFLOWS> .shared-workflows
git -c protocol.file.allow=always submodule update --init --recursive
```

2) Cursor ルール適用（推奨）

PowerShell:
```powershell
pwsh -File .shared-workflows/scripts/apply-cursor-rules.ps1 -ProjectRoot .
```

3) Orchestrator 運用開始（チャットに貼るのは1つだけ）
- `.shared-workflows/prompts/every_time/ORCHESTRATOR_DRIVER.txt`

## シナリオB: submodule を使わない（コピー運用）

ネットワーク/権限等の理由で submodule を使えない場合。

1) shared-workflows をローカルに配置（例: `../shared-workflows-1/`）
2) 入口を固定して運用
- `docs/windsurf_workflow/OPEN_HERE.md` を参照し、必要ファイルをコピーして配置
3) Cursor ルール適用

PowerShell（shared-workflows リポジトリ直下で実行）:
```powershell
pwsh -File scripts/apply-cursor-rules.ps1 -ProjectRoot .
```

## シナリオC: “とにかく安定化”だけ先に入れる

長大作業で止まりやすい/沈黙終了が多い場合は、まずルール適用だけ行う。

1) `.cursorrules` と `.cursor/rules.md` を配置
2) Orchestrator Driver の「中間報告ルール」を運用開始


