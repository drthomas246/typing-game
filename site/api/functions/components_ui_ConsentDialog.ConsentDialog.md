# Function: ConsentDialog

[components/ui/ConsentDialog](../modules/components_ui_ConsentDialog.md).ConsentDialog

**ConsentDialog**(`props`): `Element`

音声利用の許諾を確認するダイアログコンポーネント。
このダイアログは、ユーザーにサイトでの音声再生の許可を求めます。

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `props` | `Object` | ConsentDialogが受け取るプロパティ。 |
| `props.onNo` | () => `void` | 「いいえ」ボタンがクリックされたときに実行されるコールバック関数。 |
| `props.onOpenChange` | (`open`: `boolean`) => `void` | ダイアログの開閉状態が変更されたときに呼び出される関数。 |
| `props.onYes` | () => `void` | 「はい」ボタンがクリックされたときに実行されるコールバック関数。 |
| `props.open` | `boolean` | ダイアログが表示されているかどうかの状態。 |

#### Returns

`Element`

音声利用許諾ダイアログ。
