import { useEffect, useRef } from "react";
import { useBattle } from "@/contexts/PageContext";
import { useSpeech } from "@/hooks/useSpeech";
import type { EngineOptions, EngineState } from "@/types/index";

export function useSpeechOnce(params: {
	state: EngineState;
	opts: EngineOptions;
	lang?: string;
}) {
	const battle = useBattle();
	const { state, lang = "en-US" } = params;
	const { speak } = useSpeech();
	const spokenRef = useRef<string>("");

	useEffect(() => {
		if (!state.started || state.finished) return;
		if (!battle) return;
		if (!state.answerEn) return;
		if (state.learningPhase !== "study") return;

		const key = `${state.index}:${state.answerEn}`;
		if (spokenRef.current !== key) {
			spokenRef.current = key;
			try {
				speak(state.answerEn, { lang });
			} catch {
				try {
					/* @ts-expect-error Compatible call */
					speak(state.answerEn, lang);
				} catch {
					/* ignore */
				}
			}
		}
	}, [state, battle, lang, speak]);
}
