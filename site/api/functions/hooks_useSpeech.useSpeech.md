# Function: useSpeech

[hooks/useSpeech](../modules/hooks_useSpeech.md).useSpeech

**useSpeech**(): `Object`

Web Speech APIを利用して音声読み上げ機能を提供するカスタムフック。
音声合成の準備状態、読み上げ、停止、ウォームアップなどの機能を含みます。

#### Returns

`Object`

音声読み上げを制御するための関数と状態を含むオブジェクト。

.speak - 指定されたテキストを読み上げる関数。

.stop - 現在の音声読み上げを停止する関数。

.voices - 利用可能な音声のリスト。

.isReady - 音声読み上げ機能が利用可能かどうかを示すフラグ。

.waitUntilReady - 音声読み上げ機能が準備完了になるまで待機する非同期関数。

.warmup - 音声読み上げ機能をウォームアップする非同期関数。

| Name | Type |
| :------ | :------ |
| `isReady` | `boolean` |
| `speak` | (`text`: `string`, `opts`: [`SpeakOpts`](../types/types.SpeakOpts.md)) => `void` |
| `stop` | () => `void` |
| `voices` | `SpeechSynthesisVoice`[] |
| `waitUntilReady` | () => `Promise`\<`void`\> |
| `warmup` | () => `Promise`\<`void`\> |
