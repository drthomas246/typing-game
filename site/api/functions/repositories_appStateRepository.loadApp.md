# Function: loadApp

[repositories/appStateRepository](../modules/repositories_appStateRepository.md).loadApp

**loadApp**(): `Promise`\<[`AppSnapshot`](../types/db.AppSnapshot.md) \| `undefined`\>

IndexedDBからアプリケーションの保存された状態を非同期で読み込む関数。
`ID`で指定されたキー (`"app"`) に対応する`AppSnapshot`を取得します。

#### Returns

`Promise`\<[`AppSnapshot`](../types/db.AppSnapshot.md) \| `undefined`\>

保存されたアプリケーション状態、または見つからない場合は`undefined`を返すPromise。
