import { act, renderHook } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { useBattle } from "@/hooks/typingEngine/useBattle";
import type { Action, EngineOptions, EngineState, SoundCtl } from "@/types";

vi.mock("@/contexts/PageContext", () => ({
  useBattle: () => false,
}));

const makeSoundMock = (): SoundCtl => ({
  sfx: {
    slash: vi.fn(),
    punch: vi.fn(),
    defeat: vi.fn(),
    escape: vi.fn(),
    fallDown: vi.fn(),
    levelUp: vi.fn(),
    keyOn: vi.fn(),
  },
  playBgm: vi.fn(),
  stopBgm: vi.fn(),
});

describe("hooks/typingEngine/useBattle", () => {
  it("onMiss: 非バトル画面で punch→DAMAGE_PLAYER、HPが0到達なら fallDown & stopBgm", () => {
    vi.useFakeTimers();

    const sound = makeSoundMock();
    const dispatch = vi.fn<(a: Action) => void>();

    const { result } = renderHook(() => {
      const [hurtId, setHurtId] = useState(0);
      const [slashId, setSlashId] = useState(0);

      const hook = useBattle(
        { battleMode: true, damagePerMiss: 3 } as EngineOptions,
        sound,
        setHurtId,
        setSlashId,
        dispatch,
      );
      return { hook, getHurtId: () => hurtId, getSlashId: () => slashId };
    });

    const state = { playerHp: 3, enemyHp: 10 } as unknown as EngineState;

    act(() => result.current.hook.onMiss(state));

    expect(result.current.getHurtId()).toBe(1);
    expect(sound.sfx.punch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({
      type: "DAMAGE_PLAYER",
      payload: { amount: 3 },
    });
    expect(sound.sfx.fallDown).toHaveBeenCalledTimes(1);
    expect(sound.stopBgm).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it("onSentenceClear: 非バトル画面で slash→DAMAGE_ENEMY、敵が0到達なら defeat→(2.5s後に)levelUp & stopBgm", () => {
    vi.useFakeTimers();

    const sound = makeSoundMock();
    const dispatch = vi.fn<(a: Action) => void>();

    const { result } = renderHook(() => {
      const [_, setHurtId] = useState(0);
      const [slashId, setSlashId] = useState(0);

      const hook = useBattle(
        { battleMode: true, damagePerSentence: 4 } as EngineOptions,
        sound,
        setHurtId,
        setSlashId,
        dispatch,
      );
      return { hook, getSlashId: () => slashId };
    });

    const state = { playerHp: 10, enemyHp: 4 } as unknown as EngineState;

    act(() => result.current.hook.onSentenceClear(state));

    expect(result.current.getSlashId()).toBe(1);
    expect(sound.sfx.slash).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({
      type: "DAMAGE_ENEMY",
      payload: { amount: 4 },
    });
    expect(sound.sfx.defeat).toHaveBeenCalledTimes(1);
    expect(sound.stopBgm).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(2500);
    expect(sound.sfx.levelUp).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it("battleMode=false: onMiss/onSentenceClear はダメージやSFXを飛ばさない（アニメーションIDだけ更新）", () => {
    const sound = makeSoundMock();
    const dispatch = vi.fn<(a: Action) => void>();

    const { result } = renderHook(() => {
      const [hurtId, setHurtId] = useState(0);
      const [slashId, setSlashId] = useState(0);

      const hook = useBattle(
        {
          battleMode: false,
          damagePerMiss: 5,
          damagePerSentence: 7,
        } as EngineOptions,
        sound,
        setHurtId,
        setSlashId,
        dispatch,
      );
      return { hook, getHurtId: () => hurtId, getSlashId: () => slashId };
    });

    const s = { playerHp: 10, enemyHp: 10 } as unknown as EngineState;

    act(() => result.current.hook.onMiss(s));
    act(() => result.current.hook.onSentenceClear(s));

    expect(result.current.getHurtId()).toBe(1);

    expect(result.current.getSlashId()).toBe(0);

    expect(sound.sfx.punch).not.toHaveBeenCalled();
    expect(sound.sfx.slash).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
  });
});
