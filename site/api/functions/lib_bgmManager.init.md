# Function: init

[lib/bgmManager](../modules/lib_bgmManager.md).init

**init**(`src`, `defaultVolume?`, `loop?`): `void`

BGM (バックグラウンドミュージック) を初期化し、Howler.jsのインスタンスを準備する関数。
既に同じ音源のBGMがロードされている場合は、音量とループ設定を更新します。
異なる音源の場合は、既存のBGMをアンロードしてから新しいBGMをロードします。

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `src` | `string` | `undefined` | BGMの音源ファイルパス。 |
| `defaultVolume?` | `number` | `0.5` | BGMのデフォルト音量（0.0から1.0）。 |
| `loop?` | `boolean` | `true` | BGMをループ再生するかどうか。 |

#### Returns

`void`
