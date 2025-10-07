import { useEffect, useState } from "react";

/**
 * バトル画面の敵と背景をランダムに選ぶフック。
 */
export function useRandomAssets() {
	const [enemyImg, setEnemyImg] = useState("");
	const [backgroundImg, setBackgroundImg] = useState("");

	useEffect(() => {
		const enemies = ["slime", "goblin", "dragon"];
		const e = enemies[Math.floor(Math.random() * enemies.length)];
		setEnemyImg(`./images/monster/${e}.png`);

		const b = Math.floor(Math.random() * 3);
		setBackgroundImg(`./images/background/${b}.png`);
	}, []);

	return { enemyImg, backgroundImg };
}
