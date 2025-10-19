# Type alias: ResultsDialogProps

[types](../modules/types.md).ResultsDialogProps

 **ResultsDialogProps**: `Object`

タイピング結果ダイアログのプロパティ。

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `onRetry` | () => `void` | リトライボタンが押されたときのコールバック。 |
| `open` | `boolean` | ダイアログが開いているかどうか。 |
| `setOpen` | (`v`: `boolean`) => `void` | ダイアログの開閉状態を設定する関数。 |
| `setShouldBgmPlay` | `React.Dispatch`\<`React.SetStateAction`\<`boolean` \| `undefined`\>\> | BGM再生状態を設定する関数。 |
| `summary` | \{ `killedNow`: `boolean` ; `mistakeProblemCount`: `number` ; `timeSec`: `number` ; `usedHintCount`: `number`  } | タイピングの結果概要。 |
| `summary.killedNow` | `boolean` | バトルモードで敵を倒した（Killed）かどうか。 |
| `summary.mistakeProblemCount` | `number` | ミスをした問題の数。 |
| `summary.timeSec` | `number` | 完了までにかかった時間（秒）。 |
| `summary.usedHintCount` | `number` | 使用したヒントの回数。 |
