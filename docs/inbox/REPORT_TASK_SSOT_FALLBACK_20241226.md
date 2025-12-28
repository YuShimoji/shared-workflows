# SSOT バージョンフォールバック対応レポート

**Report ID**: REPORT_TASK_SSOT_FALLBACK_20241226  
**Date**: 2024-12-26  
**Profile**: task  
**Status**: COMPLETED

## 概要

shared-workflows サブモジュールのバージョン差異（v1.1 のみを持つ古いコミット vs v2.0/latest を持つ新しいコミット）により、Kickstart セットアップが「SSOT ファイルが見つからない」エラーで失敗する問題を修正しました。

## 実施内容

### 1. プロンプト群の修正

全てのプロンプトファイルに SSOT バージョンフォールバック順序（`latest` → `v2.0` → `v1.1`）を明記し、最初に見つかったファイルを基準ルールとして扱うよう変更。

**修正ファイル**:
- `prompts/first_time/PROJECT_KICKSTART.txt`
- `prompts/first_time/PROJECT_KICKSTART_RESUME.txt`
- `prompts/every_time/ORCHESTRATOR_METAPROMPT.txt`
- `prompts/every_time/ORCHESTRATOR_RESUME.txt`

**変更内容**:
```
最優先で読むもの（SSOT 参照順序）:
- サブモジュールがある場合: `.shared-workflows/docs/Windsurf_AI_Collab_Rules_latest.md` → 無ければ `.shared-workflows/docs/Windsurf_AI_Collab_Rules_v2.0.md` → 無ければ `.shared-workflows/docs/Windsurf_AI_Collab_Rules_v1.1.md`
- サブモジュールが無い場合: `docs/Windsurf_AI_Collab_Rules_v2.0.md` → 無ければ `docs/Windsurf_AI_Collab_Rules_v1.1.md`
- **重要**: 上記 SSOT のうち最初に見つかったファイルを「このセットアップの基準ルール」として扱い、バージョン違いでエラーにしない
```

### 2. スクリプトの修正

**`scripts/ensure-ssot.js`**:
```javascript
const FILES = [
  'docs/Windsurf_AI_Collab_Rules_latest.md',
  'docs/Windsurf_AI_Collab_Rules_v2.0.md',
  'docs/Windsurf_AI_Collab_Rules_v1.1.md'  // 追加
];
```

**`scripts/sw-doctor.js`**:
```javascript
// Check SSOT files (fallback order: latest -> v2.0 -> v1.1)
const ssotFiles = [
  'docs/Windsurf_AI_Collab_Rules_latest.md',
  'docs/Windsurf_AI_Collab_Rules_v2.0.md',
  'docs/Windsurf_AI_Collab_Rules_v1.1.md'  // 追加
];
```

### 3. ドキュメントの更新

**`docs/CENTRAL_REPO_REF.md`**:
- SSOT バージョンフォールバック順序セクションを追加
- フォールバック戦略の詳細説明を記載

**`docs/CLIENT_PROJECT_DOCTOR_GUIDE.md`**:
- SSOT ファイルのバージョン差異についての注意書きを追加

### 4. テスト結果

#### ローカルテスト（shared-workflows-1 リポジトリ内）

```bash
# ensure-ssot.js のヘルプ表示
$ node scripts/ensure-ssot.js --help
✓ 正常動作確認

# sw-doctor.js の bootstrap プロファイル実行
$ node scripts/sw-doctor.js --profile shared-orch-bootstrap --format text
✓ SSOT docs/Windsurf_AI_Collab_Rules_latest.md exists
✓ SSOT docs/Windsurf_AI_Collab_Rules_v2.0.md exists
✓ No issues detected. System is healthy.
```

## 修正前の問題

### 症状
- WritingPage などクライアントプロジェクトで Kickstart セットアップ実行時に、「`docs/Windsurf_AI_Collab_Rules_v2.0.md` が見つからない」エラーが発生
- 実際にはサブモジュールに `v1.1.md` のみが存在していた

