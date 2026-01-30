# 進捗バー表示機�Eの使用方況E
## 概要E
進捗バーは、コマンドラインとチャチE��上！Earkdown形式）�E両方で表示可能です、E
## コマンドラインでの使用

### チE��スト形弁E```bash
node scripts/progress-meter.js
```

### JSON形弁E```bash
node scripts/progress-meter.js --format json
```

## チャチE��上での使用

### Orchestratorレポ�Eトに埋め込む

Orchestratorレポ�Eト�E「現状」セクションに進捗バーを埋め込むことができます、E
**方況E: スクリプトを実行して結果をコピ�E**
```bash
node scripts/progress-meter.js
```
実行結果をコピ�Eして、レポ�Eト�E「現状」セクションに貼り付けます、E
**方況E: コンパクト形式を使用**
```javascript
const { formatProgressMeterForChat } = require('./scripts/progress-meter');
const progress = formatProgressMeterForChat(tasks, projectRoot);
// レポ�Eトに埋め込む
```

### 出力例（チャチE��用コンパクト形式！E
```
📊 進捁E ████████████████░░░░ 80% (8/10)
```

### 出力例（フル形式！E
```
📊 プロジェクト進捁E━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
全体進捁E ████████████████░░░░ 80%
完亁E��スク: 8/10
進行中: 1
未着扁E 1

🎯 優先度別進捁EHigh:   ████████████████████ 100% (2/2)
Medium: ████████████░░░░░░░░  60% (3/5)
Low:    ██████░░░░░░░░░░░░░░  30% (1/3)
```

## 統合方況E
### Orchestratorレポ�Eトテンプレートでの使用

`templates/ORCHESTRATOR_REPORT_TEMPLATE.md` の「現状」セクションに進捗バーを追加�E�E
```markdown
## 現状
- <現状詳細�E�アクチE��ブチケチE��・進行タスク・リスク�E�E

📊 進捁E ████████████████░░░░ 80% (8/10)
```

### Phase 6 レポ�Eト生成時の自動埋め込み

`prompts/orchestrator/modules/P6_report.md` に進捗バー生�Eの持E��が追加されてぁE��す、EOrchestratorは Phase 6 で自動的に進捗バーを生成し、レポ�Eトに埋め込みます、E
## 注意事頁E
- 進捗バーは Unicode 記号�E�█ と ░）を使用してぁE��ぁE- 一部の環墁E��は正しく表示されなぁE��合がありまぁE- そ�E場合�E、パーセンチE�Eジ表示のみを使用してください
