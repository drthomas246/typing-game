# Function: useLearning

[hooks/typingEngine/useLearning](../modules/hooks_typingEngine_useLearning.md).useLearning

**useLearning**(`params`): `Object`

タイピングゲームの学習フェーズ（"study"または"recall"）の状態と遷移を制御するカスタムフック。
学習モードの有効/無効、そして「練習→復習」のフローに基づいて、ヒントの表示状態を管理します。

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | このフックが受け取るパラメータオブジェクト。 |
| `params.dispatch` | `Dispatch`\<[`Action`](../types/types.Action.md)\> | タイピングエンジンの状態を更新するためのディスパッチ関数。 |
| `params.opts` | [`EngineOptions`](../interfaces/types.EngineOptions.md) | エンジンのオプション設定。特に`learnThenRecall`プロパティが使用されます。 |
| `params.state` | [`EngineState`](../interfaces/types.EngineState.md) | 現在のタイピングエンジンの状態。 |

#### Returns

`Object`

学習フェーズを設定する関数を含むオブジェクト。

.setPhase - 指定された学習フェーズに状態を更新し、ヒントの表示状態を調整するコールバック関数。

| Name | Type |
| :------ | :------ |
| `setPhase` | (`phase`: [`LearningPhase`](../types/types.LearningPhase.md)) => `void` |
