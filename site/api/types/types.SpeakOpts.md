# Type alias: SpeakOpts

[types](../modules/types.md).SpeakOpts

 **SpeakOpts**: `Object`

音声読み上げ（Speech Synthesis）のオプション。

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `dedupeMs?` | `number` | 重複読み上げを防止する期間（ミリ秒）。 |
| `lang?` | `string` | 言語コード（例: 'ja-JP'）。 |
| `noDedupe?` | `boolean` | 重複防止を無効にするか。 |
| `pitch?` | `number` | ピッチ（高さ）（0〜2）。 |
| `rate?` | `number` | 読み上げ速度（0.1〜10）。 |
| `voiceHint?` | `string` | 使用する声のヒント。 |
