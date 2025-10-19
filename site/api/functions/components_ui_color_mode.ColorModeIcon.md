# Function: ColorModeIcon

[components/ui/color-mode](../modules/components_ui_color_mode.md).ColorModeIcon

**ColorModeIcon**(`props`): `Element`

現在のカラーモード（ライトまたはダーク）に基づいて、適切なアイコン（太陽または月）を表示するコンポーネントです。
`useColorMode`フックを使用して現在のカラーモードを検出し、それに応じて`LuSun`または`LuMoon`アイコンをレンダリングします。

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `props` | `IconBaseProps` | アイコンコンポーネントに渡されるプロパティ。例えば、`size`など。 |

#### Returns

`Element`

現在のカラーモードに対応するアイコンコンポーネント。
