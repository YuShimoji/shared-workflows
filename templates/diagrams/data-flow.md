# データフロー図テンプレート

データとロジックの分離を可視化する。設計レビューやリファクタリングタスクで使用。

## Mermaid: flowchart LR（データフロー）

```mermaid
flowchart LR
    subgraph External["外部データ"]
        JSON[JSON / YAML<br>設定ファイル]
        API[External API]
        DB[(Database)]
    end
    subgraph App["アプリケーション"]
        Loader[Data Loader]
        Cache[Cache Layer]
        Logic[Business Logic]
        UI[UI / View]
    end

    JSON -->|read| Loader
    API -->|fetch| Loader
    DB -->|query| Loader
    Loader -->|parse| Cache
    Cache -->|provide| Logic
    Logic -->|bind| UI
```

## Mermaid: flowchart LR（Unity データ分離パターン）

```mermaid
flowchart LR
    subgraph Data["データ層（ScriptableObject）"]
        SO_Config[GameConfig SO]
        SO_Text[TextData SO<br>Localization]
        SO_Param[Parameters SO]
    end
    subgraph Logic["ロジック層"]
        Manager[GameManager]
        Service[Service Layer]
    end
    subgraph View["表示層"]
        UI_Text[UI Text Components]
        UI_Panel[UI Panels]
        GO[GameObjects]
    end

    SO_Config -->|inject| Manager
    SO_Text -->|bind| UI_Text
    SO_Param -->|configure| Service
    Manager -->|control| GO
    Service -->|update| UI_Panel
```

## Before/After 例: ハードコード → データ外部化

### Before（ハードコード）
```csharp
// NG: テキストがコード内にハードコード
public class DialogManager : MonoBehaviour
{
    void ShowWelcome()
    {
        dialogText.text = "ようこそ！冒険の世界へ";
        buttonText.text = "はじめる";
    }
}
```

### After（ScriptableObject に外部化）
```csharp
// OK: データをSOに分離
[CreateAssetMenu(fileName = "DialogData", menuName = "Game/DialogData")]
public class DialogData : ScriptableObject
{
    public string welcomeMessage;
    public string startButtonText;
}

public class DialogManager : MonoBehaviour
{
    [SerializeField] private DialogData dialogData;

    void ShowWelcome()
    {
        dialogText.text = dialogData.welcomeMessage;
        buttonText.text = dialogData.startButtonText;
    }
}
```

## フォールバック: Markdown テーブル（Mermaid非対応環境用）

| データ種別 | 格納先 | 参照元 | 備考 |
|-----------|--------|--------|------|
| ゲーム設定 | GameConfig.asset (SO) | GameManager | Inspector から編集可能 |
| テキスト | TextData.asset (SO) | UI Text Components | ローカライズ対応 |
| パラメータ | Parameters.asset (SO) | Service Layer | バランス調整用 |
