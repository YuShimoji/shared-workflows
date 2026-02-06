# パターン: Mermaid 図の使い方

プロジェクト横断で使う Mermaid 図の書き方と各 IDE での表示例。

---

## 基本ルール

- `data/presentation.json` の `diagram.preferred` が `"mermaid"` → Mermaid を優先
- ASCII art は原則禁止（`diagram.ascii_art: false`）
- Mermaid 非対応環境（Visual Studio 等）では Markdown テーブルにフォールバック

## 対応 IDE

| IDE | Mermaid 対応 | 備考 |
|-----|-------------|------|
| Windsurf | ✅ | チャット内で直接レンダリング |
| Google Antigravity | ✅ | チャット内で直接レンダリング |
| Cursor | ✅ | チャット内で直接レンダリング |
| VS Code | ✅ | Markdown Preview Enhanced 等で対応 |
| Visual Studio | ❌ | Markdown テーブルにフォールバック |

---

## よく使う図の種類

### 1. タスク進捗（Orchestrator `## 現状`）

```mermaid
pie title タスクステータス
    "DONE" : 3
    "IN_PROGRESS" : 2
    "OPEN" : 4
```

テンプレート: `templates/diagrams/task-flow.md`

### 2. 変更マップ（Worker `## 変更マップ`）

```mermaid
graph TD
    A[src/main.ts] -->|uses| B[src/utils.ts]
    A -->|tested by| C[tests/main.test.ts]
    style A fill:#ff9,stroke:#333
    style C fill:#9f9,stroke:#333
```

テンプレート: `templates/diagrams/change-map.md`

### 3. 作業フロー（Orchestrator `## ガイド`）

```mermaid
flowchart LR
    A[チケット確認] --> B[実装]
    B --> C{テスト通過?}
    C -->|Yes| D[レポート作成]
    C -->|No| B
    D --> E[commit/push]
```

テンプレート: Orchestrator が状況に応じて動的生成

### 4. データフロー（設計レビュー）

```mermaid
flowchart LR
    JSON[config.json] -->|read| Loader
    Loader -->|parse| Cache
    Cache -->|provide| Logic
    Logic -->|bind| UI
```

テンプレート: `templates/diagrams/data-flow.md`

### 5. アーキテクチャ（プロジェクト構成）

```mermaid
graph TD
    subgraph UI["View Layer"]
        Pages[Pages]
    end
    subgraph Logic["Logic Layer"]
        Services[Services]
    end
    subgraph Data["Data Layer"]
        Repos[Repositories]
    end
    Pages --> Services --> Repos
```

テンプレート: `templates/diagrams/architecture.md`

---

## フォールバック例（Mermaid 非対応環境）

Mermaid:
```mermaid
graph TD
    A[main.ts] --> B[utils.ts]
```

フォールバック（Markdown テーブル）:

| ファイル | 依存先 | 種別 |
|---------|--------|------|
| main.ts | utils.ts | import |

---

## 関連ドキュメント

- `data/presentation.json` — 表示ポリシー SSOT
- `templates/diagrams/` — 全図テンプレート集
- `docs/windsurf_workflow/IDE_COMPATIBILITY.md` — IDE 別詳細ガイド
