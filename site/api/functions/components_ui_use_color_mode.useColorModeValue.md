# Function: useColorModeValue

[components/ui/use-color-mode](../modules/components_ui_use_color_mode.md).useColorModeValue

**useColorModeValue**\<`T`\>(`light`, `dark`): `T`

カラーモードに応じて異なる値を返すユーティリティフックです。
UI要素のスタイリングなどで、ライトモードとダークモードで異なる値を適用したい場合に便利です。

#### Type parameters

| Name | Description |
| :------ | :------ |
| `T` | 返される値の型。 |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `light` | `T` | ライトモード時に返す値。 |
| `dark` | `T` | ダークモード時に返す値。 |

#### Returns

`T`

現在のカラーモードに対応する値。
