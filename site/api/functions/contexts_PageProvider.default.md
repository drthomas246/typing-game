# Function: default

[contexts/PageProvider](../modules/contexts_PageProvider.md).default

**default**(`props`): `Element`

アプリケーションのページ遷移、サウンド、バトルモード、出題順、プレイヤーレベルなどの
グローバルな状態を一元的に管理し、子コンポーネントに提供するプロバイダーコンポーネント。
設定の一部はDexie (`db.app`経由) を用いて永続化されます。

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `props` | `Object` | このコンポーネントが受け取るプロパティ。 |
| `props.children` | `ReactNode` | プロバイダーがラップする子要素。 |

#### Returns

`Element`

グローバルなコンテキストを提供するJSX要素。
