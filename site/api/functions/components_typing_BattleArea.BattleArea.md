# Function: BattleArea

[components/typing/BattleArea](../modules/components_typing_BattleArea.md).BattleArea

**BattleArea**(`props`): `ReactNode`

戦闘シーンのすべての視覚要素（敵、背景、問題、HPバー、エフェクト）を統合するメインコンポーネント。
`forwardRef` を利用して、親コンポーネントから `ref` を受け取り、内部のDOM要素に渡します。
これにより、親コンポーネントがこのコンポーネント内のDOMノード（例: 敵表示エリア）のサイズや位置を直接参照できるようになり、エフェクトの計算などに利用されます。

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `props` | `Omit`\<[`BattleArenaProps`](../types/types.BattleArenaProps.md) & `HeightOverrides` & `SafetyFlags`, ``"ref"``\> & `RefAttributes`\<`HTMLDivElement`\> | コンポーネントのプロパティ。`BattleArenaProps` 型を参照。 |

#### Returns

`ReactNode`
