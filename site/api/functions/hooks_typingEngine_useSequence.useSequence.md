# Function: useSequence

[hooks/typingEngine/useSequence](../modules/hooks_typingEngine_useSequence.md).useSequence

**useSequence**(`QA`, `opts`): `Object`

タイピングゲームの問題の出題順序を管理するカスタムフック。
問題セット (`QAPair[]`) とオプション (`EngineOptions`) に基づいて、
問題の順序を初期化（ランダムまたはシーケンシャル）し、指定されたインデックスの問題を取得する機能を提供します。

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `QA` | [`QAPair`](../interfaces/types.QAPair.md)[] | 問題データの配列。 |
| `opts` | [`EngineOptions`](../interfaces/types.EngineOptions.md) | エンジンのオプション。特に`seed`と`randomOrder`が使用されます。 |

#### Returns

`Object`

問題の順序、初期化関数、問題取得関数を含むオブジェクト。

.order - 現在の問題の出題順序を示すインデックスの配列。

.initOrder - 問題の出題順序を初期化する関数。

.getPair - 指定された出題順序のインデックスに対応する`QAPair`を返す関数。

| Name | Type |
| :------ | :------ |
| `getPair` | (`index`: `number`) => [`QAPair`](../interfaces/types.QAPair.md) |
| `initOrder` | () => `void` |
| `order` | `number`[] |
