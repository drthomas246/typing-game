import * as BGM from "@/lib/bgmManager";
import { useCallback, useEffect } from "react";

export function useBgm(src: string, defaultVolume = 0.5) {
	useEffect(() => {
		BGM.init(src, defaultVolume, true);
	}, [src, defaultVolume]);

	const ensurePlaying = useCallback((ms?: number, to?: number) => {
		BGM.ensurePlaying(ms, to);
	}, []);
	const fadeOutStop = useCallback((ms?: number) => {
		BGM.fadeOutStop(ms);
	}, []);
	const stopNow = useCallback(() => {
		BGM.stopNow();
	}, []);
	const setTargetVolume = useCallback((v: number) => {
		BGM.setTargetVolume(v);
	}, []);
	const getTargetVolume = useCallback(() => BGM.getTargetVolume(), []);

	return {
		ensurePlaying,
		fadeOutStop,
		stopNow,
		setTargetVolume,
		getTargetVolume,
	};
}
