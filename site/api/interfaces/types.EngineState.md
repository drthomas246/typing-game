# Interface: EngineState

[types](../modules/types.md).EngineState

タイピングエンジンの状態インターフェース。

## Table of contents

### Properties

- [answerEn](./types.EngineState.md#answeren)
- [combo](./types.EngineState.md#combo)
- [correctMap](./types.EngineState.md#correctmap)
- [enemyHp](./types.EngineState.md#enemyhp)
- [enemyMaxHp](./types.EngineState.md#enemymaxhp)
- [errors](./types.EngineState.md#errors)
- [finished](./types.EngineState.md#finished)
- [hintStep](./types.EngineState.md#hintstep)
- [hits](./types.EngineState.md#hits)
- [index](./types.EngineState.md#index)
- [learningPhase](./types.EngineState.md#learningphase)
- [mistakeProblemCount](./types.EngineState.md#mistakeproblemcount)
- [playCount](./types.EngineState.md#playcount)
- [playerHp](./types.EngineState.md#playerhp)
- [playerMaxHp](./types.EngineState.md#playermaxhp)
- [problemHasMistake](./types.EngineState.md#problemhasmistake)
- [problemUsedHint](./types.EngineState.md#problemusedhint)
- [questionImg](./types.EngineState.md#questionimg)
- [questionJa](./types.EngineState.md#questionja)
- [showHint](./types.EngineState.md#showhint)
- [startAt](./types.EngineState.md#startat)
- [started](./types.EngineState.md#started)
- [typed](./types.EngineState.md#typed)
- [usedHintCount](./types.EngineState.md#usedhintcount)
- [victory](./types.EngineState.md#victory)

## Properties

### answerEn

 **answerEn**: `string`

現在の英語の回答（タイピング対象）。

___

### combo

 **combo**: `number`

現在のコンボ数。

___

### correctMap

 **correctMap**: `boolean`[]

各文字が正しく入力されたかを示す真偽値の配列。

___

### enemyHp

 **enemyHp**: `number`

敵の現在のHP。

___

### enemyMaxHp

 **enemyMaxHp**: `number`

敵の最大HP。

___

### errors

 **errors**: `number`

エラー入力の総数。

___

### finished

 **finished**: `boolean`

エンジンが終了（勝利/敗北/エスケープ）したか。

___

### hintStep

 **hintStep**: ``0`` \| ``1`` \| ``2``

ヒントの段階（0: なし, 1: 1文字目, 2: 全文）。

___

### hits

 **hits**: `number`

正しい入力の総数。

___

### index

 **index**: `number`

現在の問題のインデックス。

___

### learningPhase

 **learningPhase**: [`LearningPhase`](../types/types.LearningPhase.md)

現在の学習フェーズ。

___

### mistakeProblemCount

 **mistakeProblemCount**: `number`

アプリ全体でのミスをした問題の総数。

___

### playCount

 **playCount**: `number`

問題の解答回数（周回数）。

___

### playerHp

 **playerHp**: `number`

プレイヤーの現在のHP。

___

### playerMaxHp

 **playerMaxHp**: `number`

プレイヤーの最大HP。

___

### problemHasMistake

 **problemHasMistake**: `boolean`

現在の問題でミスをしたか。

___

### problemUsedHint

 **problemUsedHint**: `boolean`

現在の問題でヒントを使用したか。

___

### questionImg

 `Optional` **questionImg**: `string`

現在の質問に関連する画像パス。

___

### questionJa

 **questionJa**: `string`

現在の日本語の質問。

___

### showHint

 **showHint**: `boolean`

ヒントが表示されているか。

___

### startAt

 `Optional` **startAt**: `number`

開始時刻のタイムスタンプ。

___

### started

 **started**: `boolean`

エンジンが開始されているか。

___

### typed

 **typed**: `string`

ユーザーが現在入力した文字列。

___

### usedHintCount

 **usedHintCount**: `number`

アプリ全体でのヒント使用総回数。

___

### victory

 `Optional` **victory**: `boolean`

勝利したか。
