import { type AppSnapshot, db } from "@/db";

/**
 * アプリケーションの状態をIndexedDBに保存する際のキーとして使用されるID。
 */
const ID = "app";
/**
 * アプリケーション状態のスナップショットのバージョン番号。
 * スキーマの変更を管理するために使用されます。
 */
const SNAPSHOT_VERSION = 1;

/**
 * IndexedDBからアプリケーションの保存された状態を非同期で読み込む関数。
 * `ID`で指定されたキー (`"app"`) に対応する`AppSnapshot`を取得します。
 *
 * @returns {Promise<AppSnapshot | undefined>} 保存されたアプリケーション状態、または見つからない場合は`undefined`を返すPromise。
 */
export async function loadApp(): Promise<AppSnapshot | undefined> {
	return db.app.get(ID);
}

/**
 * IndexedDBにアプリケーションの状態の一部をマージして保存する非同期関数。
 * 既存の状態を読み込み、指定された`partial`で部分的に更新してから保存します。
 * 状態が存在しない場合は初期値を設定します。
 *
 * @param {Partial<AppSnapshot["state"]>} partial - 更新するアプリケーション状態の部分オブジェクト。
 * @returns {Promise<AppSnapshot>} 更新されたアプリケーション状態を返すPromise。
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
 * アプリケーションの状態全体を指定された新しい状態に置き換えてIndexedDBに保存する非同期関数。
 * 主にアプリケーションのリセットや、状態の完全な上書きが必要な場合に使用されます。
 * `updatedAt`と`version`も自動的に更新されます。
 *
 * @param {AppSnapshot["state"]} full - アプリケーションの新しい完全な状態オブジェクト。
 * @returns {Promise<AppSnapshot>} 新しく保存された`AppSnapshot`オブジェクトを返すPromise。
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
