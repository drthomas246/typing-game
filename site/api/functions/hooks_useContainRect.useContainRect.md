# Function: useContainRect

[hooks/useContainRect](../modules/hooks_useContainRect.md).useContainRect

**useContainRect**(`imgRef`, `wrapRef`): `Object`

画像を親要素の領域内に「包含 (contain)」するように配置するための矩形情報 (x, y, width, height) を計算するカスタムフック。
レスポンシブな画像表示や、特定の領域に画像をフィットさせる際に使用されます。

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `imgRef` | `RefObject`\<``null`` \| `HTMLImageElement`\> | 描画対象のHTMLImageElementへのReact参照オブジェクト。`naturalWidth`や`naturalHeight`を取得するために使用されます。 |
| `wrapRef` | `RefObject`\<``null`` \| `HTMLDivElement`\> | 画像を包含する親HTMLDivElementへのReact参照オブジェクト。`clientWidth`や`clientHeight`を取得するために使用されます。 |

#### Returns

`Object`

計算された矩形情報と再計算関数を含むオブジェクト。

.rect - 画像を包含するための計算されたx, y座標と幅、高さ。

.compute - 矩形情報を手動で再計算するためのコールバック関数。

| Name | Type |
| :------ | :------ |
| `compute` | () => `void` |
| `rect` | [`ContainRect`](../types/types.ContainRect.md) |
