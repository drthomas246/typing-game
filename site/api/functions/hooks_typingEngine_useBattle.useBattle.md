# Function: useBattle

[hooks/typingEngine/useBattle](../modules/hooks_typingEngine_useBattle.md).useBattle

**useBattle**(`opts`, `sound`, `setHurtId`, `setSlashId`, `dispatch`): `Object`

タイピングゲームのバトルモードにおける攻撃（敵へのダメージ）と被弾（プレイヤーへのダメージ）のロジックを提供するカスタムフック。
ゲームの進行に応じてサウンドエフェクトを再生し、HPの増減をディスパッチします。

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts` | [`EngineOptions`](../interfaces/types.EngineOptions.md) | エンジンのオプション設定。`battleMode`、`damagePerMiss`、`damagePerSentence`などが含まれます。 |
| `sound` | [`SoundCtl`](../types/types.SoundCtl.md) | サウンド制御オブジェクト。効果音やBGMの再生/停止に使用されます。 |
| `setHurtId` | `Dispatch`\<`SetStateAction`\<`number`\>\> | プレイヤーがダメージを受けた際に視覚効果をトリガーするためのステート更新関数。 |
| `setSlashId` | `Dispatch`\<`SetStateAction`\<`number`\>\> | 敵がダメージを受けた際に視覚効果をトリガーするためのステート更新関数。 |
| `dispatch` | `Dispatch`\<[`Action`](../types/types.Action.md)\> | タイピングエンジンの状態を更新するためのディスパッチ関数。 |

#### Returns

`Object`

バトル関連のコールバック関数を含むオブジェクト。

| Name | Type |
| :------ | :------ |
| `onMiss` | (`s`: [`EngineState`](../interfaces/types.EngineState.md)) => `void` |
| `onSentenceClear` | (`s`: [`EngineState`](../interfaces/types.EngineState.md)) => `void` |
