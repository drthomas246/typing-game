# Type alias: BattleArenaProps

[types](../modules/types.md).BattleArenaProps

 **BattleArenaProps**: `Object`

バトルアリーナコンポーネントのプロパティ。

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `arenaRef` | `React.RefObject`\<`HTMLDivElement`\> | アリーナのDOM要素そのものの参照。 |
| `backgroundImg` | `string` | 背景画像のパス。 |
| `children?` | `React.ReactNode` | アリーナ内に表示する子要素。 |
| `enemyHpPct` | `number` | 敵のHPのパーセンテージ（0.0〜1.0）。 |
| `enemyImg` | `string` | 敵キャラクターの画像パス。 |
| `hurtId` | `number` | 敵へのダメージアニメーションのトリガーID。 |
| `onVanishDone` | () => `void` | 消滅アニメーション完了時のコールバック。 |
| `questionImg` | `string` \| `undefined` | 質問の画像パス。 |
| `questionText` | `string` | 質問のテキスト。 |
| `ref` | `React.RefObject`\<`HTMLDivElement` \| ``null``\> | アリーナのDOM要素への参照。 |
| `slashId` | `number` | 斬撃アニメーションのトリガーID。 |
| `state` | [`EngineState`](../interfaces/types.EngineState.md) | エンジンの現在の状態。 |
| `vanishId` | `number` | 敵の消滅アニメーションのトリガーID。 |
| `vanished` | `boolean` | 敵が消滅した状態か。 |
