import { useCallback, useEffect, useRef, useState } from "react";
import type { SpeakOpts } from "@/types/index";

export function useSpeech() {
	const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
	const [isReady, setIsReady] = useState(false);
	const readyRef = useRef(false);

	const readyWaiters = useRef<Array<() => void>>([]);

	const lastSpeakRef = useRef<{ text: string; at: number }>({
		text: "",
		at: 0,
	});

	const currentUtterRef = useRef<SpeechSynthesisUtterance | null>(null);

	useEffect(() => {
		const load = () => {
			const v = speechSynthesis.getVoices();
			if (v?.length) {
				setVoices(v);
				readyRef.current = true;
				setIsReady(true);

				if (readyWaiters.current.length) {
					readyWaiters.current.map((resolve) => resolve());
					readyWaiters.current = [];
				}
			}
		};
		load();

		const handler = () => load();
		speechSynthesis.onvoiceschanged = handler;
		return () => {
			speechSynthesis.onvoiceschanged = null;
		};
	}, []);

	const stop = useCallback(() => {
		try {
			currentUtterRef.current = null;
			speechSynthesis.cancel();
		} catch {
			/* no-op */
		}
	}, []);

	const waitUntilReady = useCallback((): Promise<void> => {
		if (readyRef.current) return Promise.resolve();
		return new Promise<void>((resolve) => {
			readyWaiters.current.push(resolve);

			setTimeout(() => resolve(), 1000);
		});
	}, []);

	const warmup = useCallback(async () => {
		try {
			await waitUntilReady();
			speechSynthesis.cancel();
			const u = new SpeechSynthesisUtterance(".");
			u.lang = "en-US";
			u.rate = 1;
			u.pitch = 1;
			u.volume = 0;
			speechSynthesis.speak(u);
		} catch {
			/* no-op */
		}
	}, [waitUntilReady]);

	const speak = useCallback(
		(text: string, opts: SpeakOpts = {}) => {
			if (!text) return;

			const {
				lang = "en-US",
				rate = 1,
				pitch = 1,
				voiceHint = "en",
				dedupeMs = 500,
				noDedupe = false,
			} = opts;

			if (!noDedupe) {
				const now = Date.now();
				if (
					lastSpeakRef.current.text === text &&
					now - lastSpeakRef.current.at < dedupeMs
				) {
					return;
				}
				lastSpeakRef.current = { text, at: now };
			}

			stop();

			const u = new SpeechSynthesisUtterance(text);
			u.lang = lang;
			u.rate = rate;
			u.pitch = pitch;

			const voice =
				voices.find((v) => v.lang === lang) ||
				voices.find((v) => v.lang.startsWith(lang)) ||
				voices.find((v) => v.lang.startsWith(voiceHint));
			if (voice) u.voice = voice;

			u.onend = () => {
				if (currentUtterRef.current === u) currentUtterRef.current = null;
			};
			u.onerror = () => {
				if (currentUtterRef.current === u) currentUtterRef.current = null;
			};

			setTimeout(
				() => {
					try {
						currentUtterRef.current = u;

						if (speechSynthesis.paused) {
							try {
								speechSynthesis.resume();
							} catch {
								/* no-op */
							}
						}

						speechSynthesis.speak(u);
					} catch {
						/* no-op */
					}
				},
				readyRef.current ? 0 : 60,
			);
		},
		[voices, stop],
	);

	return { speak, stop, voices, isReady, waitUntilReady, warmup };
}
