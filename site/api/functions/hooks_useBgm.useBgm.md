# Function: useBgm

[hooks/useBgm](../modules/hooks_useBgm.md).useBgm

**useBgm**(`src`, `defaultVolume?`): `Object`

グローバルなBGM（バックグラウンドミュージック）の再生と制御を行うカスタムフック。
`bgmManager`ユーティリティをラップし、BGMの初期化、再生、停止、音量調整機能を提供します。

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `src` | `string` | `undefined` | BGMの音源ファイルパス。 |
| `defaultVolume?` | `number` | `0.5` | BGMのデフォルト音量（0.0から1.0）。 |

#### Returns

`Object`

BGMを制御するための関数群を含むオブジェクト。

.ensurePlaying - BGMが再生されていない場合に再生を開始し、オプションでフェードイン時間と目標音量を設定する関数。

.fadeOutStop - BGMをフェードアウトさせて停止する関数。オプションでフェードアウト時間を設定できます。

.stopNow - BGMを直ちに停止する関数。

.setTargetVolume - BGMの目標音量を設定する関数。

.getTargetVolume - 現在設定されているBGMの目標音量を取得する関数。

| Name | Type |
| :------ | :------ |
| `ensurePlaying` | (`ms?`: `number`, `to?`: `number`) => `void` |
| `fadeOutStop` | (`ms?`: `number`) => `void` |
| `getTargetVolume` | () => `number` |
| `setTargetVolume` | (`v`: `number`) => `void` |
| `stopNow` | () => `void` |
