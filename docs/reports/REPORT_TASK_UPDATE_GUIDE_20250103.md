# Report: 改善提案実装タスク完了後の更新方法ガイド

**Timestamp**: 2025-01-03T00:00:00+09:00
**Actor**: Orchestrator
**Type**: Orchestrator
**Duration**: 0.2h
**Changes**: タスク完了後の更新方法ガイド作成

## 概要
- TASK_007（Worker完了レポートの必須ヘッダー自動補完）とTASK_008（Worker完了レポートの自動統合スクリプト作成）の実装完了後、どのように現在のプロジェクトで更新するかの手順を解説

## 現状
- 2つの実装タスクを起票済み（TASK_007, TASK_008）
- 各タスクはWorkerが実装し、完了後にリポジトリ更新依頼を出す流れで進める

## 次のアクション

### タスク完了後の更新手順

#### 1. Worker実装完了後の確認

各Workerが実装を完了したら、以下を確認：

**TASK_007完了時**:
- [ ] `docs/windsurf_workflow/WORKER_PROMPT_TEMPLATE.md` に「概要」「次のアクション」が追加されている
- [ ] `prompts/every_time/WORKER_COMPLETION_DRIVER.txt` に必須ヘッダーの明記が追加されている
- [ ] 既存のWorkerレポートで `report-validator.js` の警告が減少していることを確認

**TASK_008完了時**:
- [ ] `scripts/finalize-phase.js` にWorkerレポート統合機能が追加されている
- [ ] `docs/HANDOVER.md` の「統合レポート」セクションにWorkerレポートのサマリーが自動追加されることを確認
- [ ] 実際のWorkerレポートで動作確認が完了している

#### 2. リポジトリ更新依頼の出し方

**shared-workflows リポジトリ（サブモジュール）への更新が必要な場合**:

1. **変更ファイルの確認**:
   - 変更が `.shared-workflows/` 配下のファイル（例: `docs/windsurf_workflow/WORKER_PROMPT_TEMPLATE.md`）に含まれる場合
   - または `prompts/every_time/WORKER_COMPLETION_DRIVER.txt` など、サブモジュール内のファイル

2. **サブモジュール内でコミット**:
   ```bash
   cd .shared-workflows
   git add <変更ファイル>
   git commit -m "feat: Workerレポート必須ヘッダー自動補完機能追加 (TASK_007)"
   # または
   git commit -m "feat: Workerレポート自動統合機能追加 (TASK_008)"
   ```

3. **サブモジュールのリモートにpush**:
   ```bash
   git push origin main
   ```

4. **親リポジトリ（現在のプロジェクト）でサブモジュール参照を更新**:
   ```bash
   cd ..  # プロジェクトルートに戻る
   git add .shared-workflows
   git commit -m "chore: shared-workflows submodule更新 (TASK_007/TASK_008完了)"
   ```

5. **リポジトリ更新依頼の作成**:
   - GitHubでPull Requestを作成
   - タイトル: `[shared-workflows] Workerレポート改善機能追加 (TASK_007/TASK_008)`
   - 説明: 実装内容、変更ファイル、動作確認結果を記載

**プロジェクト側（現在のリポジトリ）のみの更新の場合**:

1. **変更ファイルの確認**:
   - 変更が `scripts/finalize-phase.js` など、プロジェクト側のファイルのみの場合

2. **プロジェクト側でコミット**:
   ```bash
   git add scripts/finalize-phase.js
   git commit -m "feat: Workerレポート自動統合機能追加 (TASK_008)"
   ```

3. **リモートにpush**:
   ```bash
   git push origin main
   ```

#### 3. 更新後の検証

リポジトリ更新後、以下を確認：

1. **システム健全性チェック**:
   ```bash
   node scripts/sw-doctor.js --profile shared-orch-bootstrap --format text
   ```

2. **実装機能の動作確認**:
   - TASK_007: 新しいWorkerレポートで `report-validator.js` を実行し、警告が減少していることを確認
   - TASK_008: `finalize-phase.js` を実行し、HANDOVER.mdにWorkerレポートが自動統合されることを確認

3. **ドキュメント更新**:
   - `docs/HANDOVER.md` のバックログから完了した項目を削除
   - `AI_CONTEXT.md` のタスク管理セクションを更新

#### 4. 他プロジェクトへの展開

shared-workflows リポジトリに更新が反映された場合、他のプロジェクトでも更新を取得：

```bash
# サブモジュールを更新
git submodule sync --recursive
git submodule update --init --recursive --remote

# または、特定のサブモジュールのみ更新
cd .shared-workflows
git pull origin main
cd ..
git add .shared-workflows
git commit -m "chore: shared-workflows submodule更新"
```

## ガイド

### 各エージェントへの依頼方法

**Worker実装依頼**:
- TASK_007 と TASK_008 をそれぞれWorkerに割り当て
- Workerプロンプトに以下を含める:
  - 実装対象ファイル
  - 参考にする既存コード（`report-orch-cli.js` など）
  - 完了後の検証方法

**リポジトリ更新依頼**:
- Worker実装完了後、変更内容を確認
- サブモジュール更新が必要な場合は、shared-workflows リポジトリへのPR作成を依頼
- プロジェクト側のみの更新の場合は、現在のリポジトリへのPR作成を依頼

### 注意事項

1. **後方互換性の維持**:
   - 既存のレポートフォーマットとの整合性を確認
   - 既存のスクリプトの動作を破壊しない

2. **テストの実施**:
   - 実装後、実際のWorkerレポートで動作確認
   - `sw-doctor.js` でシステム健全性を確認

3. **ドキュメント更新**:
   - 変更内容を `docs/HANDOVER.md` に反映
   - `AI_CONTEXT.md` のタスク管理セクションを更新

## メタプロンプト再投入条件

- TASK_007 と TASK_008 の実装完了後、動作確認が完了した時点で再投入

## 改善提案（New Feature Proposal）

- **Workerレポートテンプレートの自動生成機能（優先度: Low）**: Workerプロンプト生成時に、必須ヘッダーを含むテンプレートを自動生成する機能を追加することで、さらに警告を事前に防げる可能性がある

## Verification

- `node scripts/report-validator.js docs/inbox/REPORT_TASK_UPDATE_GUIDE_20250103.md` → 実行予定
- `git status -sb` → クリーン
- push: pending

## Integration Notes

- 本レポートはタスク完了後の更新方法を解説
- TASK_007 と TASK_008 の実装完了後、このガイドに従って更新を実施
