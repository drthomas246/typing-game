import Dexie, { type Table } from "dexie";

/**
 * アプリケーションの全体的な状態のスナップショットを表す型定義。
 * IndexedDBに保存され、アプリケーションの再起動時に状態を復元するために使用されます。
 *
 * @property {string} id - このスナップショットの一意の識別子。常に"app"である。
 * @property {number} version - アプリケーションの状態スキーマのバージョン番号。
 * @property {number} updatedAt - 状態が最後に更新されたUNIXタイムスタンプ。
 * @property {object} state - アプリケーションの主要な状態データを含むオブジェクト。
 * @property {object} state.settings - ユーザー設定を含むオブジェクト。
 * @property {"study" | "battle"} state.settings.mode - 現在のゲームモード（"study"または"battle"）。
 * @property {"random" | "reverse"} state.settings.sort - 問題のソート順（"random"または"reverse"）。
 * @property {object} state.progress - ユーザーの進行状況データを含むオブジェクト。
 * @property {number} state.progress.level - ユーザーの現在のレベル。
 * @property {number} state.progress.lastOpenedAt - アプリケーションが最後に開かれたUNIXタイムスタンプ。
 */
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
 * アプリケーションの状態をIndexedDBで管理するためのDexieデータベースクラス。
 * `AppSnapshot`型のデータを`app`テーブルに保存します。
 *
 * @extends Dexie
 */
class AppDB extends Dexie {
	/**
	 * `AppSnapshot`オブジェクトを格納するテーブル。
	 */
	app!: Table<AppSnapshot, string>;

	/**
	 * AppDBのコンストラクタ。
	 * データベース名"my-app-db"で初期化し、バージョン1のスキーマを定義します。
	 * `app`テーブルには`id`がプライマリキーとして、`updatedAt`がインデックスとして設定されます。
	 */
	constructor() {
		super("my-app-db");
		this.version(1).stores({
			app: "id, updatedAt",
		});
	}
}
export const db = new AppDB();
