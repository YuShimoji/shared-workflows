# サブモジュール運用ガイド

**最終更新**: 2026-02-06
**更新者**: Cascade

親プロジェクトで `shared-workflows` をサブモジュールとして利用する際の標準手順。

## 初回導入

```bash
# 親プロジェクトのルートで実行
git submodule add -b main https://github.com/YuShimoji/shared-workflows.git .shared-workflows
git commit -m "feat: add shared-workflows submodule"
```

`.gitmodules` に `branch = main` が記録されていることを確認してください。

```ini
[submodule ".shared-workflows"]
    path = .shared-workflows
    url = https://github.com/YuShimoji/shared-workflows.git
    branch = main
```

## サブモジュール更新手順（定期運用）

### クイックコマンド

更新（推奨 / 親リポジトリ側から）:

```bash
git submodule update --remote --merge .shared-workflows \
  && git add .shared-workflows \
  && git commit -m "chore: update shared-workflows submodule"
```

クローン直後の初期化（チームメンバー向け）:

```bash
git submodule update --init --recursive
```

### ステップ 1: 互換性チェック（推奨）

更新前に、破壊的変更がないか検証します。

```bash
# サブモジュール内で最新を取得（まだコミットはしない）
git -C .shared-workflows fetch origin main

# 互換性チェック実行
node .shared-workflows/scripts/compat-check.js
```

- **PASS** → ステップ 2 へ進む
- **FAIL** → `VERSIONING.md` で Breaking Change の内容を確認し、親プロジェクト側を先に修正

### ステップ 2: サブモジュール更新

```bash
# 方法 A: 推奨（親リポジトリ側から）
git submodule update --remote --merge .shared-workflows
git add .shared-workflows
git commit -m "chore: update shared-workflows submodule"

# 方法 B: サブモジュール内で直接操作（フォールバック）
git -C .shared-workflows checkout main
git -C .shared-workflows pull --ff-only
git add .shared-workflows
git commit -m "chore: update shared-workflows submodule"
```

### ステップ 3: 更新後の検証

```bash
# SSOT ファイル補完
node .shared-workflows/scripts/ensure-ssot.js --project-root .

# 環境診断
node .shared-workflows/scripts/sw-doctor.js
```

## クローン後の初期化（チームメンバー向け）

```bash
git clone --recurse-submodules <PARENT_REPO_URL>

# または既存クローンの場合
git submodule update --init --recursive
```

## トラブルシューティング

### サブモジュールが detached HEAD になる

```bash
git -C .shared-workflows checkout main
git -C .shared-workflows pull --ff-only
```

### サブモジュールのコミットが親と一致しない

```bash
git submodule sync --recursive
git submodule update --init --recursive
```

### 更新後に親プロジェクトのスクリプトが壊れた

1. `node .shared-workflows/scripts/compat-check.js` で欠損パスを確認
2. shared-workflows の `docs/VERSIONING.md` で Breaking Change を確認
3. 必要なら親プロジェクト側の参照パスを修正

## タグ運用との連携

shared-workflows は SemVer タグ（例: `v1.0.0`）を付与しています。
安定版に固定したい場合は、`.gitmodules` の `branch` を削除し、特定タグのコミットに固定してください。

```bash
git -C .shared-workflows checkout v1.0.0
git add .shared-workflows
git commit -m "chore: pin shared-workflows to v1.0.0"
```

詳細: [VERSIONING.md](./VERSIONING.md)
