# パターン: 優良 Worker レポートの実例

Worker が納品するレポートの理想形を示すサンプル。

---

## 完成版レポート例

```markdown
# Report: TASK_007_RefactorApiHandler

**Timestamp**: 2026-02-06T12:00:00+09:00
**Actor**: Worker
**Ticket**: docs/tasks/TASK_007_RefactorApiHandler.md
**Type**: Worker
**Duration**: 1.5h
**Changes**: 3 files changed, 45 insertions(+), 20 deletions(-)

## 概要
- API ハンドラーのエラーレスポンス形式を統一し、ユーザー向けメッセージを返すように修正

## Changes
- src/api/handler.ts: エラーレスポンスを統一フォーマット `{ error: string, code: number }` に変更
- src/utils/errorFormatter.ts: 新規作成。エラーメッセージのフォーマット関数
- tests/api/handler.test.ts: 500系エラー時のレスポンス検証テスト追加

## 変更マップ（Mermaid）

graph TD
    A[src/api/handler.ts] -->|uses| B[src/utils/errorFormatter.ts]
    A -->|tested by| C[tests/api/handler.test.ts]
    B -->|tested by| D[tests/utils/errorFormatter.test.ts]
    style A fill:#ff9,stroke:#333
    style B fill:#ff9,stroke:#333
    style C fill:#9f9,stroke:#333
    style D fill:#9f9,stroke:#333

## Before/After

- Before: `res.status(500).send('Internal Server Error')`
- After: `res.status(500).json(formatError('サーバーエラーが発生しました', 500))`
- 影響: クライアントが JSON 形式で統一的にエラーを受け取れるようになった

## Decisions
- errorFormatter を別ファイルに分離: 単一責任原則に基づき、ハンドラーとフォーマットロジックを分離
- エラーメッセージを日本語: 現時点では i18n 未導入のため、後続タスクで外部化を検討

## Verification
- npm test=PASS (12 tests, 0 failures)
- npm run lint=PASS (0 errors, 0 warnings)
- git status -sb=clean

## Risk
- i18n 未導入のため、エラーメッセージが日本語ハードコード（後続タスクで PATTERN_data_externalization を適用予定）

## Remaining
- なし

## Handover
- errorFormatter のテキスト外部化は次タスクで対応予定（DESIGN_PRINCIPLES.md 参照）

## 次のアクション
- ★★★ TASK_008 でエラーメッセージの i18n 外部化を実施
- ★★☆ TASK_009 で API 統合テストを追加

## Proposals
- エラーコード体系の標準化（現在はHTTPステータスコードをそのまま使用）
```

---

## チェックポイント

レポートが以下を満たしているか確認:

- [ ] 全必須セクション（概要/Changes/変更マップ/Verification/Risk/Remaining/Handover/次のアクション）が存在
- [ ] 変更マップが Mermaid 図で記載されている
- [ ] Verification に実行コマンドと結果が `<cmd>=<result>` 形式で記載
- [ ] Risk に潜在的なリスクが記載（「なし」も明記）
- [ ] 次のアクションに推奨度（★）が付いている
- [ ] Before/After が重要な変更に対して記載されている（任意だが推奨）

## 関連ドキュメント

- `docs/windsurf_workflow/WORKER_PROMPT_TEMPLATE.md` — レポートフォーマット定義
- `templates/diagrams/change-map.md` — 変更マップ図テンプレート
- `templates/DESIGN_PRINCIPLES.md` — 設計原則
