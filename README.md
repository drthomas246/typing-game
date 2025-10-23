# 🧙‍♂️ ことばの魔王とえいごの勇者
*英単語で戦う、学習型タイピングRPG*

**Version:** 0.1.0
**Author:** Dr?Thomas（Yamahara Yoshihiro）

---

## 📖 概要（Overview）
「ことばの魔王とえいごの勇者」は、英単語タイピングを通して敵と戦う
教育向けのファンタジーRPGです。
プレイヤーは「えいごの勇者」として、ことばの魔王を倒す旅に出ます。
学びとバトルが融合した、新しい学習体験を提供します。

---

## ✨ 主な特徴（Features）
- 🎮 **タイピングバトルシステム**：英単語入力で攻撃・スキル発動
- 🧩 **マップ探索UI**：React-Konvaによる直感的な移動
- 🎧 **BGM・効果音制御**：Howler.jsによる音管理
- 💾 **進捗の自動保存**：Dexie.js（IndexedDB）によるローカル保存
- 📚 **ドキュメント自動生成**：Rspress + TypeDoc
- 🧪 **単体テスト＆カバレッジ**：Vitest + HTMLレポート
- 🎨 **柔軟なUI設計**：Chakra UI + Framer MotionによるアニメーションUI

---

## 🧰 技術スタック（Tech Stack）

| 分類 | 使用技術 |
|------|-----------|
| フロントエンド | React + TypeScript + Vite |
| UI / アニメーション | Chakra UI / Framer Motion |
| オーディオ | Howler.js |
| 永続化 | Dexie.js |
| 描画 | React-Konva |
| テスト | Vitest |
| ドキュメント | Rspress / TypeDoc / Ladle |
| Lint / Format | Biome |

---

## 📁 ディレクトリ構成（Project Structure）
```bash
typing-game/
├── .ladle/                      # Ladle コンポーネント開発ツールルートディレクトリ
├── docs/                        # 公開用ビルド出力先（GitHub Pages）
│   ├── assets/                  # アセットファイル
│   ├── images/                  # 画像ファイル
│   │   ├── background/          # backgroundイメージフォルダ
│   │   ├── icon/                # ファビコンフォルダ
│   │   ├── map/                 # 地図イメージフォルダ
│   │   ├── monster/             # モンスターイメージフォルダ
│   │   ├── title/               # タイトルイメージフォルダ
│   │   ├── [問題画像フォルダ]/  # 問題画像フォルダ
│   │   ├── :
│   │   └── :
│   ├── manual/                  # Rspress 出力（マニュアル）
│   │   ├── api/                 # API ドキュメント
│   │   ├── components/          # コンポーネント
│   │   ├── cov/                 # カバレッジルートドキュメント
│   │   ├── coverage/            # カバレッジドキュメント
│   │   ├── ladle/               # コンポーネント開発ツールルートドキュメント
│   │   ├── LadleStorys/         # コンポーネント開発ツールドキュメント
│   │   ├── Overview             # ReadMeドキュメント
│   │   └── static/              # スタティックファイル
│   └── music/                   # 音楽ファイル
│   │   ├── bgm/                 # バックミュージックフォルダ
│   │   └── soundEffects/        # 差ウントエフェクトフォルダ
├── public/                      # パブリックフォルダ
│   ├── images/                  # 画像ファイル
│   │   ├── background/          # backgroundイメージフォルダ
│   │   ├── icon/                # ファビコンフォルダ
│   │   ├── map/                 # 地図イメージフォルダ
│   │   ├── monster/             # モンスターイメージフォルダ
│   │   ├── title/               # タイトルイメージフォルダ
│   │   ├── [問題画像フォルダ]/  # 問題画像フォルダ
│   │   ├── :
│   │   └── :
│   └── music/                   # 音楽ファイル
│       ├── bgm/                 # バックミュージックフォルダ
│       └── soundEffects/        # 差ウントエフェクトフォルダ
├── site/                        # Rspress ドキュメントルート
│   ├── api/                     # API ドキュメント
│   ├── components/              # コンポーネント
│   ├── cov/                     # カバレッジルートドキュメント
│   ├── ladle/                   # コンポーネント開発ツールルートドキュメント
│   ├── Overview/                # ReadMeドキュメント
│   └── styles/                  # スタイルシートドキュメント
├── src/                         # ソースコードルート
│   ├── components/              # コンポーネント
│   │   ├── map/                 # マップ描画UI（React-Konva）
│   │   ├── typing/              # タイピング関連UI
│   │   │   ├── HeaderArea/      # ヘッダー領域コンポーネント
│   │   │   ├── BattleArea/      # バトル領域コンポーネント
│   │   │   ├── AnswerArea/      # 回答領域コンポーネント
│   │   │   ├── ResultsDialog/   # 結果ダイアログコンポーネント
│   │   │   └── SettingsDrawer/  # 設定ドローワコンポーネント
│   │   ├── ui/                  # Chakra UI ラッパー
│   │   └── visuals/             # HPバー当表示コンポーネント
│   ├── contexts/                # グローバル状態（PageProviderなど）
│   ├── data/                    # ゲームデータ（単語リスト、敵データなど）
│   │   └── texts/               # マップ描画UI（React-Konva）
│   ├── db/                      # データベース関連
│   ├── hooks/                   # カスタムフック（useTypingEngine等）
│   │   ├── typingEngine/        # タイピングエンジンフック
│   │   └── typingPage/          # タイピングページフック
│   ├── lib/                     # 汎用ユーティリティ（nextFrame, bgmManagerなど）
│   ├── Pages/                   # ページコンポーネント（Home、TypingGameなど）
│   ├── repositories/            # リポジトリ（データベースアクセスなど）
│   ├── stories/                 # ストーリー（UIコンポーネントのデモ）
│   │   └── components/          # UIコンポーネントのデモ
│   │       └── typing/          # タイピングゲームのUIコンポーネントのデモ
│   ├── types/                   # タイプ定義ファイル
│   ├── App.tsx                  # 全体構成（Providerなど）
│   └── main.tsx                 # アプリエントリポイント
├── tests/                       # テストコード
│   ├── __mocks__/               # モックデータやモック関数を定義
│   ├── custom/                  # カスタムcss
│   ├── hooks/                   # カスタムフックのテストスクリプト
│   │   ├── typingEngine/        # タイピングエンジンフックテストスクリプト
│   │   └── typingPage/          # タイピングページフックテストスクリプト
│   ├── lib/                     # テスト用ライブラリ
│   ├── setup/                   # テスト用セットアップ
│   ├── ui/                      # テスト用UIコンポーネントのデモ
│   │   ├── ResultsDialog/       # テスト用ResultsDialogコンポーネントのデモ
│   │   └── SettingsDrawer/      # テスト用SettingsDrawerコンポーネントのデモ
│   └── utils/                   # Providersの設定
├── biome.json                   # Linter / Formatter 設定（Biome）
├── index.html                   # index.html
├── package.json                 # npmスクリプト・依存関係
├── rspress.config.ts            # Rspress ドキュメント設定
├── README.md                    # プロジェクト概要（このファイル）
├── LICENSE.txt                  # ライセンス文書
├── tsconfig.json                # TypeScript 設定
├── tsconfig.app.json            # アプリ用 TypeScript 設定
├── tsconfig.node.json           # node用 TypeScript 設定
├── tsconfig.site.json           # Rspress 用 TypeScript 設定
├── tsconfig.tests.json          # tests 用 TypeScript 設定
├── typedoc.json                 # typedoc 用設定
├── vite.config.ts               # Vite 設定（alias: "@/..."）
├── vitest.config.ts             # テスト環境全体の設定ファイル
├── vitest.setup.ts              # テスト実行前の初期化スクリプト
```

