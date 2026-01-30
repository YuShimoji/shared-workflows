# 斁E��化け修正ガイチE
こ�Eドキュメントでは、`shared-workflows` リポジトリで発生する文字化け�E問題と、その修正方法、Cursor エチE��タでの設定方法を説明します、E
## 問題�E原因

斁E��化けが発生する主な原因�E�E
1. **ファイルエンコーチE��ングの不一致**
   - ファイルぁEShift-JIS で保存されてぁE��
   - ファイルぁEBOM なぁEUTF-8 で保存されてぁE���E�Eindows で問題になりやすい�E�E   - ファイルぁEUTF-8 with BOM で保存されてぁE��ぁE
2. **エチE��タの設宁E*
   - Cursor のチE��ォルトエンコーチE��ング設定が適刁E��なぁE   - ファイルごとのエンコーチE��ング設定が異なめE
## 修正方況E
### 方況E: PowerShell スクリプトで一括修正

プロジェクトルートで以下を実行！E
```powershell
# スクリプトを実衁Epowershell -NoProfile -ExecutionPolicy Bypass -File scripts/fix-encoding.ps1 -TargetPath docs
```

**注愁E*: スクリプトが文字化けする場合�E、Cursor エチE��タでの手動修正�E�方況E�E�を使用してください、E
### 方況E: 個別ファイルの修正

特定�Eファイルのみ修正する場合！E
```powershell
# ファイルパスを指宁E$filePath = "docs/APPLY_TO_OTHER_PROJECTS_COMPLETE_GUIDE.md"
$content = Get-Content $filePath -Raw -Encoding UTF8
[System.IO.File]::WriteAllText($filePath, $content, [System.Text.UTF8Encoding]::new($true))
```

### 方況E: Cursor エチE��タで手動修正�E�最も確実！E
**スチE��プバイスチE��プ手頁E*:

1. **斁E��化けしてぁE��ファイルを開ぁE*
   - Cursor で `docs/APPLY_TO_OTHER_PROJECTS_COMPLETE_GUIDE.md` を開ぁE
2. **エンコーチE��ングを確誁E*
   - 画面**右丁E*のスチE�Eタスバ�Eを確誁E   - エンコーチE��ングが表示されてぁE���E�侁E `UTF-8`、`Shift JIS`、`Windows 1252` など�E�E
3. **エンコーチE��ングを変更**
   - 右下�EエンコーチE��ング表示めE*クリチE��**
   - メニューが表示されめE   - 、E*Save with Encoding**」を選抁E   - エンコーチE��ング一覧から、E*UTF-8 with BOM**」を選抁E   - ファイルが�E動的に保存される

4. **確誁E*
   - ファイルを閉じて再度開く�E�ECtrl + W` で閉じ、`Ctrl + P` でファイル名を入力して開く�E�E   - 斁E��化けが解消されてぁE��か確誁E   - 右下�EスチE�Eタスバ�Eに、E*UTF-8 with BOM**」と表示されてぁE��ことを確誁E
**画像での説昁E*:
- 右下スチE�Eタスバ�E: `UTF-8` ↁEクリチE�� ↁE`Save with Encoding` ↁE`UTF-8 with BOM` を選抁E
## Cursor エチE��タの設定（重要E��E
### 即座に実行すべき設宁E
**斁E��化けを防ぐため�E忁E��設宁E*:

1. **設定を開く**
   - キーボ�EドショートカチE��: `Ctrl + ,` (Windows/Linux) また�E `Cmd + ,` (Mac)
   - また�E、メニューから `File` > `Preferences` > `Settings`

2. **エンコーチE��ング設定を検索**
   - 設定画面の検索バ�Eに `encoding` と入劁E
3. **以下�E設定を変更**
   - **`Files: Encoding`**: `utf8` を選択（ドロチE�Eダウンから選択！E   - **`Files: Auto Guess Encoding`**: チェチE��ボックスめE*ON**にする

4. **設定を保孁E*
   - 設定�E自動保存されまぁE   - 設定画面を閉じる�E�ECtrl + ,` を�E度押す！E
### チE��ォルトエンコーチE��ングの設定（詳細�E�E
上記�E設定により、新規作�Eされるファイルは自動的に UTF-8 で保存されます、E
**設定頁E��の説昁E*:
- **`files.encoding`**: 新規ファイル作�E時�EチE��ォルトエンコーチE��ング
- **`files.autoGuessEncoding`**: 既存ファイルを開く際にエンコーチE��ングを�E動検�E�E�推奨: ON�E�E
### settings.json での設宁E
`.vscode/settings.json` また�E Cursor の設定ファイルに以下を追加�E�E
```json
{
  "files.encoding": "utf8",
  "files.autoGuessEncoding": true,
  "[markdown]": {
    "files.encoding": "utf8"
  }
}
```

### ワークスペ�Eス設宁E
プロジェクト固有�E設定を行う場合、`.vscode/settings.json` を作�E�E�E
```json
{
  "files.encoding": "utf8",
  "files.autoGuessEncoding": true,
  "files.eol": "\n"
}
```

## エンコーチE��ングの確認方況E
### PowerShell で確誁E
```powershell
# ファイルの先頭バイトを確認！EOM の有無を確認！E$bytes = [System.IO.File]::ReadAllBytes("docs/APPLY_TO_OTHER_PROJECTS_COMPLETE_GUIDE.md")[0..3]
$bytes | ForEach-Object { '{0:X2}' -f $_ }

# UTF-8 with BOM の場吁E EF BB BF が�E頭に来めE# UTF-8 without BOM の場吁E ファイル冁E��の先頭バイトが来めE```

### Cursor で確誁E
1. ファイルを開ぁE2. 右下�EスチE�Eタスバ�Eを確誁E   - `UTF-8` と表示されてぁE��場吁E BOM なぁEUTF-8
   - `UTF-8 with BOM` と表示されてぁE��場吁E BOM 付き UTF-8
   - `Shift JIS` などと表示されてぁE��場吁E そ�EエンコーチE��ングで保存されてぁE��

## 推奨設宁E
### プロジェクト�E体�E推奨設宁E
1. **`.editorconfig` の作�E**�E�推奨�E�E
プロジェクトルートに `.editorconfig` を作�E�E�E
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

2. **`.vscode/settings.json` の作�E**

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

## トラブルシューチE��ング

### 問顁E ファイルを開くと斁E��化けすめE
**解決筁E*:
1. 右下�EエンコーチE��ング表示を確誁E2. 「Reopen with Encoding」を選抁E3. 適刁E��エンコーチE��ング�E�通常は `UTF-8`�E�を選抁E4. ファイルを保存！ECtrl + S`�E�E5. 「Save with Encoding」で `UTF-8 with BOM` を選抁E
### 問顁E 保存後に斁E��化けすめE
**解決筁E*:
1. ファイルめE`UTF-8 with BOM` で再保孁E2. Cursor の設定で `files.encoding` めE`utf8` に設宁E3. `.editorconfig` を作�Eしてプロジェクト�E体�E設定を統一

### 問顁E Git で差刁E��正しく表示されなぁE
**解決筁E*:
1. `.gitattributes` を作�E�E�E
```
*.md text eol=lf encoding=utf-8
```

2. 既存ファイルを�Eエンコード！E
```bash
git add --renormalize .
git commit -m "Normalize line endings and encoding"
```

## 参老E��ンク

- [Cursor ドキュメンチE エンコーチE��ング設定](https://cursor.sh/docs)
- [EditorConfig 仕様](https://editorconfig.org/)
- [Git 属性: エンコーチE��ング](https://git-scm.com/docs/gitattributes)
