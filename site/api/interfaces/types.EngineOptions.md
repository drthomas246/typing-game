# Interface: EngineOptions

[types](../modules/types.md).EngineOptions

タイピングエンジンの動作オプション。

## Table of contents

### Properties

- [battleMode](./types.EngineOptions.md#battlemode)
- [bgm](./types.EngineOptions.md#bgm)
- [bgmSrc](./types.EngineOptions.md#bgmsrc)
- [bgmVolume](./types.EngineOptions.md#bgmvolume)
- [damagePerHit](./types.EngineOptions.md#damageperhit)
- [damagePerMiss](./types.EngineOptions.md#damagepermiss)
- [damagePerSentence](./types.EngineOptions.md#damagepersentence)
- [enemyMaxHp](./types.EngineOptions.md#enemymaxhp)
- [learnThenRecall](./types.EngineOptions.md#learnthenrecall)
- [learningMode](./types.EngineOptions.md#learningmode)
- [playerMaxHp](./types.EngineOptions.md#playermaxhp)
- [randomOrder](./types.EngineOptions.md#randomorder)
- [seed](./types.EngineOptions.md#seed)
- [sfx](./types.EngineOptions.md#sfx)
- [sfxDefeatSrc](./types.EngineOptions.md#sfxdefeatsrc)
- [sfxEscapeSrc](./types.EngineOptions.md#sfxescapesrc)
- [sfxFallDownSrc](./types.EngineOptions.md#sfxfalldownsrc)
- [sfxKeyOnSrc](./types.EngineOptions.md#sfxkeyonsrc)
- [sfxLevelUpSrc](./types.EngineOptions.md#sfxlevelupsrc)
- [sfxPunchSrc](./types.EngineOptions.md#sfxpunchsrc)
- [sfxSlashSrc](./types.EngineOptions.md#sfxslashsrc)
- [sfxVolume](./types.EngineOptions.md#sfxvolume)
- [sound](./types.EngineOptions.md#sound)
- [tickMs](./types.EngineOptions.md#tickms)

## Properties

### battleMode

 `Optional` **battleMode**: `boolean`

バトルモードを有効にするか。

___

### bgm

 `Optional` **bgm**: `boolean`

BGMを有効にするか。

___

### bgmSrc

 `Optional` **bgmSrc**: `string`

BGMファイルのソースパス。

___

### bgmVolume

 `Optional` **bgmVolume**: `number`

BGMの音量。

___

### damagePerHit

 `Optional` **damagePerHit**: `number`

正解1文字あたりのダメージ量（敵へのダメージ？）。

___

### damagePerMiss

 `Optional` **damagePerMiss**: `number`

ミス1回あたりのダメージ量。

___

### damagePerSentence

 `Optional` **damagePerSentence**: `number`

1文完了あたりのダメージ量。

___

### enemyMaxHp

 `Optional` **enemyMaxHp**: `number`

敵の最大HP。

___

### learnThenRecall

 `Optional` **learnThenRecall**: `boolean`

学習フェーズ後に復習フェーズ（Learn Then Recall）を行うか。

___

### learningMode

 `Optional` **learningMode**: `boolean`

学習モードを有効にするか。

___

### playerMaxHp

 `Optional` **playerMaxHp**: `number`

プレイヤーの最大HP。

___

### randomOrder

 `Optional` **randomOrder**: `boolean`

問題をランダムな順序にするか。

___

### seed

 `Optional` **seed**: `number`

乱数シード。

___

### sfx

 `Optional` **sfx**: `boolean`

効果音（SFX）を有効にするか。

___

### sfxDefeatSrc

 `Optional` **sfxDefeatSrc**: `string`

敗北効果音のソースパス。

___

### sfxEscapeSrc

 `Optional` **sfxEscapeSrc**: `string`

逃走効果音のソースパス。

___

### sfxFallDownSrc

 `Optional` **sfxFallDownSrc**: `string`

転倒効果音のソースパス。

___

### sfxKeyOnSrc

 `Optional` **sfxKeyOnSrc**: `string`

キー入力効果音のソースパス。

___

### sfxLevelUpSrc

 `Optional` **sfxLevelUpSrc**: `string`

レベルアップ効果音のソースパス。

___

### sfxPunchSrc

 `Optional` **sfxPunchSrc**: `string`

パンチ効果音のソースパス。

___

### sfxSlashSrc

 `Optional` **sfxSlashSrc**: `string`

斬撃効果音のソースパス。

___

### sfxVolume

 `Optional` **sfxVolume**: `number`

効果音の音量。

___

### sound

 `Optional` **sound**: `boolean`

全体的なサウンドを有効にするか。

___

### tickMs

 `Optional` **tickMs**: `number`

エンジンティックの間隔（ミリ秒）。
