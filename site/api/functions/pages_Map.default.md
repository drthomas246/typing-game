# Function: default

[pages/Map](../modules/pages_Map.md).default

**default**(`props`): `Element`

マップ画面を描写し、ゲームの進行状況に応じたポイントを配置するページコンポーネント。
`MapView`コンポーネントをラップし、ツールチップの表示状態やKonvaステージへの参照を提供します。

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `props` | `PropsWithChildren`\<\{ `showTooltip`: `boolean` ; `stageRef`: `RefObject`\<``null`` \| `Stage`\>  }\> | このコンポーネントが受け取るプロパティ。 |

#### Returns

`Element`

マップ画面のUI要素。
