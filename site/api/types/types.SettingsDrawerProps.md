# Type alias: SettingsDrawerProps

[types](../modules/types.md).SettingsDrawerProps

 **SettingsDrawerProps**: `Object`

設定ドロワーコンポーネントのプロパティ。

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `engine?` | [`EngineLike`](./types.EngineLike.md) | 制御対象のタイピングエンジンインスタンス。 |
| `onChange` | (`s`: [`Settings`](./types.Settings.md)) => `void` | 設定が変更されたときのコールバック。 |
| `onClose` | () => `void` | ドロワーを閉じる関数。 |
| `open` | `boolean` | ドロワーが開いているかどうか。 |
| `settings` | [`Settings`](./types.Settings.md) | 現在の設定オブジェクト。 |