### 原因
1. プロンプトが `v2.0.md` または `latest.md` を前提に記述されていた
2. クライアントプロジェクトのサブモジュールが古いコミット（v0.1.0 系）を指しており、`v1.1.md` しか含まれていなかった
3. `ensure-ssot.js` と `sw-doctor.js` が `v1.1.md` をフォールバック対象に含めていなかった

## 修正後の動作

### 期待される動作
1. Kickstart プロンプト実行時、SSOT ファイルを `latest` → `v2.0` → `v1.1` の順で探索
2. 最初に見つかったファイルを「基準ルール」として扱い、セットアップを続行
3. `ensure-ssot.js` は利用可能な全バージョンのコピーを試行
4. `sw-doctor.js` は全バージョンの存在を確認し、少なくとも1つあれば正常と判定

### 次のステップ

#### 必須: クライアントプロジェクトでの動作確認
1. WritingPage プロジェクトで Kickstart プロンプト（`PROJECT_KICKSTART.txt`）を実行
2. v1.1 のみを持つサブモジュールで正常にセットアップが完了することを確認
3. エラーが発生しないことを確認

#### オプション: サブモジュール更新戦略の検討
- クライアントプロジェクトのサブモジュールを最新コミットに更新するか
- v1.1 ベースでの運用を継続するか

## コミット履歴

```bash
# Commit 1: プロンプトとドキュメントの修正
commit 7ead429
fix: add SSOT version fallback to all prompts (latest -> v2.0 -> v1.1)

# Commit 2: スクリプトの修正
commit ed71ba5
fix: add v1.1 fallback support to ensure-ssot and sw-doctor
```

## 関連ファイル

### 修正されたファイル
- `@c:\Users\thank\Storage\Media Contents Projects\shared-workflows-1\prompts\first_time\PROJECT_KICKSTART.txt:6-10`
- `@c:\Users\thank\Storage\Media Contents Projects\shared-workflows-1\prompts\first_time\PROJECT_KICKSTART_RESUME.txt:6`
- `@c:\Users\thank\Storage\Media Contents Projects\shared-workflows-1\prompts\every_time\ORCHESTRATOR_METAPROMPT.txt:91`
- `@c:\Users\thank\Storage\Media Contents Projects\shared-workflows-1\prompts\every_time\ORCHESTRATOR_RESUME.txt:7`
- `@c:\Users\thank\Storage\Media Contents Projects\shared-workflows-1\scripts\ensure-ssot.js:5-9`
- `@c:\Users\thank\Storage\Media Contents Projects\shared-workflows-1\scripts\sw-doctor.js:159`
- `@c:\Users\thank\Storage\Media Contents Projects\shared-workflows-1\docs\CENTRAL_REPO_REF.md:9-17`
- `@c:\Users\thank\Storage\Media Contents Projects\shared-workflows-1\docs\CLIENT_PROJECT_DOCTOR_GUIDE.md:9`

### 参照ドキュメント
- `docs/CENTRAL_REPO_REF.md`: フォールバック戦略の詳細
- `docs/CLIENT_PROJECT_DOCTOR_GUIDE.md`: クライアントプロジェクト向け利用ガイド
- `docs/windsurf_workflow/OPEN_HERE.md`: 運用者向け入口ガイド

## 今後の改善提案

1. **自動バージョン検出スクリプト**: サブモジュールの実際の SSOT バージョンを検出し、適切なフォールバックパスを自動生成するヘルパースクリプトの追加
2. **バージョン互換性マトリクス**: 各 SSOT バージョン間の互換性と推奨アップグレードパスをドキュメント化
3. **CI での検証**: 複数バージョンの SSOT を用いた Kickstart フローの自動テスト

---

**Report Status**: ✓ COMPLETED  
**Next Action**: WritingPage プロジェクトでの動作確認
