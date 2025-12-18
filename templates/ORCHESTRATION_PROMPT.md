# Orchestration Prompt

## 目的

- このファイルは、プロジェクトでAI開発を回すための **オーケストレーション用プロンプト**です。
- 各プロジェクトでは、本ファイルをプロジェクトルートに `ORCHESTRATION_PROMPT.md` として配置して運用します（任意）。

## 最初に必ず読むもの（優先順）

1. SSOT（最新版ルール / 固定参照先）
   - 例: `YuShimoji/shared-workflows` の `docs/Windsurf_AI_Collab_Rules_latest.md`
   - 例: 社内Wikiの固定URL（常に最新版へ解決されるもの）
2. プロジェクトルートの `AI_CONTEXT.md`
3. プロジェクトルートの `ORCHESTRATION_PROMPT.md`（本ファイル。運用している場合）

## 進め方（最小）

- Issue（Goal/DoD/影響/リスク(Tier)）を起点に進める
- 作業の区切りごとに `AI_CONTEXT.md` を更新し、会話に依存せず再開可能にする
- クリーンアップチェック → Pre-flight → コミット（必要に応じてプッシュ）

## コマンド実行ポリシー（高速化 / 標準）

- **原則**: ローカルで安全なコマンドは AI が自律実行してよい（作業を止めない）
  - 例: 読み取り/検索/差分確認/静的解析/テスト/ビルド/フォーマット（プロジェクト内に閉じる範囲）
- **例外**: 以下に該当する場合は事前承認を取る
  - **外部通信**（例: `git fetch/pull/push`、パッケージ取得、外部API呼び出し。※ GitHub操作を自動承認する運用なら承認待ちで停止しない）
  - **破壊的/復旧困難な操作**（例: 削除、強制上書き、`reset`、`rebase`、`force push`）
  - **依存関係の追加/更新**（例: `npm install`、`pip install`）
  - **長時間/高負荷/大量出力が見込まれる操作**（目安: 数分以上、または大量ログ）

### 運用オプション: GitHub操作を自動承認する

プロジェクトの運用として「普段から push・PR作成・マージまで自動承認」する場合は、外部通信（`git fetch/pull/push` 等）や GitHub 操作について **承認待ちで停止しない** ことを優先します。

- 条件: 実行環境（ツール設定/CI権限/ルール）側で、自動承認が有効
- この場合の扱い: `git fetch/pull/push` や PR作成/マージ等は、都度の確認を省略して自律実行してよい
- ただし、`force push` / `rebase` / `reset` のような履歴破壊・復旧困難な操作は、必要なら方針確認を取る

### 承認が必要な場合の提示フォーマット（推奨）

AI は次の情報をまとめ、可能な限り **ワンストップ（1回の承認）**で実行できる形で提示します。

- **目的**: 何のために実行するか
- **実行内容**: 何をするか（概要）
- **コマンド一覧**: 実行順に列挙（必要に応じて / 省略可）
- **期待される変更**: ファイル変更の有無、外部通信の有無
- **リスク（Tier）**: 低/中/高（目安）

## レポート（推奨）

- `AI_CONTEXT.md` の `report_style` / `mode` を尊重する
- 重要な結論/決定/リスク/次アクションは、チャットで完結させず `AI_CONTEXT.md` に転記する

---

## デモ: 返ってくるメッセージと対応

### デモ1: 外部通信が必要（push）

#### ユーザーからの依頼

- 「変更をコミットしてpushまでお願いします」

#### AIの応答（例）

- 変更の概要と影響範囲を1段落で説明
- 外部通信（`git push`）がある
  - GitHub操作が自動承認の運用なら、そのまま実行する
  - 自動承認でない運用なら、承認を取る
- 1回の承認で「コミット→push」までをまとめて実行する（必要ならコマンド詳細も併記）

#### 実行後に返ってくるメッセージ（例）

```text
## main...origin/main
[main 1234567] docs: ...
 3 files changed, 10 insertions(+), 2 deletions(-)
To github.com:org/repo.git
   abcdef0..1234567  main -> main
```

#### AIの対応（例）

- `git status` が `main...origin/main` であることを確認
- 変更点（どのファイルがどう変わったか）と、次の作業（TODOの次）を提示
- `AI_CONTEXT.md` を更新すべき内容があれば反映を促す

### デモ2: pushが拒否される（behind / non-fast-forward）

#### 実行後に返ってくるメッセージ（例）

```text
! [rejected]        main -> main (non-fast-forward)
error: failed to push some refs
hint: Updates were rejected because the remote contains work that you do
hint: not have locally.
```

#### AIの対応（例）

- 原因: リモートに新しいコミットがあり、手元がbehind
- 方針の選択肢を提示
  - `git pull --rebase`（履歴を直線化）
  - `git pull`（マージコミット）
- どちらも外部通信/履歴変更を含むため、承認を取ってからワンストップで実行する
