// src/db/index.ts
import Dexie, { type Table } from "dexie";
import type { QAPair } from "@/types";

/**
 * アプリケーションの全体的な状態のスナップショットを表す型定義。
 * IndexedDBに保存され、アプリケーションの再起動時に状態を復元するために使用されます。
 */
export type AppSnapshot = {
  id: "app";
  version: number;
  updatedAt: number;
  state: {
    settings: {
      mode: "study" | "battle";
      sort: "random" | "reverse";
    };
    progress: {
      level: number;
      lastOpenedAt: number;
      /** テストモードで間違えた問題リスト */
      makingProblem: QAPair[];
    };
  };
};

/**
 * Dexie データベース定義
 */
class AppDB extends Dexie {
  app!: Table<AppSnapshot, string>;

  constructor() {
    super("my-app-db");

    // v1: 旧構造
    this.version(1).stores({
      app: "id, updatedAt",
    });

    // v2: makingProblem を追加
    this.version(2)
      .stores({
        app: "id, updatedAt",
      })
      .upgrade(async (tx) => {
        const table = tx.table<AppSnapshot, string>("app");
        await table.toCollection().modify((snap) => {
          if (!snap.state?.progress?.makingProblem) {
            snap.state.progress.makingProblem = [];
          }
          snap.version = Math.max(snap.version ?? 1, 2);
        });
      });
  }
}

export const db = new AppDB();

/**
 * 不完全なスナップショットを安全に補正するヘルパー
 */
function ensureSnapshotShape(raw: any): AppSnapshot {
  const now = Date.now();

  const snap: AppSnapshot = {
    id: "app",
    version: typeof raw?.version === "number" ? Math.max(raw.version, 2) : 2,
    updatedAt: typeof raw?.updatedAt === "number" ? raw.updatedAt : now,
    state: {
      settings: {
        mode: raw?.state?.settings?.mode === "battle" ? "battle" : "study",
        sort: raw?.state?.settings?.sort === "reverse" ? "reverse" : "random",
      },
      progress: {
        level: Number.isFinite(raw?.state?.progress?.level)
          ? raw.state.progress.level
          : 1,
        lastOpenedAt:
          typeof raw?.state?.progress?.lastOpenedAt === "number"
            ? raw.state.progress.lastOpenedAt
            : now,
        makingProblem: Array.isArray(raw?.state?.progress?.makingProblem)
          ? raw.state.progress.makingProblem
          : [],
      },
    },
  };

  return snap;
}

/**
 * デフォルトスナップショット
 */
const defaultSnapshot = (): AppSnapshot => ({
  id: "app",
  version: 2,
  updatedAt: Date.now(),
  state: {
    settings: { mode: "study", sort: "random" },
    progress: { level: 1, lastOpenedAt: Date.now(), makingProblem: [] },
  },
});

/**
 * スナップショットをロード（無ければ作成）
 */
export async function loadAppSnapshot(): Promise<AppSnapshot> {
  const got = await db.app.get("app");
  if (!got) {
    const init = defaultSnapshot();
    await db.app.put(init);
    return init;
  }
  const fixed = ensureSnapshotShape(got);
  // 欠損があった場合は補正後に保存
  if (JSON.stringify(got) !== JSON.stringify(fixed)) {
    fixed.updatedAt = Date.now();
    await db.app.put(fixed);
  }
  return fixed;
}

/**
 * スナップショットを保存
 */
export async function saveAppSnapshot(snap: AppSnapshot): Promise<void> {
  snap.updatedAt = Date.now();
  await db.app.put(snap);
}

/**
 * ミスした問題を追加（重複は無視）
 */
export async function addMissedProblem(pair: QAPair): Promise<void> {
  await db.transaction("rw", db.app, async () => {
    const snap0 = await db.app.get("app");
    const snap = ensureSnapshotShape(snap0);

    snap.state.progress.makingProblem ??= [];

    const exists = snap.state.progress.makingProblem.some(
      (p) => p.en === pair.en && p.ja === pair.ja,
    );
    if (!exists) {
      snap.state.progress.makingProblem.push({
        ja: pair.ja,
        en: pair.en,
        img: pair.img,
      });
      snap.version = Math.max(snap.version, 2);
      snap.updatedAt = Date.now();
      await db.app.put(snap);
    }
  });
}

/**
 * ミス問題リストをクリア
 */
export async function clearMissedProblems(): Promise<void> {
  const snap = ensureSnapshotShape(await loadAppSnapshot());
  snap.state.progress.makingProblem = [];
  snap.updatedAt = Date.now();
  await db.app.put(snap);
}
