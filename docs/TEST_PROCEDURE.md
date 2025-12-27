# Test Procedure for Shared Workflows

## 目的
shared-workflows の自己修復スクリプト群が、他プロジェクトでも正常に動作することを確認する。

## 前提条件
- Node.js がインストールされている
- Git がインストールされている
- PowerShell または bash が利用可能

## テスト環境の準備

### 1. テスト用プロジェクトディレクトリの作成
```powershell
# PowerShell
New-Item -ItemType Directory -Path C:\temp\test-project\docs\tasks -Force
New-Item -ItemType Directory -Path C:\temp\test-project\docs\inbox -Force

# または bash
mkdir -p /tmp/test-project/docs/{tasks,inbox}
```

### 2. テンプレートファイルのコピー
```powershell
# PowerShell
Copy-Item "shared-workflows-1\templates\AI_CONTEXT.md" "C:\temp\test-project\AI_CONTEXT.md"
Copy-Item "shared-workflows-1\docs\windsurf_workflow\HANDOVER_TEMPLATE.md" "C:\temp\test-project\docs\HANDOVER.md"
Copy-Item "shared-workflows-1\REPORT_CONFIG.yml" "C:\temp\test-project\REPORT_CONFIG.yml"

# または bash
cp shared-workflows-1/templates/AI_CONTEXT.md /tmp/test-project/AI_CONTEXT.md
cp shared-workflows-1/docs/windsurf_workflow/HANDOVER_TEMPLATE.md /tmp/test-project/docs/HANDOVER.md
cp shared-workflows-1/REPORT_CONFIG.yml /tmp/test-project/REPORT_CONFIG.yml
```

### 3. Git リポジトリの初期化
```powershell
# PowerShell
cd C:\temp\test-project
git init
git config user.email "test@example.com"
git config user.name "Test User"
git add .
git commit -m "Initial commit"
```

## テスト実行

### Test 1: sw-doctor.js の動作確認
```powershell
# PowerShell
cd C:\temp\test-project
node "c:\Users\thank\Storage\Media Contents Projects\shared-workflows-1\scripts\sw-doctor.js"
```

**期待結果:**
- Environment Check で全項目が `✓` で表示される
- Script Availability で全スクリプトが見つからない警告が出る（テスト用プロジェクトには scripts/ がないため）
- Repair Suggestions で「No issues detected」が表示される

### Test 2: orchestrator-audit.js の動作確認
```powershell
# PowerShell
cd C:\temp\test-project
node "c:\Users\thank\Storage\Media Contents Projects\shared-workflows-1\scripts\orchestrator-audit.js" --no-fail
```

**期待結果:**
- Orchestrator Audit Results が表示される
- tasks: 0, reports: 0 と表示される
- OK で終了する

### Test 3: report-validator.js の動作確認
```powershell
# PowerShell
cd C:\temp\test-project
node "c:\Users\thank\Storage\Media Contents Projects\shared-workflows-1\scripts\report-validator.js" docs/HANDOVER.md REPORT_CONFIG.yml .
```

**期待結果:**
- Validation for docs/HANDOVER.md: OK が表示される
- handover プロファイルが自動適用され、標準ヘッダー警告が出ない

### Test 4: ensure-ssot.js の動作確認（--no-fail フラグ）
```powershell
# PowerShell
cd C:\temp\test-project
node "c:\Users\thank\Storage\Media Contents Projects\shared-workflows-1\scripts\ensure-ssot.js" --no-fail
```

**期待結果:**
- shared-workflows が見つからない警告が出る
- --no-fail フラグにより、エラーで終了せず警告で継続する
- Exit code: 0

### Test 5: todo-leak-preventer.js の動作確認
```powershell
# PowerShell
cd C:\temp\test-project
node "c:\Users\thank\Storage\Media Contents Projects\shared-workflows-1\scripts\todo-leak-preventer.js"
```

**期待結果:**
- AI_CONTEXT.md の Backlog セクションを解析
- 未完了タスク（`- [ ]` 形式）を検出して警告を出す

### Test 6: dev-check.js の動作確認
```powershell
# PowerShell
cd C:\temp\test-project
node "c:\Users\thank\Storage\Media Contents Projects\shared-workflows-1\scripts\dev-check.js"
```

**期待結果:**
- Running shared workflow diagnostics... が表示される
- 複数のスクリプトが順序実行される
- 個別スクリプトが失敗しても全体は継続する
- All shared workflow scripts executed successfully. で終了する

## トラブルシューティング

### Test が失敗した場合
1. **スクリプトが見つからない**
   - shared-workflows-1 のパスが正しいか確認
   - Node.js がインストールされているか確認: `node --version`

2. **Git エラー**
   - テスト用プロジェクトが Git リポジトリか確認: `git status`
   - Git ユーザーが設定されているか確認: `git config user.name`

3. **ファイルが見つからない**
   - テンプレートファイルがコピーされているか確認
   - パスが正しいか確認（PowerShell では大文字小文字を区別しない）

## 運用ループの確認

### 完全なワークフロー（本番環境での使用）
1. **初期化フェーズ**
   ```powershell
   node scripts/sw-doctor.js
   ```

2. **監査フェーズ**
   ```powershell
   node scripts/orchestrator-audit.js --no-fail
   node scripts/dev-check.js
   ```

3. **修復フェーズ（必要に応じて）**
   ```powershell
   node scripts/ensure-ssot.js --no-fail
   git submodule sync --recursive
   git submodule update --init --recursive --remote
   ```

4. **検証フェーズ**
   ```powershell
   node scripts/report-validator.js docs/HANDOVER.md REPORT_CONFIG.yml .
   ```

## 成功基準
- [ ] sw-doctor.js が環境チェックを完了
- [ ] orchestrator-audit.js が --no-fail で動作
- [ ] report-validator.js が handover プロファイルを自動適用
- [ ] ensure-ssot.js が --no-fail で警告で継続
- [ ] todo-leak-preventer.js が Backlog を正確に解析
- [ ] dev-check.js が全スクリプトを順序実行
- [ ] テスト用プロジェクトで全テストが成功

## 注記
- テスト用プロジェクトは本番環境ではなく、動作確認用のみ
- 実際の運用では、shared-workflows を submodule として導入することを推奨
- 各スクリプトは --no-fail フラグで警告で継続する設計になっている
