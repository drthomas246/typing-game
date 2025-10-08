import { useEffect, useState } from "react";

/**
 * タイピングゲームのバトル画面で使用する敵キャラクターの画像と背景画像をランダムに選択するカスタムフック。
 * コンポーネントのマウント時に一度だけ、利用可能なアセットの中からランダムに選び、そのパスを状態として提供します。
 *
 * @returns {object} ランダムに選択された敵画像と背景画像のパスを含むオブジェクト。
 * @returns {string} .enemyImg - 選択された敵キャラクターの画像パス（例: `./images/monster/slime.png`）。
 * @returns {string} .backgroundImg - 選択された背景画像のパス（例: `./images/background/0.png`）。
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
