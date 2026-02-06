# タスク進捗図テンプレート

Orchestrator の `## 現状` セクションで使用する。タスク進捗を可視化する。

## Mermaid: pie（タスクステータス分布）

```mermaid
pie title タスクステータス
    "DONE" : 3
    "IN_PROGRESS" : 2
    "OPEN" : 4
    "BLOCKED" : 1
```

## Mermaid: gantt（タスクタイムライン）

```mermaid
gantt
    title タスク進捗
    dateFormat YYYY-MM-DD
    section 完了
        TASK_001 :done, t1, 2026-01-01, 2026-01-03
        TASK_002 :done, t2, 2026-01-02, 2026-01-04
    section 進行中
        TASK_003 :active, t3, 2026-01-04, 2026-01-07
    section 未着手
        TASK_004 :t4, after t3, 3d
```

## フォールバック: Markdown テーブル（Mermaid非対応環境用）

| タスク | ステータス | 優先度 | 進捗 |
|--------|-----------|--------|------|
| TASK_001 | DONE | High | ■■■■■■■■■■ 100% |
| TASK_002 | DONE | Medium | ■■■■■■■■■■ 100% |
| TASK_003 | IN_PROGRESS | High | ■■■■■□□□□□ 50% |
| TASK_004 | OPEN | Medium | □□□□□□□□□□ 0% |
