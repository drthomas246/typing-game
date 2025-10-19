# Function: useSequence

[hooks/useSequence](../modules/hooks_useSequence.md).useSequence

**useSequence**(`opts`): `Object`

タイトル画面やフェーズ切り替え時の視覚的なアニメーションシーケンスを制御するカスタムフック。
`framer-motion`を使用して、タイトル画像やスライドオーバーレイのアニメーションを管理します。

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts` | `Object` | アニメーションシーケンスのオプション設定。 |
| `opts.firstPlayed` | `boolean` | アプリケーションが初めて起動されたか、または初回プレイであるかを示すフラグ。 |
| `opts.onFinishFirst` | () => `void` | 初回アニメーションが完了したときに呼び出されるコールバック関数。 |
| `opts.titleSrc` | `string` | タイトル画像のソースパス。アニメーション前にプリロードされます。 |

#### Returns

`Object`

各アニメーションの可視性、アニメーション制御オブジェクト、およびシーケンス制御関数を含むオブジェクト。

.title - タイトル画像の表示状態とアニメーションコントロール。

.title.visible - タイトル画像が表示されているかどうか。

.title.ctrl - タイトル画像のアニメーションを制御する`framer-motion`のコントロール。

.top - 上部スライドオーバーレイの表示状態とアニメーションコントロール。

.top.visible - 上部スライドオーバーレイが表示されているかどうか。

.top.ctrl - 上部スライドオーバーレイのアニメーションを制御する`framer-motion`のコントロール。

.bottom - 下部スライドオーバーレイの表示状態とアニメーションコントロール。

.bottom.visible - 下部スライドオーバーレイが表示されているかどうか。

.bottom.ctrl - 下部スライドオーバーレイのアニメーションを制御する`framer-motion`のコントロール。

.right - 右部スライドオーバーレイの表示状態とアニメーションコントロール。

.right.visible - 右部スライドオーバーレイが表示されているかどうか。

.right.ctrl - 右部スライドオーバーレイのアニメーションを制御する`framer-motion`のコントロール。

.left - 左部スライドオーバーレイの表示状態とアニメーションコントロール。

.left.visible - 左部スライドオーバーレイが表示されているかどうか。

.left.ctrl - 左部スライドオーバーレイのアニメーションを制御する`framer-motion`のコントロール。

.start - アニメーションシーケンスを開始する非同期関数。

.reset - アニメーションの状態を初期位置にリセットする非同期関数。

| Name | Type |
| :------ | :------ |
| `bottom` | \{ `ctrl`: `AnimationControls` ; `visible`: `boolean` = vis.bottom } |
| `bottom.ctrl` | `AnimationControls` |
| `bottom.visible` | `boolean` |
| `left` | \{ `ctrl`: `AnimationControls` ; `visible`: `boolean` = vis.left } |
| `left.ctrl` | `AnimationControls` |
| `left.visible` | `boolean` |
| `reset` | () => `Promise`\<`void`\> |
| `right` | \{ `ctrl`: `AnimationControls` ; `visible`: `boolean` = vis.right } |
| `right.ctrl` | `AnimationControls` |
| `right.visible` | `boolean` |
| `start` | (`setShowTooltip`: `Dispatch`\<`SetStateAction`\<`boolean`\>\>) => `Promise`\<`void`\> |
| `title` | \{ `ctrl`: `AnimationControls` ; `visible`: `boolean` = vis.title } |
| `title.ctrl` | `AnimationControls` |
| `title.visible` | `boolean` |
| `top` | \{ `ctrl`: `AnimationControls` ; `visible`: `boolean` = vis.top } |
| `top.ctrl` | `AnimationControls` |
| `top.visible` | `boolean` |
