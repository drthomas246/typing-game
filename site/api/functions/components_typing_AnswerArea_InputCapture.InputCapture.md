# Function: InputCapture

[components/typing/AnswerArea/InputCapture](../modules/components_typing_AnswerArea_InputCapture.md).InputCapture

**InputCapture**(`props`): ``null``

ページ全体のキーボード入力をキャプチャし、指定されたハンドラに渡す非表示コンポーネント。
このコンポーネントはUIをレンダリングせず、`useEffect` を利用してグローバルな `keydown` イベントリスナーを登録・解除します。
これにより、特定の入力フィールドにフォーカスがなくても、アプリケーション全体でタイピング入力を受け付けることが可能になります。

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `props` | [`InputCaptureProps`](../types/types.InputCaptureProps.md) | コンポーネントのプロパティ。 |

#### Returns

``null``
