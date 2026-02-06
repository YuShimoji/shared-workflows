# 進捗バー表示機能の使用方法

## 概要

進捗バーは、コマンドラインとチャット上（Markdown形式）の両方で表示可能です。

## コマンドラインでの使用

### テキスト形式
```bash
node scripts/progress-meter.js
```

### JSON形式
```bash
node scripts/progress-meter.js --format json
```

## チャット上での使用

### Orchestratorレポートに埋め込む

Orchestratorレポートの「現状」セクションに進捗バーを埋め込むことができます。

**方法1: スクリプトを実行して結果をコピー**
```bash
node scripts/progress-meter.js
```
実行結果をコピーして、レポートの「現状」セクションに貼り付けます。

**方法2: コンパクト形式を使用**
```javascript
const { formatProgressMeterForChat } = require('./scripts/progress-meter');
const progress = formatProgressMeterForChat(tasks, projectRoot);
// レポートに埋め込む
```

### 出力例（チャット用コンパクト形式）

```
📊 進捗: ████████████████░░░░ 80% (8/10)
```

### 出力例（フル形式）

```
📊 プロジェクト進捗
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
全体進捗: ████████████████░░░░ 80%
完了タスク: 8/10
進行中: 1
未着手: 1

🎯 優先度別進捗
High:   ████████████████████ 100% (2/2)
Medium: ████████████░░░░░░░░  60% (3/5)
Low:    ██████░░░░░░░░░░░░░░  30% (1/3)
```

## 統合方法

### Orchestratorレポートテンプレートでの使用

`templates/ORCHESTRATOR_REPORT_TEMPLATE.md` の「現状」セクションに進捗バーを追加：

```markdown
## 現状
- <現状詳細（アクティブチケット・進行タスク・リスク）>

📊 進捗: ████████████████░░░░ 80% (8/10)
```

### Phase 6 レポート生成時の自動埋め込み

`prompts/orchestrator/modules/P6_report.md` に進捗バー生成の指示が追加されています。
Orchestratorは Phase 6 で自動的に進捗バーを生成し、レポートに埋め込みます。

## 注意事項

- 進捗バーは Unicode 記号（█ と ░）を使用しています
- 一部の環境では正しく表示されない場合があります
- その場合は、パーセンテージ表示のみを使用してください
