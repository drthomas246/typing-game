# Function: useTimer

[hooks/typingEngine/useTimer](../modules/hooks_typingEngine_useTimer.md).useTimer

**useTimer**(`tickMs`, `started`, `finished`): `Object`

タイピングゲームの時間を定期的に更新するためのカスタムフック。
ゲームの開始と終了状態に基づいてタイマーを起動・停止し、現在時刻を提供します。

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tickMs` | `number` | タイマーが更新される間隔（ミリ秒）。 |
| `started` | `boolean` | ゲームが開始されているかどうかを示すフラグ。 |
| `finished` | `boolean` | ゲームが終了しているかどうかを示すフラグ。 |

#### Returns

`Object`

現在時刻（ミリ秒）を含むオブジェクト。

.nowMs - 現在のUNIXタイムスタンプ（ミリ秒）。

| Name | Type |
| :------ | :------ |
| `nowMs` | `number` |
