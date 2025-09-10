import { createContext, useContext } from "react";

export const UserPageContext = createContext<number | undefined>(undefined);
export const UserSetPageContext = createContext<
  React.Dispatch<React.SetStateAction<number>> | undefined
>(undefined);

export const UserSoundContext = createContext<boolean | undefined>(undefined);
export const UserSetSoundContext = createContext<
  React.Dispatch<React.SetStateAction<boolean>> | undefined
>(undefined);

export function usePage() {
  const v = useContext(UserPageContext);
  if (v === undefined)
    throw new Error("usePage must be used within <PageProvider>");
  return v;
}
export function useSetPage() {
  const set = useContext(UserSetPageContext);
  if (set === undefined)
    throw new Error("useSetPage must be used within <PageProvider>");
  return set;
}

export function useSound() {
  const v = useContext(UserSoundContext);
  if (v === undefined)
    throw new Error("useSound must be used within <PageProvider>");
  return v;
}
export function useSetSound() {
  const set = useContext(UserSetSoundContext);
  if (set === undefined)
    throw new Error("useSetSound must be used within <PageProvider>");
  return set;
}
