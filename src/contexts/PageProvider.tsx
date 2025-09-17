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
} from "./PageContext";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db";
import { saveApp } from "@/repositories/appStateRepository";

export default function PageProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<number>(0);
  const [sound, setSound] = useState<boolean>(false);

  const snap = useLiveQuery(() => db.app.get("app"), [], undefined);

  const battle = useMemo(
    () => (snap?.state?.settings?.mode ?? "study") === "study",
    [snap],
  );
  const sort = useMemo(
    () => (snap?.state?.settings?.sort ?? "reverse") === "random",
    [snap],
  );

  const setBattle = useCallback(
    (v: boolean | ((prev: boolean) => boolean)) => {
      const current = battle;
      const next = typeof v === "function" ? v(current) : v;
      void saveApp({
        settings: {
          mode: next ? "study" : "battle",
          sort: sort ? "random" : "reverse",
        },
      });
    },
    [battle, sort],
  );

  const setSort = useCallback(
    (v: boolean | ((prev: boolean) => boolean)) => {
      const current = sort;
      const next = typeof v === "function" ? v(current) : v;
      void saveApp({
        settings: {
          mode: battle ? "study" : "battle",
          sort: next ? "random" : "reverse",
        },
      });
    },
    [battle, sort],
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
                    {children}
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
