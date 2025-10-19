# Function: useHowlerBgm

[hooks/useHowlerBgm](../modules/hooks_useHowlerBgm.md).useHowlerBgm

**useHowlerBgm**(`opts`): `Object`

Howler.js ライブラリを使用してBGM（バックグラウンドミュージック）の再生を制御するカスタムフック。
BGMのロード、再生、停止、音量調整、フェードイン/アウト機能をカプセル化し、
コンポーネントライフサイクルに合わせたBGM管理を提供します。

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts` | [`useHowlerBgmOpts`](../types/types.useHowlerBgmOpts.md) | BGMのオプション設定。 |

#### Returns

`Object`

BGMを制御するための関数群を含むオブジェクト。

.howl - 現在のHowlインスタンス。

.ensurePlaying - BGMが再生されていることを保証する関数。必要に応じてBGMをフェードイン再生します。

.fadeOutStop - BGMをフェードアウトさせて停止する関数。

.stopNow - BGMを即座に停止する関数。

.setTargetVolume - BGMの目標音量を設定する関数。

.getTargetVolume - BGMの現在の目標音量を取得する関数。

| Name | Type |
| :------ | :------ |
| `ensurePlaying` | (`ms`: `number`, `to?`: `number`) => `void` |
| `fadeOutStop` | (`ms`: `number`) => `void` |
| `getTargetVolume` | () => `number` |
| `howl` | ``null`` \| `Howl` |
| `setTargetVolume` | (`v`: `number`) => `void` |
| `stopNow` | () => `void` |
