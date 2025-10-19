# Function: ColorModeProvider

[components/ui/color-mode](../modules/components_ui_color_mode.md).ColorModeProvider

**ColorModeProvider**(`props`): `Element`

アプリケーション全体でカラーモード（ライトモード/ダークモード）を管理するためのプロバイダーコンポーネントです。
`next-themes`ライブラリの`ThemeProvider`を利用しており、HTMLの`class`属性を介してテーマを切り替えます。
トランジションを無効にして、テーマ切り替え時のちらつきを防ぎます。

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `props` | `ThemeProviderProps` | このコンポーネントが受け取るプロパティ。`next-themes`の`ThemeProvider`に渡されます。 |

#### Returns

`Element`

テーマプロバイダーのラッパーコンポーネント。
