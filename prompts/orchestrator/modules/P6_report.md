# Phase 6: Orchestrator Report（保存/検証/提案）

> **Override Notice**
> このモジュールは旧フェーズ体系用です。現在は `ORCHESTRATOR_DRIVER.txt` が最上位ルールです。
> `docs/WORKFLOW_STATE_SSOT.md` の禁止事項にレポート整備が含まれる場合: report-validator 実行は不要、出力は 3 セクション形式（状態/次/判断理由）を使用。

## 目的

- 状態を確定させ、次の行動が迷わない形で残す（“一度きりで終わる”を防ぐ）
- Complete Gate 相当の検証を通し、虚偽完了を防ぐ

## 手順

1. レポート保存（ファイル）
   - `templates/ORCHESTRATOR_REPORT_TEMPLATE.md` をベースに `docs/inbox/REPORT_ORCH_<ISO8601>.md` を作成

2. 検証（必須）
   - `report-validator.js` を実行し、成功/失敗/警告をレポートへ追記
   - HANDOVER も検証対象にする（可能なら `--profile handover`）
   - Worker レポートの `MCP_CONNECTIVITY` / `Verification Mode` / `Manual Pending Items` を確認する
   - `Manual Pending` が残る、または `MCP_CONNECTIVITY=UNAVAILABLE` で実測不足のタスクは `DONE` を取り消し、`IN_PROGRESS` または `BLOCKED` へ差し戻す
   - 実測タスクが Layer A/B に分割されていない場合は差し戻し、Layer A/B を追記して再評価する
   - 同一 Blocker が継続している場合は新規タスク再提案を禁止し、ユーザー手順提示へ切り替える

3. Inbox整理（可能なら）
   - `finalize-phase.js` が使える場合は優先
   - 使えない場合は `docs/inbox/REPORT_*.md` を `docs/reports/` に移動（必要なら commit）

4. MISSION_LOG 更新（必須）
   - Phase 6 完了として記録
   - 次フェーズ/次アクション（担当込み）を必ず記録
   - 改善提案も記録（プロジェクト側とShared Workflow側を分離）
   - 差し戻しが発生した場合は「なぜ完了不適合だったか（MCP未接続/手動pending/証跡不足）」を明記する

4.5. **マイルストーン更新**（必須）
   - `docs/MILESTONE_PLAN.md` の短期/中期/長期目標の進捗を更新
   - 完了したマイルストーンがあれば状態を「完了」に変更
   - 5タスク完了またはマイルストーン達成時: KPT振り返りを実施し「振り返りログ」に追記

5. 改善提案の生成（必須）
   - プロジェクト側の改善提案: プロジェクト固有の機能改善や要件を対象とする
   - Shared Workflow側の改善提案: 共通ワークフローやツールの改善を対象とする
   - 各提案には優先度（High/Medium/Low）と状態（設計済み/準備完了/未着手など）を明記

6. 次のアクション選択肢の生成（必須）
   - `docs/tasks/` からOPEN/IN_PROGRESSタスクを読み込み
   - 優先度と依存関係を考慮して選択肢を生成
   - 推奨度をランク付け（⭐⭐⭐ 推奨 / ⭐⭐ 検討 / ⭐ 低優先度）
   - タスクの性質に応じたアイコンを付与（🎨 UI, 🧪 テスト, 🚫 ブロッカー, 🐛 バグ修正, ✨ 機能実装, 📝 ドキュメント, 🔧 リファクタリング, ⚙️ CI/CD, 📋 その他）
   - 現在積み上がっているタスクとの連携を明記
   - 同一準備を2回実施済みのタスクは、3回目に準備再提案せず Layer A完了/Layer B引き渡しを提示する

7. 進捗バーの生成（推奨）
   - `scripts/progress-meter.js` を実行し、進捗情報を取得
   - チャット出力の「現状」セクションに進捗バーを埋め込む（Markdown形式）
   - または、レポートファイルの「現状」セクションに進捗バーを追加

## チャット出力（固定5セクションのみ）

必ず以下の5セクションだけを、この順番で出力する。追加セクションは禁止。

1. `## 現状` — **必須: Mermaid 図（pie or gantt）でタスク進捗を可視化** + 進捗バー（■□） + **マイルストーン現在地**（「中期目標 MG-1 の 60% 地点」のようにゴールとの距離を表現）
2. `## 次のアクション` — ユーザー返信テンプレ必須（タスクアイコン + 推奨度★） + **マイルストーンへの貢献度**を併記
3. `## ガイド` — **必須: Mermaid flowchart で作業フローを可視化**
4. `## メタプロンプト再投入条件`
5. `## 改善提案（New Feature Proposal）`

表示ルールは `data/presentation.json`（v2）に準拠。Mermaid非対応環境では Markdown テーブルにフォールバック。
