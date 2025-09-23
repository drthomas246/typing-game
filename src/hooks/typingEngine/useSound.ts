import { Howl } from "howler";
import { useCallback, useEffect, useRef } from "react";
import { useSound as useBGMSound } from "@/contexts/PageContext";
import type { EngineOptions, HowlOrNull, SoundCtl } from "@/types/index";

export function useSound(opts: EngineOptions): SoundCtl {
	const sound = useBGMSound();
	const bgmEnabled = sound;
	const bgmSrc = opts.bgmSrc ?? "./music/bgm/battle.mp3";
	const bgmVolume = Math.min(1, Math.max(0, opts.bgmVolume ?? 0.5));
	const bgmRef = useRef<HowlOrNull>(null);

	const playBgm = useCallback(() => {
		if (!bgmEnabled) return;
		if (bgmRef.current?.playing()) return;
		if (bgmRef.current) {
			try {
				bgmRef.current.stop();
				bgmRef.current.unload();
			} catch {
				/* ignore */
			}
			bgmRef.current = null;
		}
		const howl = new Howl({
			src: [bgmSrc],
			loop: true,
			volume: bgmVolume,
			html5: false,
		});
		bgmRef.current = howl;
		howl.play();
	}, [bgmEnabled, bgmSrc, bgmVolume]);

	const stopBgm = useCallback(() => {
		if (!bgmRef.current) return;
		try {
			bgmRef.current.stop();
			bgmRef.current.unload();
		} catch {
			/* ignore */
		}
		bgmRef.current = null;
	}, []);

	const sfxEnabled = sound;
	const sfxVolume = Math.min(1, Math.max(0, opts.sfxVolume ?? 0.8));
	const ref = useRef<{
		slash: HowlOrNull;
		punch: HowlOrNull;
		defeat: HowlOrNull;
		escape: HowlOrNull;
		fallDown: HowlOrNull;
		levelUp: HowlOrNull;
		keyOn: HowlOrNull;
	}>({
		slash: null,
		punch: null,
		defeat: null,
		escape: null,
		fallDown: null,
		levelUp: null,
		keyOn: null,
	});

	const src = {
		slash: opts.sfxSlashSrc ?? "./music/soundEffects/killInSword.mp3",
		punch: opts.sfxPunchSrc ?? "./music/soundEffects/punch.mp3",
		defeat: opts.sfxDefeatSrc ?? "./music/soundEffects/defeat.mp3",
		escape: opts.sfxEscapeSrc ?? "./music/soundEffects/escape.mp3",
		fallDown: opts.sfxFallDownSrc ?? "./music/soundEffects/fallDown.mp3",
		levelUp: opts.sfxLevelUpSrc ?? "./music/soundEffects/lvup.mp3",
		keyOn: opts.sfxKeyOnSrc ?? "./music/soundEffects/keyon.mp3",
	};

	const ensure = (k: keyof typeof ref.current, path: string) => {
		if (!ref.current[k]) {
			ref.current[k] = new Howl({
				src: [path],
				volume: sfxVolume,
				html5: false,
			});
		}
	};

	const play = (k: keyof typeof ref.current, path: string) => {
		if (!sfxEnabled) return;
		ensure(k, path);
		try {
			ref.current[k]?.play();
		} catch {
			/* ignore */
		}
	};

	useEffect(() => {
		return () => {
			stopBgm();
			try {
				ref.current.slash?.unload();
			} catch {
				/* ignore */
			}
			try {
				ref.current.punch?.unload();
			} catch {
				/* ignore */
			}
			try {
				ref.current.defeat?.unload();
			} catch {
				/* ignore */
			}
			try {
				ref.current.escape?.unload();
			} catch {
				/* ignore */
			}
			try {
				ref.current.fallDown?.unload();
			} catch {
				/* ignore */
			}
			try {
				ref.current.levelUp?.unload();
			} catch {
				/* ignore */
			}
			try {
				ref.current.keyOn?.unload();
			} catch {
				/* ignore */
			}
			ref.current = {
				slash: null,
				punch: null,
				defeat: null,
				escape: null,
				fallDown: null,
				levelUp: null,
				keyOn: null,
			};
		};
	}, [stopBgm]);

	return {
		playBgm,
		stopBgm,
		sfx: {
			slash: () => play("slash", src.slash),
			punch: () => play("punch", src.punch),
			defeat: () => play("defeat", src.defeat),
			escape: () => play("escape", src.escape),
			fallDown: () => play("fallDown", src.fallDown),
			levelUp: () => play("levelUp", src.levelUp),
			keyOn: () => play("keyOn", src.keyOn),
		},
	};
}
