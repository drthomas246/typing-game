import { useState, type ReactNode } from "react";
import {
  UserPageContext,
  UserSetPageContext,
  UserSoundContext,
  UserSetSoundContext,
  UserBattleContext,
  UserSetBattleContext,
} from "./PageContext";

export default function PageProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<number>(0);
  const [sound, setSound] = useState<boolean>(false);
  const [battle, setBattle] = useState<boolean>(true);
  return (
    <UserPageContext.Provider value={page}>
      <UserSetPageContext.Provider value={setPage}>
        <UserSoundContext.Provider value={sound}>
          <UserSetSoundContext.Provider value={setSound}>
            <UserBattleContext.Provider value={battle}>
              <UserSetBattleContext.Provider value={setBattle}>
                {children}
              </UserSetBattleContext.Provider>
            </UserBattleContext.Provider>
          </UserSetSoundContext.Provider>
        </UserSoundContext.Provider>
      </UserSetPageContext.Provider>
    </UserPageContext.Provider>
  );
}
