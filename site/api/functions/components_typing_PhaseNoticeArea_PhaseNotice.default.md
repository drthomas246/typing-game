# Function: default

[components/typing/PhaseNoticeArea/PhaseNotice](../modules/components_typing_PhaseNoticeArea_PhaseNotice.md).default

**default**(`props`): ``null`` \| `Element`

現在の学習フェーズ（練習、復習など）をユーザーに通知するコンポーネント。
学習モードに応じて表示するテキストやバッジの色が変化します。

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `props` | [`PhaseNoticeProps`](../types/types.PhaseNoticeProps.md) | コンポーネントのプロパティ。 |

#### Returns

``null`` \| `Element`

学習フェーズを示すUI。battleコンテキストが存在しない場合は`null`を返します。
