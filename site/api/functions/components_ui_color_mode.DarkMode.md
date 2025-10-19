# Function: DarkMode

[components/ui/color-mode](../modules/components_ui_color_mode.md).DarkMode

**DarkMode**(`props`): `ReactNode`

アプリケーションを強制的にダークモードでレンダリングするためのラッパーコンポーネントです。
`Span`要素として機能し、`chakra-theme dark`クラスを適用します。
特定のUI要素を常にダークモードで表示したい場合に使用します。

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `props` | `SpanProps` & `RefAttributes`\<`HTMLSpanElement`\> | このコンポーネントが受け取るプロパティ。`Span`コンポーネントに渡されます。 |

#### Returns

`ReactNode`

ダークモード専用のラッパー要素。
