# Function: shuffle

[hooks/typingEngine/rng](../modules/hooks_typingEngine_rng.md).shuffle

**shuffle**\<`T`\>(`arr`, `seed`): `T`[]

指定されたシード値に基づいた擬似乱数生成器を使用して配列をシャッフルする関数。
元の配列を変更せずに、新しいシャッフルされた配列を返します。

#### Type parameters

| Name | Description |
| :------ | :------ |
| `T` | 配列の要素の型。 |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `arr` | `T`[] | シャッフルする配列。 |
| `seed` | `number` | 乱数生成器のシード値。同じシード値からは常に同じシャッフル結果が得られます。 |

#### Returns

`T`[]

シャッフルされた新しい配列。
