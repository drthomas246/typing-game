# Function: fadeOutStop

[lib/bgmManager](../modules/lib_bgmManager.md).fadeOutStop

**fadeOutStop**(`ms?`): `void`

BGMをフェードアウトさせて停止する関数。
現在BGMが再生中であり、かつ音量が微小な値 (`EPS`) より大きい場合にフェードアウト処理を実行します。
フェードアウト完了後、BGMは停止され、音量は目標音量 (`S.targetVolume`) にリセットされます。

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `ms?` | `number` | `500` | フェードアウトにかける時間（ミリ秒）。デフォルトは`500`ミリ秒。 |

#### Returns

`void`