---

## ⚙️ セットアップ手順（Setup）
```bash
git clone https://github.com/yourname/typing-rpg.git
cd typing-rpg
npm install
npm run dev
```

---

## 🧪 スクリプト一覧（Available Scripts）

| コマンド | 説明 |
|-----------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 本番ビルド |
| `npm run preview` | 本番ビルドしたアプリをローカルでプレビュー |
| `npm run format` | コードフォーマット |
| `npm run lint` | コードの lint |
| `npm run ladle` | テスト実行 |
| `npm run ladle:build` | テストビルド |
| `npm run ladle:preview` | テストプレビュー |
| `npm run test` | テスト実行 |
| `npm run test:run` | テスト実行 |
| `npm run test:cov` | カバレッジレポート出力 |
| `npm run docs:build` | アプリケーションファンクション出力 |
| `npm run docs:check` | dooc定義チェック |
| `npm run site:dev` | Rspress ドキュメント起動 |
| `npm run site:build` | Rspress ドキュメントビルド |
| `npm run site:preview` | Rspress ドキュメントプレビュー |

---

## 🖼️ スクリーンショット例（Screenshots）

<table style="table-layout: fixed; width: 100%;">
  <colgroup>
    <col style="width: 33%;">
    <col style="width: 33%;">
    <col style="width: 33%;">
  </colgroup>
  <tr>
    <th>バトル画面</th>
    <th>結果画面</th>
    <th>マップ画面</th>
  </tr>
  <tr>
    <td><img src="./public/readme/monsterScreenShot.png" alt="Monster Screen Shot" width="100%"></td>
    <td><img src="./public/readme/resultScreenShot.png" alt="Result Screen Shot" width="100%"></td>
    <td><img src="./public/readme/mapScreenShot.png" alt="Map Screen Shot" width="100%"></td>
  </tr>
</table>

---

## 💡 開発方針（Design Philosophy）
- 学び × 遊び × 挑戦 の三位一体設計
- Type-Safe & Modular を徹底した拡張性のある設計
- オフライン対応（Dexie.js）
- 子どもにも理解しやすい操作・UI設計

---

## 🗺️ 今後のロードマップ（Roadmap）
- [ ] ストーリーモード実装
- [ ] 英文モード追加
- [ ] 新モンスター（ゴブリン・ドラゴン）追加
- [ ] モバイル最適化
- [ ] ボイスサポート機能

---

## 🪪 ライセンス（License）

**短縮版：**
> © 2025 Dr?Thomas（こと Yamahara Yoshihiro）
> 個人利用は自由、商用利用・公開時は要連絡および原作者表記必須。
> 改変は公開しない限り自由に行えます。

**詳細は [LICENSE.md](./LICENSE.md) を参照してください。**

---

## 👤 作者情報（Author & Links）

- 🧑‍💻 **作者:** Dr?Thomas（Yamahara Yoshihiro）
- 🌐 **Website:** [https://www.hobofoto.work](https://www.hobofoto.work)
- 📖 **Docs:** [https://drthomas246.github.io/typing-game/docs/](https://drthomas246.github.io/typing-game/docs/)
- 🎮 **Demo:** [https://drthomas246.github.io/typing-game/](https://drthomas246.github.io/typing-game/)
