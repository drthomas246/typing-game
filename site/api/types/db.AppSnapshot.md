# Type alias: AppSnapshot

[db](../modules/db.md).AppSnapshot

 **AppSnapshot**: `Object`

アプリケーションの全体的な状態のスナップショットを表す型定義。
IndexedDBに保存され、アプリケーションの再起動時に状態を復元するために使用されます。

#### Type declaration

| Name | Type |
| :------ | :------ |
| `id` | ``"app"`` |
| `state` | \{ `progress`: \{ `lastOpenedAt`: `number` ; `level`: `number`  } ; `settings`: \{ `mode`: ``"study"`` \| ``"battle"`` ; `sort`: ``"random"`` \| ``"reverse"``  }  } |
| `state.progress` | \{ `lastOpenedAt`: `number` ; `level`: `number`  } |
| `state.progress.lastOpenedAt` | `number` |
| `state.progress.level` | `number` |
| `state.settings` | \{ `mode`: ``"study"`` \| ``"battle"`` ; `sort`: ``"random"`` \| ``"reverse"``  } |
| `state.settings.mode` | ``"study"`` \| ``"battle"`` |
| `state.settings.sort` | ``"random"`` \| ``"reverse"`` |
| `updatedAt` | `number` |
| `version` | `number` |
