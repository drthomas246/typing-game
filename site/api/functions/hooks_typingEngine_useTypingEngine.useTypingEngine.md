# Function: useTypingEngine

[hooks/typingEngine/useTypingEngine](../modules/hooks_typingEngine_useTypingEngine.md).useTypingEngine

**useTypingEngine**(`opts`, `QA`, `setSlashId`, `setHurtId`, `setVanishId`, `setVanished`): `Object`

タイピングゲームのコアロジックを統合的に管理するカスタムフック。
ゲームの状態、入力処理、サウンド再生、学習フェーズ、問題のシーケンスなどをオーケストレートし、
タイピングゲーム全体のエクスペリエンスを提供します。

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts` | [`EngineOptions`](../interfaces/types.EngineOptions.md) | エンジンの初期化と動作に関するオプション設定。 |
| `QA` | [`QAPair`](../interfaces/types.QAPair.md)[] | 出題される問題の`QAPair`配列。 |
| `setSlashId` | `Dispatch`\<`SetStateAction`\<`number`\>\> | 敵への攻撃アニメーションをトリガーするための状態更新関数。 |
| `setHurtId` | `Dispatch`\<`SetStateAction`\<`number`\>\> | プレイヤーの被弾アニメーションをトリガーするための状態更新関数。 |
| `setVanishId` | `Dispatch`\<`SetStateAction`\<`number`\>\> | 問題が消滅するアニメーションをトリガーするための状態更新関数。 |
| `setVanished` | `Dispatch`\<`SetStateAction`\<`boolean`\>\> | 問題が完全に消滅した状態を管理するための状態更新関数。 |

#### Returns

`Object`

タイピングエンジンを制御するための関数と現在の状態を含むオブジェクト。

.state - 現在のタイピングエンジンの状態。

.start - ゲームを開始する関数。

.stop - ゲームを停止する関数。

.next - 次の問題へ進む関数。

.onKey - キーボード入力を処理する関数。

.setLearningPhase - 学習フェーズを設定する関数。

.actualTimeSec - 実際の経過時間（秒）。

| Name | Type |
| :------ | :------ |
| `actualTimeSec` | `number` |
| `next` | () => `void` |
| `onKey` | (`key`: `string`) => `void` |
| `setLearningPhase` | (`phase`: [`LearningPhase`](../types/types.LearningPhase.md)) => `void` |
| `start` | () => `void` |
| `state` | [`EngineState`](../interfaces/types.EngineState.md) |
| `stop` | (`reason?`: ``"victory"`` \| ``"escape"`` \| ``"user"`` \| ``"dead"``) => `void` |
