# Function: judgeChar

[lib/judge](../modules/lib_judge.md).judgeChar

**judgeChar**(`answerEn`, `cursor`, `key`): [`JudgeResult`](../types/types.JudgeResult.md)

入力されたキーが、期待される英単語の現在のカーソル位置の文字と一致するかどうかを判定する関数。
大文字・小文字を区別せず、改行やバックスペースキーは常に不正な入力と見なされます。

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `answerEn` | `string` | 期待される正しい英単語の文字列。 |
| `cursor` | `number` | 現在入力されている文字のカーソル位置（0から始まるインデックス）。 |
| `key` | `string` | ユーザーが入力したキーの文字。 |

#### Returns

[`JudgeResult`](../types/types.JudgeResult.md)

判定結果を含むオブジェクト。

.ok - 入力文字が正しかったかどうか（`true`で正しい）。

.expected - 期待された文字。

.received - 実際に入力された文字。
