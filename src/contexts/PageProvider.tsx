import { useCallback, useMemo, useState, type ReactNode } from "react";
import {
	UserPageContext,
	UserSetPageContext,
	UserSoundContext,
	UserSetSoundContext,
	UserBattleContext,
	UserSetBattleContext,
	UserSortContext,
	UserSetSortContext,
	UserLevelContext,
	UserSetLevelContext,
} from "./PageContext";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db";
import { saveApp } from "@/repositories/appStateRepository";

export default function PageProvider({ children }: { children: ReactNode }) {
	const [page, setPage] = useState<number>(0);
	const [sound, setSound] = useState<boolean>(false);

	const snap = useLiveQuery(() => db.app.get("app"), [], undefined);

	const battle = useMemo(
		() => (snap?.state?.settings?.mode ?? "battle") === "battle",
		[snap],
	);
	const sort = useMemo(
		() => (snap?.state?.settings?.sort ?? "random") === "reverse",
		[snap],
	);
	const level = useMemo(() => snap?.state?.progress?.level ?? 1, [snap]);

	const setBattle = useCallback(
		(v: boolean | ((prev: boolean) => boolean)) => {
			const current = battle;
			const next = typeof v === "function" ? v(current) : v;
			void saveApp({
				settings: {
					mode: next ? "battle" : "study",
					sort: sort ? "reverse" : "random",
				},
				progress: {
					level,
					lastOpenedAt: Date.now(),
				},
			});
		},
		[battle, sort, level],
	);

	const setSort = useCallback(
		(v: boolean | ((prev: boolean) => boolean)) => {
			const current = sort;
			const next = typeof v === "function" ? v(current) : v;
			void saveApp({
				settings: {
					mode: battle ? "battle" : "study",
					sort: next ? "reverse" : "random",
				},
				progress: {
					level,
					lastOpenedAt: Date.now(),
				},
			});
		},
		[battle, sort, level],
	);

	const setLevel = useCallback(
		(v: number | ((prev: number) => number)) => {
			const current = level;
			const next = typeof v === "function" ? v(current) : v;
			void saveApp({
				settings: {
					mode: battle ? "battle" : "study",
					sort: sort ? "reverse" : "random",
				},
				progress: {
					level: next,
					lastOpenedAt: Date.now(),
				},
			});
		},
		[battle, sort, level],
	);

	return (
		<UserPageContext.Provider value={page}>
			<UserSetPageContext.Provider value={setPage}>
				<UserSoundContext.Provider value={sound}>
					<UserSetSoundContext.Provider value={setSound}>
						<UserBattleContext.Provider value={battle}>
							<UserSetBattleContext.Provider value={setBattle}>
								<UserSortContext.Provider value={sort}>
									<UserSetSortContext.Provider value={setSort}>
										<UserLevelContext.Provider value={level}>
											<UserSetLevelContext.Provider value={setLevel}>
												{children}
											</UserSetLevelContext.Provider>
										</UserLevelContext.Provider>
									</UserSetSortContext.Provider>
								</UserSortContext.Provider>
							</UserSetBattleContext.Provider>
						</UserBattleContext.Provider>
					</UserSetSoundContext.Provider>
				</UserSoundContext.Provider>
			</UserSetPageContext.Provider>
		</UserPageContext.Provider>
	);
}
