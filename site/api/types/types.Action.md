# Type alias: Action

[types](../modules/types.md).Action

 **Action**: \{ `payload`: \{ `enemyMaxHp`: `number` ; `learning`: `boolean` ; `now`: `number` ; `playCount`: `number` ; `playerMaxHp`: `number`  } ; `type`: ``"START"``  } \| \{ `payload`: \{ `victory?`: `boolean`  } ; `type`: ``"STOP"``  } \| \{ `payload`: \{ `victory`: `boolean`  } ; `type`: ``"FINISH"``  } \| \{ `payload`: \{ `index`: `number` ; `learning`: `boolean` ; `pair`: [`QAPair`](../interfaces/types.QAPair.md)  } ; `type`: ``"LOAD_PAIR"``  } \| \{ `payload`: \{ `key`: `string` ; `ok`: `boolean`  } ; `type`: ``"TYPE_CHAR"``  } \| \{ `type`: ``"BACKSPACE"``  } \| \{ `payload`: \{ `phase`: [`LearningPhase`](./types.LearningPhase.md) ; `showHint`: `boolean`  } ; `type`: ``"SET_PHASE"``  } \| \{ `payload`: \{ `markUsedHint?`: `boolean` ; `showHint?`: `boolean` ; `step`: ``0`` \| ``1`` \| ``2``  } ; `type`: ``"SET_HINT_STEP"``  } \| \{ `type`: ``"MARK_USED_HINT"``  } \| \{ `payload`: \{ `learnThenRecall`: `boolean` ; `learning`: `boolean`  } ; `type`: ``"SYNC_LEARNING_TOGGLE"``  } \| \{ `type`: ``"TALLY_QUESTION"``  } \| \{ `payload`: \{ `amount`: `number`  } ; `type`: ``"DAMAGE_PLAYER"``  } \| \{ `payload`: \{ `amount`: `number`  } ; `type`: ``"DAMAGE_ENEMY"``  }

タイピングエンジンの状態を更新するためのアクション。
