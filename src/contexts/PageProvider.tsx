import { useState, type ReactNode } from "react";
import {
  UserPageContext,
  UserSetPageContext,
  UserSoundContext,
  UserSetSoundContext,
} from "./PageContext";

export default function PageProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState(0);
  const [sound, setSound] = useState(false);
  return (
    <UserPageContext.Provider value={page}>
      <UserSetPageContext.Provider value={setPage}>
        <UserSoundContext.Provider value={sound}>
          <UserSetSoundContext.Provider value={setSound}>
            {children}
          </UserSetSoundContext.Provider>
        </UserSoundContext.Provider>
      </UserSetPageContext.Provider>
    </UserPageContext.Provider>
  );
}
