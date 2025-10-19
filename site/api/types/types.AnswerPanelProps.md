# Type alias: AnswerPanelProps

[types](../modules/types.md).AnswerPanelProps

 **AnswerPanelProps**: `Object`

回答パネルコンポーネントのプロパティ。

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `answer` | `string` | 正しい回答文字列。 |
| `correctMap` | `boolean`[] | 各文字の正誤を示す配列。 |
| `engine` | [`EngineLike`](./types.EngineLike.md) | タイピングエンジンインスタンス。 |
| `inputOnKey` | (`key`: `string`) => `void` | キー入力処理関数。 |
| `resultOpen` | `boolean` | 結果ダイアログが開いているか。 |
| `showHint` | `boolean` | ヒントが表示されているか。 |
| `state` | [`EngineState`](../interfaces/types.EngineState.md) | エンジンの現在の状態。 |
| `typed` | `string` | ユーザーが現在入力した文字列。 |
