import { useBattle as useBattleContext } from "@/contexts/PageContext";
import type {
  Action,
  EngineOptions,
  EngineState,
  SoundCtl,
} from "@/types/index";
import { useCallback } from "react";

export function useBattle(
  opts: EngineOptions,
  sound: SoundCtl,
  setHurtId: React.Dispatch<React.SetStateAction<number>>,
  setSlashId: React.Dispatch<React.SetStateAction<number>>,
  dispatch: React.Dispatch<Action>,
) {
  const battle = useBattleContext();
  const battleMode = opts.battleMode ?? true;
  const damagePerMiss = Math.max(1, opts.damagePerMiss ?? 5);
  const damagePerSentence = Math.max(
    1,
    opts.damagePerSentence ?? opts.damagePerHit ?? 10,
  );

  const onMiss = useCallback(
    (s: EngineState) => {
      setHurtId((n) => n + 1);
      if (!battleMode) return;
      if (battle) return;
      sound.sfx.punch();

      const justDied =
        s.playerHp > 0 && Math.max(0, s.playerHp - damagePerMiss) === 0;
      dispatch({ type: "DAMAGE_PLAYER", payload: { amount: damagePerMiss } });

      if (justDied) {
        sound.sfx.fallDown();
        sound.stopBgm();
      }
    },
    [battleMode, damagePerMiss, battle, dispatch, setHurtId, sound],
  );

  const onSentenceClear = useCallback(
    (s: EngineState) => {
      if (!battleMode) return;

      if (!battle) sound.sfx.slash();
      setSlashId((n) => n + 1);

      const killedNow =
        s.enemyHp > 0 && Math.max(0, s.enemyHp - damagePerSentence) === 0;
      dispatch({
        type: "DAMAGE_ENEMY",
        payload: { amount: damagePerSentence },
      });

      if (killedNow) {
        if (!battle) {
          sound.sfx.defeat();
          setTimeout(() => {
            sound.sfx.levelUp();
          }, 2500);
        }
        sound.stopBgm();
      }
    },
    [battleMode, damagePerSentence, battle, dispatch, setSlashId, sound],
  );

  return { onMiss, onSentenceClear };
}
