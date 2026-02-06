# 設計原則（Design Principles）

プロジェクト横断で守るべき設計原則。チケット起票時・コードレビュー時・Worker実装時に参照する。

---

## 1. データ外部化（Data Externalization）

**原則**: テキスト・設定値・パラメータはコード内にハードコードしない。設定ファイル（JSON/YAML/ScriptableObject等）に外部化する。

**理由**:
- 設定変更がコード変更を伴わない
- 非エンジニアも値を編集できる
- ローカライゼーション・A/Bテスト・バランス調整が容易

**チェックリスト**:
- [ ] 文字列リテラル（UI表示テキスト、メッセージ等）がコード内に埋め込まれていないか
- [ ] 数値パラメータ（速度、ダメージ、タイムアウト等）がマジックナンバーになっていないか
- [ ] 設定値が環境別（dev/staging/prod）に切り替え可能か

### Unity 固有ルール

| データ種別 | 推奨格納先 | 備考 |
|-----------|-----------|------|
| UI表示テキスト | ScriptableObject or Localization Table | ローカライズ対応 |
| ゲームパラメータ | ScriptableObject | Inspector から編集可能 |
| 環境設定 | ScriptableObject or JSON | ビルド設定に応じて切替 |
| アセット参照 | Addressables or ScriptableObject | 直接参照を避ける |

### Web/一般プロジェクト固有ルール

| データ種別 | 推奨格納先 | 備考 |
|-----------|-----------|------|
| UI表示テキスト | i18n JSON / YAML | ローカライズ対応 |
| APIエンドポイント | 環境変数 or .env | ハードコード厳禁 |
| 設定パラメータ | config.json / YAML | 環境別に切替 |
| シークレット | 環境変数 / Secrets Manager | コードに含めない |

---

## 2. 単一責任（Single Responsibility）

**原則**: 1ファイル・1クラス・1関数は1つの責任だけを持つ。

**チェックリスト**:
- [ ] ファイルが複数の無関係な機能を含んでいないか
- [ ] クラスが「データ保持」と「ロジック実行」と「表示」を同時に担っていないか
- [ ] 関数が50行を超えていないか（目安）

---

## 3. 変更容易性（Ease of Change）

**原則**: 設定変更がコード変更を伴わないアーキテクチャを設計する。

**チェックリスト**:
- [ ] 新しいバリエーション追加時にコード変更が不要か（データ追加だけで済むか）
- [ ] 依存関係が一方向か（循環参照がないか）
- [ ] インターフェース/抽象を介して疎結合になっているか

---

## 4. 可視化優先（Visualization First）

**原則**: 構造・依存・データフローは図（Mermaid）で可視化する。テキストだけの説明は避ける。

**適用場面**:
- アーキテクチャ設計時 → `templates/diagrams/architecture.md`
- データフロー設計時 → `templates/diagrams/data-flow.md`
- 変更影響範囲の報告時 → `templates/diagrams/change-map.md`
- タスク進捗の報告時 → `templates/diagrams/task-flow.md`

**ルール**:
- Mermaid を優先（`data/presentation.json` の `diagram.preferred` 準拠）
- ASCII art は原則禁止
- Mermaid非対応環境（Visual Studio等）では Markdown テーブルにフォールバック

---

## 5. 学習者への配慮（Learner-Friendly）

**原則**: コード変更時は「どこを変えるとどう動くか」を明示する。

**実践**:
- Worker レポートに `## 変更マップ`（Mermaid graph）を必須で含める
- 重要な変更には `## Before/After` セクションでコード差分の抜粋を添える
- 新パターンを発見した場合は `docs/references/` にサンプルリファレンスとして蓄積する
- `docs/references/PATTERN_*.md` 形式で実装前→実装後の例を記録する
