# Function: useHowlerOneShot

[hooks/useHowlerOneShot](../modules/hooks_useHowlerOneShot.md).useHowlerOneShot

**useHowlerOneShot**(`src`, `volume?`): `Object`

Howler.jsライブラリを使用して、指定された音源を一度だけ再生するためのカスタムフック。
主に効果音（SFX）のように、トリガーされたときに単発で再生される音源に使用されます。
コンポーネントのマウント時に音源をプリロードし、アンマウント時にリソースを解放します。

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `src` | `string` | `undefined` | 再生する音源ファイルパス。 |
| `volume?` | `number` | `1.0` | 音源の再生音量（0.0から1.0）。デフォルトは`1.0`。 |

#### Returns

`Object`

音源を再生するための関数を含むオブジェクト。

.play - 音源を再生するコールバック関数。

| Name | Type |
| :------ | :------ |
| `play` | () => `undefined` \| `number` |
