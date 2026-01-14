# 文字化け修正ガイド

このドキュメントでは、`shared-workflows` リポジトリで発生する文字化けの問題と、その修正方法、Cursor エディタでの設定方法を説明します。

## 問題の原因

文字化けが発生する主な原因：

1. **ファイルエンコーディングの不一致**
   - ファイルが Shift-JIS で保存されている
   - ファイルが BOM なし UTF-8 で保存されている（Windows で問題になりやすい）
   - ファイルが UTF-8 with BOM で保存されていない

2. **エディタの設定**
   - Cursor のデフォルトエンコーディング設定が適切でない
   - ファイルごとのエンコーディング設定が異なる

## 修正方法

### 方法1: PowerShell スクリプトで一括修正

プロジェクトルートで以下を実行：

```powershell
# スクリプトを実行
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/fix-encoding.ps1 -TargetPath docs
```

**注意**: スクリプトが文字化けする場合は、Cursor エディタでの手動修正（方法3）を使用してください。

### 方法2: 個別ファイルの修正

特定のファイルのみ修正する場合：

```powershell
# ファイルパスを指定
$filePath = "docs/APPLY_TO_OTHER_PROJECTS_COMPLETE_GUIDE.md"
$content = Get-Content $filePath -Raw -Encoding UTF8
[System.IO.File]::WriteAllText($filePath, $content, [System.Text.UTF8Encoding]::new($true))
```

### 方法3: Cursor エディタで手動修正（最も確実）

**ステップバイステップ手順**:

1. **文字化けしているファイルを開く**
   - Cursor で `docs/APPLY_TO_OTHER_PROJECTS_COMPLETE_GUIDE.md` を開く

2. **エンコーディングを確認**
   - 画面**右下**のステータスバーを確認
   - エンコーディングが表示されている（例: `UTF-8`、`Shift JIS`、`Windows 1252` など）

3. **エンコーディングを変更**
   - 右下のエンコーディング表示を**クリック**
   - メニューが表示される
   - 「**Save with Encoding**」を選択
   - エンコーディング一覧から「**UTF-8 with BOM**」を選択
   - ファイルが自動的に保存される

4. **確認**
   - ファイルを閉じて再度開く（`Ctrl + W` で閉じ、`Ctrl + P` でファイル名を入力して開く）
   - 文字化けが解消されているか確認
   - 右下のステータスバーに「**UTF-8 with BOM**」と表示されていることを確認

**画像での説明**:
- 右下ステータスバー: `UTF-8` → クリック → `Save with Encoding` → `UTF-8 with BOM` を選択

## Cursor エディタの設定（重要）

### 即座に実行すべき設定

**文字化けを防ぐための必須設定**:

1. **設定を開く**
   - キーボードショートカット: `Ctrl + ,` (Windows/Linux) または `Cmd + ,` (Mac)
   - または、メニューから `File` > `Preferences` > `Settings`

2. **エンコーディング設定を検索**
   - 設定画面の検索バーに `encoding` と入力

3. **以下の設定を変更**
   - **`Files: Encoding`**: `utf8` を選択（ドロップダウンから選択）
   - **`Files: Auto Guess Encoding`**: チェックボックスを**ON**にする

4. **設定を保存**
   - 設定は自動保存されます
   - 設定画面を閉じる（`Ctrl + ,` を再度押す）

### デフォルトエンコーディングの設定（詳細）

上記の設定により、新規作成されるファイルは自動的に UTF-8 で保存されます。

**設定項目の説明**:
- **`files.encoding`**: 新規ファイル作成時のデフォルトエンコーディング
- **`files.autoGuessEncoding`**: 既存ファイルを開く際にエンコーディングを自動検出（推奨: ON）

### settings.json での設定

`.vscode/settings.json` または Cursor の設定ファイルに以下を追加：

```json
{
  "files.encoding": "utf8",
  "files.autoGuessEncoding": true,
  "[markdown]": {
    "files.encoding": "utf8"
  }
}
```

### ワークスペース設定

プロジェクト固有の設定を行う場合、`.vscode/settings.json` を作成：

```json
{
  "files.encoding": "utf8",
  "files.autoGuessEncoding": true,
  "files.eol": "\n"
}
```

## エンコーディングの確認方法

### PowerShell で確認

```powershell
# ファイルの先頭バイトを確認（BOM の有無を確認）
$bytes = [System.IO.File]::ReadAllBytes("docs/APPLY_TO_OTHER_PROJECTS_COMPLETE_GUIDE.md")[0..3]
$bytes | ForEach-Object { '{0:X2}' -f $_ }

# UTF-8 with BOM の場合: EF BB BF が先頭に来る
# UTF-8 without BOM の場合: ファイル内容の先頭バイトが来る
```

### Cursor で確認

1. ファイルを開く
2. 右下のステータスバーを確認
   - `UTF-8` と表示されている場合: BOM なし UTF-8
   - `UTF-8 with BOM` と表示されている場合: BOM 付き UTF-8
   - `Shift JIS` などと表示されている場合: そのエンコーディングで保存されている

## 推奨設定

### プロジェクト全体の推奨設定

1. **`.editorconfig` の作成**（推奨）

プロジェクトルートに `.editorconfig` を作成：

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
charset = utf-8
```

2. **`.vscode/settings.json` の作成**

```json
{
  "files.encoding": "utf8",
  "files.autoGuessEncoding": true,
  "files.eol": "\n",
  "[markdown]": {
    "files.encoding": "utf8"
  }
}
```

## トラブルシューティング

### 問題: ファイルを開くと文字化けする

**解決策**:
1. 右下のエンコーディング表示を確認
2. 「Reopen with Encoding」を選択
3. 適切なエンコーディング（通常は `UTF-8`）を選択
4. ファイルを保存（`Ctrl + S`）
5. 「Save with Encoding」で `UTF-8 with BOM` を選択

### 問題: 保存後に文字化けする

**解決策**:
1. ファイルを `UTF-8 with BOM` で再保存
2. Cursor の設定で `files.encoding` を `utf8` に設定
3. `.editorconfig` を作成してプロジェクト全体の設定を統一

### 問題: Git で差分が正しく表示されない

**解決策**:
1. `.gitattributes` を作成：

```
*.md text eol=lf encoding=utf-8
```

2. 既存ファイルを再エンコード：

```bash
git add --renormalize .
git commit -m "Normalize line endings and encoding"
```

## 参考リンク

- [Cursor ドキュメント: エンコーディング設定](https://cursor.sh/docs)
- [EditorConfig 仕様](https://editorconfig.org/)
- [Git 属性: エンコーディング](https://git-scm.com/docs/gitattributes)
