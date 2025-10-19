# Function: default

[components/typing/AnswerArea](../modules/components_typing_AnswerArea.md).default

**default**(`props`): `Element`

タイピングの回答エリア全体を構成するメインコンポーネント。
ユーザー入力の視覚的表示を担当する `AnswerInputView` と、
キーボード入力のロジックを担当する `InputCapture` を組み合わせています。
また、ユーザーへの操作説明も表示します。

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `props` | [`AnswerPanelProps`](../types/types.AnswerPanelProps.md) | コンポーネントのプロパティ。 |

#### Returns

`Element`

レンダリングされた回答パネルコンポーネント。
