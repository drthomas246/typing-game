import Dexie, { type Table } from "dexie";

export type AppSnapshot = {
        id: "app";
        version: number;
	updatedAt: number;
	state: {
		settings: { mode: "study" | "battle"; sort: "random" | "reverse" };
		progress: { level: number; lastOpenedAt: number };
	};
};

/**
 * アプリ状態を保持するDexieデータベース。
 */
class AppDB extends Dexie {
        app!: Table<AppSnapshot, string>;
        constructor() {
                super("my-app-db");
                this.version(1).stores({
			app: "id, updatedAt",
		});
	}
}
export const db = new AppDB();
