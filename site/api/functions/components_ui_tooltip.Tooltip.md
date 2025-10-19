# Function: Tooltip

[components/ui/tooltip](../modules/components_ui_tooltip.md).Tooltip

**Tooltip**(`props`): `ReactNode`

Chakra UIのツールチップ機能を拡張した汎用コンポーネントです。
矢印の表示、Portalでのレンダリングの制御、ツールチップの無効化などの機能を提供します。

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `props` | [`TooltipProps`](../interfaces/components_ui_tooltip.TooltipProps.md) & `RefAttributes`\<`HTMLDivElement`\> | このコンポーネントが受け取るプロパティ。`TooltipProps`を参照してください。 |

#### Returns

`ReactNode`

ツールチップ、または`disabled`が`true`の場合は子要素。
