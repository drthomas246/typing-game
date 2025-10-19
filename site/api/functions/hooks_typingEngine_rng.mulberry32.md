# Function: mulberry32

[hooks/typingEngine/rng](../modules/hooks_typingEngine_rng.md).mulberry32

**mulberry32**(`a`): () => `number`

Mulberry32アルゴリズムに基づいた擬似乱数生成器を初期化し、その生成関数を返します。
この関数はシード値`a`を受け取り、0以上1未満の浮動小数点数を生成する関数を返します。

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `a` | `number` | 乱数生成器の初期シード値。 |

#### Returns

`fn`

0以上1未満の浮動小数点数を返す乱数生成関数。

(): `number`

##### Returns

`number`
