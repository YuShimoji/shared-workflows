# バージョニング指針（SemVer 軽運用）

**最終更新**: 2026-02-06
**更新者**: Cascade

## 方針

shared-workflows は [Semantic Versioning 2.0.0](https://semver.org/) を軽量運用します。

```text
vMAJOR.MINOR.PATCH
```

| 区分 | いつ上げるか | 例 |
|------|-------------|-----|
| **MAJOR** | 親プロジェクトが壊れうる Breaking Change | critical パスの削除/リネーム、SSOT フォーマット変更 |
| **MINOR** | 後方互換のある機能追加 | 新スクリプト追加、新ドキュメント追加、推奨パスの変更 |
| **PATCH** | バグ修正、ドキュメント修正、内部リファクタ | typo 修正、既存スクリプトの修正 |

## Breaking Change の定義

`scripts/compat-check.js` の **critical** パスに変更が生じる場合は Breaking Change です。

具体的には以下のいずれか:

- `prompts/every_time/ORCHESTRATOR_DRIVER.txt` の削除またはリネーム
- `prompts/every_time/WORKER_METAPROMPT.txt` の削除またはリネーム
- `prompts/first_time/PROJECT_KICKSTART.txt` の削除またはリネーム
- `data/presentation.json` のスキーマ互換を壊す変更
- `docs/Windsurf_AI_Collab_Rules_latest.md` の削除
- `docs/windsurf_workflow/EVERY_SESSION.md` の削除
- `scripts/sw-doctor.js`, `scripts/ensure-ssot.js` の削除

## タグ付与手順

```bash
# 1. 互換性チェック
node scripts/compat-check.js

# 2. タグ付与（例: v1.1.0）
git tag -a v1.1.0 -m "feat: add compat-check and submodule guide"

# 3. プッシュ
git push origin v1.1.0
```

## CHANGELOG の運用

大きな変更はタグのアノテーションメッセージに記述します。
詳細な変更履歴は `README.md` の末尾にある変更履歴セクションを参照してください。

### Breaking Change のアナウンス

Breaking Change を含むリリースでは:

1. タグメッセージに `BREAKING:` プレフィックスを付ける
2. `README.md` の変更履歴に明記する
3. 親プロジェクト側で `compat-check.js` を実行して影響を確認する

## 現在のバージョン履歴

| バージョン | 日付 | 種別 | 概要 |
|-----------|------|------|------|
| **v1.0.0** | 2026-02-06 | MAJOR | リポジトリ近代化完了。互換性ゲート・サブモジュールガイド・SemVer 運用開始 |
| v0.1.0 | 初期 | — | 初期リリース |

## 親プロジェクト側の推奨運用

- **最新追従**: `.gitmodules` で `branch = main` を指定し、定期的に `git submodule update --remote` で追従
- **安定版固定**: 特定タグのコミットに固定（`git -C .shared-workflows checkout v1.0.0`）
- **更新前チェック**: 必ず `compat-check.js` を実行
  (`node .shared-workflows/scripts/compat-check.js`)

詳細な手順: [SUBMODULE_GUIDE.md](./SUBMODULE_GUIDE.md)
