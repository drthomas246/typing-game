# Function: useInput

[hooks/typingEngine/useInput](../modules/hooks_typingEngine_useInput.md).useInput

**useInput**(`params`): `Object`

ユーザーのキーボード入力を処理し、タイピングエンジンの状態を更新するためのカスタムフック。
タイプされた文字の判定、ヒントの表示、ダメージ処理、問題のクリア、フェーズ遷移などを管理します。

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | このフックが受け取るパラメータオブジェクト。 |
| `params.dispatch` | `Dispatch`\<[`Action`](../types/types.Action.md)\> | タイピングエンジンの状態を更新するためのディスパッチ関数。 |
| `params.judgeChar` | [`JudgeFn`](../types/types.JudgeFn.md) | 入力文字の正誤を判定する関数。 |
| `params.next` | () => `void` | 次の問題へ進むための関数。 |
| `params.onMiss` | (`s`: [`EngineState`](../interfaces/types.EngineState.md)) => `void` | タイプミス時に呼び出されるコールバック関数。 |
| `params.onSentenceClear` | (`s`: [`EngineState`](../interfaces/types.EngineState.md)) => `void` | 問題がクリアされたときに呼び出されるコールバック関数。 |
| `params.opts` | [`EngineOptions`](../interfaces/types.EngineOptions.md) | エンジンのオプション設定。 |
| `params.setPhase` | (`phase`: [`LearningPhase`](../types/types.LearningPhase.md)) => `void` | 学習フェーズを設定する関数。 |
| `params.sound` | [`SoundCtl`](../types/types.SoundCtl.md) | サウンド制御オブジェクト。効果音の再生に使用されます。 |
| `params.speak` | (`text`: `string`, `opts?`: \{ `lang?`: `string`  }) => `void` | テキストを音声で読み上げる関数。 |
| `params.state` | [`EngineState`](../interfaces/types.EngineState.md) | 現在のタイピングエンジンの状態。 |

#### Returns

`Object`

キー入力イベントを処理するコールバック関数を含むオブジェクト。

.onKey - キーが押されたときに呼び出される関数。

| Name | Type |
| :------ | :------ |
| `onKey` | (`key`: `string`) => `void` |
