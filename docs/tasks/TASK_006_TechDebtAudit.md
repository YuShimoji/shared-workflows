# Task: プロジェクト監査と技術的負債の整理 (Technical Debt & Unimplemented Features)

Status: DONE
Tier: 1
Branch: main
Owner: Orchestrator
Created: 2025-12-29T05:40:00+09:00

## Objective
- プロジェクト全体の監査で発見された技術的負債、不整合、未実装機能を整理し、優先順位を付けて解消する。
- 特に `scripts/` 配下のツール群の整合性と、`AI_CONTEXT.md` への自動同期機能の不足を解消する。

## Context
- 監査により、`report-orch-cli.js` が `HANDOVER.md` は更新するが `AI_CONTEXT.md` の進捗率や Worker ステータスを更新しないことが判明。
- コード内に `TODO`/`FIXME` が散在しており、これらをチケット化して管理する必要がある。
- SSOT 一本化に伴い、古い `v1.1.md` や `v2.0.md` に「非推奨/レガシー」の警告をより強調して追加する必要がある。

## Focus Area
- `scripts/` 配下の全スクリプト
- `docs/Windsurf_AI_Collab_Rules_v1.1.md`
- `docs/Windsurf_AI_Collab_Rules_v2.0.md`
- `AI_CONTEXT.md` (バックログセクション)

## Forbidden Area
- 既存の正常動作しているロジックの破壊的変更
- SSOT (`latest.md`) の基本ルールの改変（一本化は維持する）

## Constraints
- 各修正は最小限とし、動作確認（`sw-doctor.js`）を伴うこと。
- チケット化する際は、本タスクのサブタスクとしてではなく、新規チケットとして `docs/tasks/` に起票することを検討する。

## DoD
- [x] `report-orch-cli.js` に `--sync-context` オプションが実装され、`AI_CONTEXT.md` が更新される。
- [x] 旧 SSOT ファイル (`v1.1.md`, `v2.0.md`) に明確なレガシー警告が追加されている。
- [x] 検出された主要な TODO/FIXME が、必要に応じて新規チケット化されている。
- [x] 本チケットの Report 欄に完了レポートが紐付けられている。

## Notes
- `report-orch-cli.js` の拡張は、`todo-sync.js` のロジックを参考にする。

## Report
- [REPORT_ORCH_20260104_2115.md](../inbox/REPORT_ORCH_20260104_2115.md): 技術的負債の整理完了レポート
