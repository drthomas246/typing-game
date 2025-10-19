# Function: sleep

[lib/nextFrame](../modules/lib_nextFrame.md).sleep

**sleep**(`ms`): `Promise`\<`void`\>

指定されたミリ秒数だけ処理を遅延させる非同期関数。
アニメーションの一時停止や、時間差のある処理を実行したい場合に使用されます。

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ms` | `number` | 遅延させるミリ秒数。 |

#### Returns

`Promise`\<`void`\>

指定されたミリ秒後に解決されるPromise。
