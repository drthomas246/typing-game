import type { useHowlerBgmOpts } from "@/types/index";
import type { Howl } from "howler";
import { Howler, Howl as HowlerHowl } from "howler";
import { useCallback, useEffect, useRef } from "react";

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

export function useHowlerBgm({
  src,
  defaultVolume = 0.5,
  loop = true,
}: useHowlerBgmOpts) {
  const howlRef = useRef<Howl | null>(null);
  const targetRef = useRef(clamp01(defaultVolume));
  const fadingRef = useRef(false);
  const EPS = 0.005;

  useEffect(() => {
    if (Howler.volume() === 0) Howler.volume(1.0);
  }, []);

  useEffect(() => {
    const h = new HowlerHowl({
      src: [src],
      loop,
      volume: clamp01(targetRef.current),
      preload: true,
      html5: false,
    });
    howlRef.current = h;
    return () => {
      h.stop();
      h.unload();
      howlRef.current = null;
    };
  }, [src, loop]);

  const setTargetVolume = useCallback((v: number) => {
    const vv = clamp01(v);
    targetRef.current = vv;
    const h = howlRef.current;
    if (h && !fadingRef.current) h.volume(vv);
  }, []);

  const getTargetVolume = useCallback(() => targetRef.current, []);

  const ensurePlaying = useCallback((ms = 800, to?: number) => {
    const h = howlRef.current;
    if (!h) return;
    const target = clamp01(to ?? targetRef.current);
    const cur = h.volume();

    if (!h.playing()) {
      h.volume(0);
      h.play();
      if (ms > 0) {
        fadingRef.current = true;
        h.fade(0, target, ms);
        h.once("fade", () => {
          fadingRef.current = false;
        });
      } else {
        h.volume(target);
      }
      return;
    }

    if (Math.abs(cur - target) > EPS) {
      if (ms > 0) {
        fadingRef.current = true;
        h.fade(cur, target, ms);
        h.once("fade", () => {
          fadingRef.current = false;
        });
      } else {
        h.volume(target);
      }
    }
  }, []);

  const fadeOutStop = useCallback((ms = 500) => {
    const h = howlRef.current;
    if (!h || !h.playing()) return;
    const cur = h.volume();
    if (cur <= EPS) {
      h.stop();
      h.volume(targetRef.current);
      return;
    }
    fadingRef.current = true;
    h.fade(cur, 0, ms);
    h.once("fade", () => {
      h.stop();
      h.volume(targetRef.current);
      fadingRef.current = false;
    });
  }, []);

  const stopNow = useCallback(() => {
    const h = howlRef.current;
    if (!h) return;
    h.stop();
    h.volume(targetRef.current);
  }, []);

  return {
    howl: howlRef.current,
    ensurePlaying,
    fadeOutStop,
    stopNow,
    setTargetVolume,
    getTargetVolume,
  };
}
