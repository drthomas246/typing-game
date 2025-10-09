import { useCallback } from "react";
import { useBattle as useBattleContext } from "@/contexts/PageContext";
import type {
  Action,
  EngineOptions,
  EngineState,
  SoundCtl,
} from "@/types/index";

/**
 * タイピングゲームのバトルモードにおける攻撃（敵へのダメージ）と被弾（プレイヤーへのダメージ）のロジックを提供するカスタムフック。
 * ゲームの進行に応じてサウンドエフェクトを再生し、HPの増減をディスパッチします。
 *
 * @param {EngineOptions} opts - エンジンのオプション設定。`battleMode`、`damagePerMiss`、`damagePerSentence`などが含まれます。
 * @param {SoundCtl} sound - サウンド制御オブジェクト。効果音やBGMの再生/停止に使用されます。
 * @param {React.Dispatch<React.SetStateAction<number>>} setHurtId - プレイヤーがダメージを受けた際に視覚効果をトリガーするためのステート更新関数。
 * @param {React.Dispatch<React.SetStateAction<number>>} setSlashId - 敵がダメージを受けた際に視覚効果をトリガーするためのステート更新関数。
 * @param {React.Dispatch<Action>} dispatch - タイピングエンジンの状態を更新するためのディスパッチ関数。
 *
 * @returns {object} バトル関連のコールバック関数を含むオブジェクト。
 * @property {function(s: EngineState): void} onMiss - プレイヤーがミスした際に呼び出されるコールバック関数。
 * @property {function(s: EngineState): void} onSentenceClear - プレイヤーが問題をクリアした際に呼び出されるコールバック関数。
 */
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
