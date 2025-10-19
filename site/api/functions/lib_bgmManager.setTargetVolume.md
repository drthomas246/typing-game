# Function: setTargetVolume

[lib/bgmManager](../modules/lib_bgmManager.md).setTargetVolume

**setTargetVolume**(`v`): `void`

BGMの目標音量を設定する関数。
設定された目標音量は、フェード処理中でない限り、Howlインスタンスに即座に適用されます。

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `v` | `number` | 設定する目標音量（0.0から1.0）。範囲外の値はクランプされます。 |

#### Returns

`void`
