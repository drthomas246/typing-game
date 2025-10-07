import { type AppSnapshot, db } from "@/db";

const ID = "app";
const SNAPSHOT_VERSION = 1;

/**
 * 保存されたアプリ状態を読み込む。
 */
export async function loadApp(): Promise<AppSnapshot | undefined> {
        return db.app.get(ID);
}

/**
 * 状態の一部をマージして保存する。
 */
export async function saveApp(partial: Partial<AppSnapshot["state"]>) {
	const current = (await db.app.get(ID)) ?? {
		id: ID,
		version: SNAPSHOT_VERSION,
		updatedAt: 0,
		state: {
			settings: { mode: "battle", sort: "reverse" },
			progress: { level: 1, lastOpenedAt: 0 },
		},
	};
	const next: AppSnapshot = {
		...current,
		version: SNAPSHOT_VERSION,
		updatedAt: Date.now(),
		state: { ...current.state, ...partial }, // 上書きマージ
	};
	await db.app.put(next);
	return next;
}

/**
 * 状態全体を置き換えて保存する。
 */
export async function overwriteApp(full: AppSnapshot["state"]) {
	const next: AppSnapshot = {
		id: ID,
		version: SNAPSHOT_VERSION,
		updatedAt: Date.now(),
		state: full,
	};
	await db.app.put(next);
	return next;
}
