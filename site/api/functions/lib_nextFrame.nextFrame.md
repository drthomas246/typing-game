# Function: nextFrame

[lib/nextFrame](../modules/lib_nextFrame.md).nextFrame

**nextFrame**(): `Promise`\<`void`\>

ブラウザの次回の描画サイクル（アニメーションフレーム）まで待機する非同期関数。
UIの更新が反映されるのを待ってから次の処理を実行したい場合などに使用されます。

#### Returns

`Promise`\<`void`\>

次のアニメーションフレームで解決されるPromise。
