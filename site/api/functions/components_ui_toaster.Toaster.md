# Function: Toaster

[components/ui/toaster](../modules/components_ui_toaster.md).Toaster

**Toaster**(): `Element`

グローバルなトースト通知を描画するコンポーネント。
`createToaster`で初期化された`toaster`インスタンスを使用し、
アプリケーション全体にわたる通知（ローディング、成功、エラーなど）を表示します。
`Portal`内でレンダリングされるため、DOMツリーのどこにでも表示できます。

#### Returns

`Element`

グローバルなトースト通知コンポーネント。
