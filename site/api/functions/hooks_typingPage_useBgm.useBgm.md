# Function: useBgm

[hooks/typingPage/useBgm](../modules/hooks_typingPage_useBgm.md).useBgm

**useBgm**(`opts`): `Object`

タイピング画面のBGM（背景音楽）の再生を制御するためのカスタムフック。
`howler.js`ライブラリを使用してBGMをロード、再生、停止し、
`opts`で指定された設定に基づいて動作します。

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts` | `Object` | BGMのオプション設定。 |
| `opts.enabled` | `undefined` \| `boolean` | BGMの再生が許可されているかどうかを示すフラグ。`true`の場合に再生が試みられます。 |
| `opts.loop?` | `boolean` | BGMをループ再生するかどうか。デフォルトは`true`。 |
| `opts.src` | `string` | BGMの音源ファイルパス。 |
| `opts.volume?` | `number` | BGMの音量（0.0から1.0）。デフォルトは`0.4`。 |

#### Returns

`Object`

BGMの再生状態と、その状態を更新する関数を含むオブジェクト。

.shouldPlay - 現在BGMが再生されるべきかどうかを示す状態。

.setShouldPlay - BGMの再生状態を更新するための関数。

| Name | Type |
| :------ | :------ |
| `setShouldPlay` | `Dispatch`\<`SetStateAction`\<`undefined` \| `boolean`\>\> |
| `shouldPlay` | `undefined` \| `boolean` |
