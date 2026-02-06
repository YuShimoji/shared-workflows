# 変更マップテンプレート

Worker の `## 変更マップ` セクションで使用する。変更したファイル/モジュール間の依存関係を可視化する。

## Mermaid: graph TD（変更影響範囲）

```mermaid
graph TD
    A[変更ファイル1<br>src/module/main.ts] -->|imports| B[変更ファイル2<br>src/utils/helper.ts]
    A -->|tested by| C[テスト<br>tests/module/main.test.ts]
    B -->|tested by| D[テスト<br>tests/utils/helper.test.ts]
    A -->|uses| E[設定<br>config/settings.json]

    style A fill:#ff9,stroke:#333
    style B fill:#ff9,stroke:#333
    style C fill:#9f9,stroke:#333
    style D fill:#9f9,stroke:#333
    style E fill:#9cf,stroke:#333
```

凡例:
- 黄色: 変更されたソースファイル
- 緑色: 関連テストファイル
- 青色: 設定/データファイル

## フォールバック: Markdown テーブル（Mermaid非対応環境用）

| 変更ファイル | 種別 | 依存先 | 影響範囲 |
|-------------|------|--------|---------|
| src/module/main.ts | Source | src/utils/helper.ts, config/settings.json | tests/module/main.test.ts |
| src/utils/helper.ts | Source | — | tests/utils/helper.test.ts |
| config/settings.json | Config | — | src/module/main.ts |
