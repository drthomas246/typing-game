# Function: saveApp

[repositories/appStateRepository](../modules/repositories_appStateRepository.md).saveApp

**saveApp**(`partial`): `Promise`\<[`AppSnapshot`](../types/db.AppSnapshot.md)\>

IndexedDBにアプリケーションの状態の一部をマージして保存する非同期関数。
既存の状態を読み込み、指定された`partial`で部分的に更新してから保存します。
状態が存在しない場合は初期値を設定します。

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `partial` | `Partial`\<\{ `progress`: \{ `lastOpenedAt`: `number` ; `level`: `number`  } ; `settings`: \{ `mode`: ``"study"`` \| ``"battle"`` ; `sort`: ``"reverse"`` \| ``"random"``  }  }\> | 更新するアプリケーション状態の部分オブジェクト。 |

#### Returns

`Promise`\<[`AppSnapshot`](../types/db.AppSnapshot.md)\>

更新されたアプリケーション状態を返すPromise。
