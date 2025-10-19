# Function: useSound

[hooks/typingEngine/useSound](../modules/hooks_typingEngine_useSound.md).useSound

**useSound**(`opts`): [`SoundCtl`](../types/types.SoundCtl.md)

BGM（背景音楽）と効果音（SE）の再生を管理するためのカスタムフック。
`howler.js`ライブラリを使用して音声ファイルを扱い、ゲームオプションに基づいて音量や音源をカスタマイズできます。

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts` | [`EngineOptions`](../interfaces/types.EngineOptions.md) | エンジンのオプション設定。BGMや効果音のパス、音量などが含まれます。 |

#### Returns

[`SoundCtl`](../types/types.SoundCtl.md)

サウンド制御オブジェクト。BGMの再生/停止関数と、各種効果音の再生関数が含まれます。

.playBgm - BGMを再生する関数。

.stopBgm - BGMを停止する関数。

.sfx - 各種効果音を再生する関数を含むオブジェクト。

.sfx.slash - スラッシュ効果音を再生する関数。

.sfx.punch - パンチ効果音を再生する関数。

.sfx.defeat - 敗北効果音を再生する関数。

.sfx.escape - エスケープ効果音を再生する関数。

.sfx.fallDown - ダウン効果音を再生する関数。

.sfx.levelUp - レベルアップ効果音を再生する関数。

.sfx.keyOn - キーオン効果音を再生する関数。
