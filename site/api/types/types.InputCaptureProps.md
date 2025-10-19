# Type alias: InputCaptureProps

[types](../modules/types.md).InputCaptureProps

 **InputCaptureProps**: `Object`

キーボード入力キャプチャコンポーネントのプロパティ。

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `enabled?` | `boolean` | 入力キャプチャを有効にするかどうか。 |
| `handleBackspace?` | `boolean` | Backspaceキーの入力を処理するかどうか。 |
| `handleEnter?` | `boolean` | Enterキーの入力を処理するかどうか。 |
| `handleSpace?` | `boolean` | Spaceキーの入力を処理するかどうか。 |
| `handleTab?` | `boolean` | Tabキーの入力を処理するかどうか。 |
| `onKey` | (`ch`: `string`, `e`: `KeyboardEvent`) => `void` | キー入力時のコールバック関数。文字と元のKeyboardEventを渡す。 |
