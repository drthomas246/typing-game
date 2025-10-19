# Function: ColorModeButton

[components/ui/color-mode](../modules/components_ui_color_mode.md).ColorModeButton

**ColorModeButton**(`props`): `ReactNode`

カラーモードをライトとダークの間で切り替えるためのボタンコンポーネントです。
`ClientOnly`でラップされており、サーバーサイドレンダリング時にハイドレーションエラーが発生しないようにします。
クリックすると`useColorMode`フックの`toggleColorMode`を呼び出します。

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `props` | [`ColorModeButtonProps`](../types/types.ColorModeButtonProps.md) & `RefAttributes`\<`HTMLButtonElement`\> | このコンポーネントが受け取るプロパティ。`IconButton`に渡されます。\n * |

#### Returns

`ReactNode`

カラーモード切り替えボタン。
