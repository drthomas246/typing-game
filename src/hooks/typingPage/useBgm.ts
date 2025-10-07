import { Howl } from "howler";
import { useEffect, useRef, useState } from "react";

/**
 * タイピング画面用BGMの再生可否を制御するフック。
 */
export function useBgm(opts: {
        src: string;
        loop?: boolean;
	volume?: number;
	enabled: boolean | undefined;
}) {
	const { src, loop = true, volume = 0.4, enabled } = opts;
	const [shouldPlay, setShouldPlay] = useState<boolean | undefined>(enabled);
	const bgmRef = useRef<Howl | null>(null);

	useEffect(() => {
		setShouldPlay(enabled);
	}, [enabled]);

	useEffect(() => {
		if (shouldPlay) {
			if (bgmRef.current?.playing()) return;

			if (!bgmRef.current) {
				bgmRef.current = new Howl({
					src: [src],
					loop,
					volume,
					html5: true,
				});
			}
			try {
				if (!bgmRef.current.playing()) {
					bgmRef.current.play();
				}
			} catch {
				/* ignore */
			}
		} else {
			if (bgmRef.current) {
				try {
					bgmRef.current.stop();
					bgmRef.current.unload();
				} catch {
					/* ignore */
				}
				bgmRef.current = null;
			}
		}
	}, [shouldPlay, src, loop, volume]);

	return { shouldPlay, setShouldPlay };
}
