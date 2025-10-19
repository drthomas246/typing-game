# Type alias: SoundCtl

[types](../modules/types.md).SoundCtl

 **SoundCtl**: `Object`

サウンド制御オブジェクトの型。

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `playBgm` | () => `void` | BGMを再生する関数。 |
| `sfx` | \{ `defeat`: () => `void` ; `escape`: () => `void` ; `fallDown`: () => `void` ; `keyOn`: () => `void` ; `levelUp`: () => `void` ; `punch`: () => `void` ; `slash`: () => `void`  } | 各種効果音の制御オブジェクト。 |
| `sfx.defeat` | () => `void` | 敗北効果音を再生する関数。 |
| `sfx.escape` | () => `void` | 逃走効果音を再生する関数。 |
| `sfx.fallDown` | () => `void` | 転倒効果音を再生する関数。 |
| `sfx.keyOn` | () => `void` | キー入力効果音を再生する関数。 |
| `sfx.levelUp` | () => `void` | レベルアップ効果音を再生する関数。 |
| `sfx.punch` | () => `void` | パンチ効果音を再生する関数。 |
| `sfx.slash` | () => `void` | 斬撃効果音を再生する関数。 |
| `stopBgm` | () => `void` | BGMを停止する関数。 |
