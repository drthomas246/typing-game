# Function: useSpeechOnce

[hooks/typingEngine/useSpeechOnce](../modules/hooks_typingEngine_useSpeechOnce.md).useSpeechOnce

**useSpeechOnce**(`params`): `void`

タイピングゲームの学習フェーズにおいて、問題の単語を一度だけ音声で読み上げるカスタムフック。
ゲームの状態、特に学習フェーズが"study"の場合に、`useSpeech`フックを利用して単語を発話します。
同じ単語が複数回読み上げられないように、`spokenRef`を使用して管理します。

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | このフックが受け取るパラメータオブジェクト。 |
| `params.lang?` | `string` | 音声読み上げに使用する言語コード。デフォルトは"en-US"（英語）。 |
| `params.opts` | [`EngineOptions`](../interfaces/types.EngineOptions.md) | エンジンのオプション設定（現在は直接使用されていないが、将来的な拡張のために含まれる可能性あり）。 |
| `params.state` | [`EngineState`](../interfaces/types.EngineState.md) | 現在のタイピングエンジンの状態。 |

#### Returns

`void`
