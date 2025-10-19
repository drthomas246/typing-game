# Function: Title

[components/map/Title](../modules/components_map_Title.md).Title

**Title**(`props`): ``null`` \| `Element`

マップ上にタイトル画像を表示するコンポーネント。
親コンポーネントから渡される矩形情報に基づいて、タイトルの位置とサイズを動的に調整します。

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `props` | [`TitleProps`](../types/types.TitleProps.md) | コンポーネントのプロパティ。 |

#### Returns

``null`` \| `Element`

レンダリングされたタイトルコンポーネント、または `containRect` が無効な場合は `null`。
