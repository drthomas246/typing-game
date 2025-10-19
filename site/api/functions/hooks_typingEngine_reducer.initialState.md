# Function: initialState

[hooks/typingEngine/reducer](../modules/hooks_typingEngine_reducer.md).initialState

**initialState**(`opts`): [`EngineState`](../interfaces/types.EngineState.md)

タイピングエンジンの初期状態を生成する関数。
ゲーム開始時やリセット時に呼び出され、プレイヤーや敵のHP、タイピングの進捗、設定などを初期化します。

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts` | [`EngineOptions`](../interfaces/types.EngineOptions.md) | エンジンの初期化オプション。 |

#### Returns

[`EngineState`](../interfaces/types.EngineState.md)

初期化されたタイピングエンジンの状態オブジェクト。
