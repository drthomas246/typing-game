# Function: ensurePlaying

[lib/bgmManager](../modules/lib_bgmManager.md).ensurePlaying

**ensurePlaying**(`ms?`, `to?`): `void`

BGMをフェードインしながら再生し、目標音量を維持する関数。
BGMが再生中でない場合は、音量を0から目標値までフェードインしながら再生を開始します。
既に再生中の場合は、現在の音量から目標音量までフェードします。

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `ms?` | `number` | `800` | フェードにかける時間（ミリ秒）。0以下の場合は即座に音量が設定されます。 |
| `to?` | `number` | `undefined` | フェードの目標音量（0.0から1.0）。指定しない場合は`S.targetVolume`が使用されます。 |

#### Returns

`void`
