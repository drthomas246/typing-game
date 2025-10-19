# Type alias: HeaderAreaProps

[types](../modules/types.md).HeaderAreaProps

 **HeaderAreaProps**: `Object`

ヘッダー領域コンポーネントのプロパティ。

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `onOpen` | () => `void` | 設定ドロワーを開く関数。 |
| `setShouldPlay` | `React.Dispatch`\<`React.SetStateAction`\<`boolean` \| `undefined`\>\> | BGM再生状態を設定する関数。 |
| `settings` | [`Settings`](./types.Settings.md) | 現在の設定オブジェクト。 |
| `start` | () => `void` | タイピングを開始する関数。 |
| `state` | [`EngineState`](../interfaces/types.EngineState.md) | エンジンの現在の状態。 |
| `stop` | (`reason?`: ``"escape"`` \| ``"user"`` \| ``"dead"`` \| ``"victory"``) => `void` | タイピングを停止する関数。 |
| `title` | `string` | 表示するタイトル。 |
