# Function: reducer

[hooks/typingEngine/reducer](../modules/hooks_typingEngine_reducer.md).reducer

**reducer**(`s`, `a`): [`EngineState`](../interfaces/types.EngineState.md)

タイピングエンジンの状態遷移を扱うリデューサー関数。
現在の状態 (`EngineState`) とディスパッチされたアクション (`Action`) を受け取り、
新しい状態を返します。

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `s` | [`EngineState`](../interfaces/types.EngineState.md) | 現在のタイピングエンジンの状態。 |
| `a` | [`Action`](../types/types.Action.md) | ディスパッチされたアクションオブジェクト。 |

#### Returns

[`EngineState`](../interfaces/types.EngineState.md)

更新されたタイピングエンジンの状態。
