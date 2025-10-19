import { useEffect, useRef } from "react";

type Props = React.IframeHTMLAttributes<HTMLIFrameElement> & {
  src: string;
};

// オブザーバーのインスタンスを保持するためのRef
// const resizeObserverRef = useRef<ResizeObserver | null>(null);
// const mutationObserverRef = useRef<MutationObserver | null>(null);


export default function IframeAutoHeight({ src, ...rest }: Props) {
  const ref = useRef<HTMLIFrameElement | null>(null);

  // オブザーバーのインスタンスを保持
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const mutationObserverRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    const iframe = ref.current;
    if (!iframe) return;

    // 高さ設定関数を再利用しやすくするために外部に出す
    const setHeight = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc) return;

        // 💡 修正案1: 高さを一度リセットし、ブラウザのリフローを強制
        iframe.style.height = "0px";

        const h = Math.max(
          doc.documentElement.scrollHeight,
          doc.body.scrollHeight
        );

        // 計算結果を適用
        iframe.style.height = `${h}px`;
      } catch {
        // クロスオリジンの場合はアクセス不可
      }
    };

    const onLoad = () => {
      setHeight();

      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc) return;

        // 古いオブザーバーがあれば切断（内部ナビゲーションへの対応）
        resizeObserverRef.current?.disconnect();
        mutationObserverRef.current?.disconnect();

        // ----------------------------------------------------
        // 新しいオブザーバーを設定
        // ----------------------------------------------------

        // 動的変化への追随（クリック・入力・アニメーションなど）
        const resizeObs = new ResizeObserver(setHeight);
        resizeObs.observe(doc.documentElement);
        resizeObserverRef.current = resizeObs; // インスタンスをRefに保存

        const mutationObs = new MutationObserver(setHeight);
        mutationObs.observe(doc.body, {
          childList: true,
          subtree: true,
          attributes: true,
          characterData: true,
        });
        mutationObserverRef.current = mutationObs; // インスタンスをRefに保存

        // ----------------------------------------------------
        // イベントリスナーを設定
        // ----------------------------------------------------

        // イベントリスナーのリストを保持するための参照があると、クリーンアップしやすい
        const eventListeners = [
          "click",
          "input",
          "change",
          "transitionend",
          "animationend"
        ];

        eventListeners.forEach((ev) =>
          doc.addEventListener(ev, setHeight, { passive: true })
        );

        // ※このリスナー群は、次の load イベントで doc が新しくなることで自動的に破棄されます
        //   ただし、より堅牢にするなら、このリスナー群の削除も考慮すべきですが、
        //   複雑になるため、ここではオブザーバーの切断に焦点を当てます。

      } catch {
        // 別オリジンなら何もしない
      }
    };

    // 最初にロードされたとき、および内部リンクで遷移したときに毎回実行される
    iframe.addEventListener("load", onLoad);

    // 親コンポーネントがアンマウントされたときのクリーンアップ
    return () => {
      iframe.removeEventListener("load", onLoad);
      // コンポーネントがアンマウントされるときにオブザーバーを切断
      resizeObserverRef.current?.disconnect();
      mutationObserverRef.current?.disconnect();
    };
  }, []); // Biome の警告通り、src の変更を監視しなくても、load イベントで再設定できる

  return (
    <iframe
      ref={ref}
      src={src}
      style={{ width: "100%", border: "none", overflow: "hidden", minHeight: "1px" }} // minHeight を追加して、初期の高さ問題を回避
      title="Auto Height Iframe" // title 属性を追加することを推奨
      {...rest}
    />
  );
}
