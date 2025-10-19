# Function: LightMode

[components/ui/color-mode](../modules/components_ui_color_mode.md).LightMode

**LightMode**(`props`): `ReactNode`

アプリケーションを強制的にライトモードでレンダリングするためのラッパーコンポーネントです。
`Span`要素として機能し、`chakra-theme light`クラスを適用します。
特定のUI要素を常にライトモードで表示したい場合に使用します。

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `props` | `SpanProps` & `RefAttributes`\<`HTMLSpanElement`\> | このコンポーネントが受け取るプロパティ。`Span`コンポーネントに渡されます。 |

#### Returns

`ReactNode`

ライトモード専用のラッパー要素。
