# アーキテクチャ図テンプレート

プロジェクト構成やモジュール間関係を可視化する。Orchestrator の `## ガイド` やレポートで使用。

## Mermaid: graph TD（モジュール構成）

```mermaid
graph TD
    subgraph Presentation["プレゼンテーション層"]
        UI[UI Components]
        Views[Views / Pages]
    end
    subgraph Domain["ドメイン層"]
        Services[Services]
        Models[Models / Entities]
    end
    subgraph Data["データ層"]
        Repos[Repositories]
        Config[Config / Settings]
        External[External APIs]
    end

    Views --> Services
    UI --> Views
    Services --> Models
    Services --> Repos
    Repos --> Config
    Repos --> External
```

## Mermaid: graph TD（Unity プロジェクト構成例）

```mermaid
graph TD
    subgraph Editor["Editor Scripts"]
        EditorWindow[Custom Editor Window]
        Inspector[Custom Inspector]
    end
    subgraph Runtime["Runtime Scripts"]
        MonoBehaviour[MonoBehaviour]
        SO[ScriptableObject<br>データ定義]
        Manager[Manager / Service]
    end
    subgraph Assets["Assets"]
        Prefabs[Prefabs]
        SOAssets[SO Instances<br>データファイル]
        Scenes[Scenes]
    end

    EditorWindow --> SO
    Inspector --> MonoBehaviour
    MonoBehaviour --> Manager
    Manager --> SO
    Prefabs --> MonoBehaviour
    SOAssets -.->|data| SO
    Scenes --> Prefabs
```

## フォールバック: インデントリスト（Mermaid非対応環境用）

```
プロジェクト構成:
├── Presentation（プレゼンテーション層）
│   ├── UI Components
│   └── Views / Pages → Domain.Services
├── Domain（ドメイン層）
│   ├── Services → Data.Repositories
│   └── Models / Entities
└── Data（データ層）
    ├── Repositories → Config, External APIs
    ├── Config / Settings
    └── External APIs
```
