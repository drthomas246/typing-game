# Function: overwriteApp

[repositories/appStateRepository](../modules/repositories_appStateRepository.md).overwriteApp

**overwriteApp**(`full`): `Promise`\<[`AppSnapshot`](../types/db.AppSnapshot.md)\>

アプリケーションの状態全体を指定された新しい状態に置き換えてIndexedDBに保存する非同期関数。
主にアプリケーションのリセットや、状態の完全な上書きが必要な場合に使用されます。
`updatedAt`と`version`も自動的に更新されます。

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `full` | `Object` | アプリケーションの新しい完全な状態オブジェクト。 |
| `full.progress` | `Object` | - |
| `full.progress.lastOpenedAt` | `number` | - |
| `full.progress.level` | `number` | - |
| `full.settings` | `Object` | - |
| `full.settings.mode` | ``"study"`` \| ``"battle"`` | - |
| `full.settings.sort` | ``"reverse"`` \| ``"random"`` | - |

#### Returns

`Promise`\<[`AppSnapshot`](../types/db.AppSnapshot.md)\>

新しく保存された`AppSnapshot`オブジェクトを返すPromise。
