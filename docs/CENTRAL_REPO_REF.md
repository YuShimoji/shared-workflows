# Central Repository Reference

本ファイルは、shared-workflows リポジトリを他プロジェクトから参照する際の情報を提供する。

## リポジトリ情報

- **リポジトリ名**: shared-workflows
- **絶対パス**: `c:\Users\thank\Storage\Media Contents Projects\shared-workflows-1`
- **GitHub URL**: https://github.com/YuShimoji/shared-workflows

## SSOT (Single Source of Truth)

| ファイル | 役割 |
|----------|------|
| `docs/Windsurf_AI_Collab_Rules_latest.md` | 中央ルール（固定参照先 / latest） |
| `docs/PROMPT_TEMPLATES.md` | テンプレート集 |
| `docs/windsurf_workflow/ORCHESTRATOR_PROTOCOL.md` | オーケストレーション・プロトコル |
| `REPORT_CONFIG.yml` | レポート設定 |

## 参照の確実性（重要）

- Windsurf/AI のファイル参照は「現在開いているプロジェクト（ワークスペース）内」に限定される場合がある。
- そのため、Memory に絶対パスを書くだけでは、AI が SSOT を実際に読めているかを自動検証できないことがある。
- **確実に参照させたい場合は「方法3: Git Submodule」を推奨**（少なくとも SSOT 本文はワークスペース内に置く）。

## 他プロジェクトからの参照方法

### 方法1: Windsurfグローバルメモリに登録

Windsurfの Settings > Memories に以下を追加:

```
中央リポジトリ: c:\Users\thank\Storage\Media Contents Projects\shared-workflows-1
作業開始時は上記リポジトリの docs/Windsurf_AI_Collab_Rules_latest.md を参照すること。
```

### 方法2: プロジェクト内に参照ファイルを配置

各プロジェクトのルートに `AI_CONTEXT.md` を作成し、以下を記載:

```markdown
## 中央ルール参照
- Path: c:\Users\thank\Storage\Media Contents Projects\shared-workflows-1
- SSOT: docs/Windsurf_AI_Collab_Rules_latest.md
```

### 方法3: Git Submodule

```bash
git submodule add https://github.com/YuShimoji/shared-workflows.git .shared-workflows
```

参照: `.shared-workflows/docs/Windsurf_AI_Collab_Rules_latest.md`
