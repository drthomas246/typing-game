---
title: 開発手順
---
## ⚙️ セットアップ手順
以下の手順で行なってください。
```bash
git clone https://github.com/yourname/typing-game.git
cd typing-game
npm install
npm run dev
```

## 📁 ディレクトリ構成
```bash
typing-game/
├── .ladle/                          # Ladle コンポーネント開発ツール設定ディレクトリ
│
├── docs/                            # 公開用ビルド出力先（GitHub Pages）
│   ├── assets/                      # アセットファイル
│   ├── images/                      # 画像ファイル
│   │   ├── background/              # backgroundイメージフォルダ
│   │   ├── icon/                    # ファビコンフォルダ
│   │   ├── map/                     # 地図イメージフォルダ
│   │   ├── monster/                 # モンスターイメージフォルダ
│   │   ├── title/                   # タイトルイメージフォルダ
│   │   ├── [Problem Image Folder]/  # 問題画像フォルダ
│   │   ├── :                        #
│   │   └── :                        #
│   ├── manual/                      # Rspress 出力（マニュアル）
│   │   ├── api/                     # API ドキュメント
│   │   ├── components/              # コンポーネントフォルダ
│   │   ├── cov/                     # カバレッジルートドキュメント出力フォルダ
│   │   ├── coverage/                # カバレッジドキュメント本体フォルダ
│   │   ├── ladle/                   # コンポーネント開発ツールルートドキュメント
│   │   ├── LadleStorys/             # コンポーネント開発ツールドキュメント本体フォルダ
│   │   ├── Overview                 # ReadMeドキュメント
│   │   └── static/                  # 静的ファイルフォルダ
│   └── music/                       # 音楽ファイル
│   │   ├── bgm/                     # バックミュージックフォルダ
│   │   └── soundEffects/            # サウントエフェクトフォルダ
├── public/                          # パブリックフォルダ
│   ├── images/                      # 画像ファイル
│   │   ├── background/              # backgroundイメージフォルダ
│   │   ├── icon/                    # ファビコンフォルダ
│   │   ├── map/                     # 地図イメージフォルダ
│   │   ├── monster/                 # モンスターイメージフォルダ
│   │   ├── title/                   # タイトルイメージフォルダ
│   │   ├── [Problem Image Folder]/  # 問題画像フォルダ
│   │   ├── :                        #
│   │   └── :                        #
│   ├── music/                       # 音楽ファイル
│   │   ├── bgm/                     # バックミュージックフォルダ
│   │   └── soundEffects/            # サウントエフェクトフォルダ
│   └── readme/                      # ReadMeドキュメント使用イメージフォルダ
│
├── site/                            # Rspress ドキュメントルート
│   ├── api/                         # API ドキュメント
│   ├── components/                  # コンポーネント
│   ├── cov/                         # カバレッジルートドキュメント
│   ├── ladle/                       # コンポーネント開発ツールルートドキュメント
│   ├── Overview/                    # ReadMeドキュメント
│   └── styles/                      # スタイルシートドキュメント
│
├── src/                             # ソースコードルート
│   ├── components/                  # コンポーネント
│   │   ├── map/                     # マップ描画UI
│   │   ├── typing/                  # タイピング関連UI
│   │   │   ├── HeaderArea/          # ヘッダー領域コンポーネント
│   │   │   ├── BattleArea/          # バトル領域コンポーネント
│   │   │   ├── AnswerArea/          # 回答領域コンポーネント
│   │   │   ├── ResultsDialog/       # 結果ダイアログコンポーネント
│   │   │   └── SettingsDrawer/      # 設定ドローワコンポーネント
│   │   ├── ui/                      # Chakra UI デフォルトコンポーネント
│   │   └── visuals/                 # HPバー等表示コンポーネント
│   ├── contexts/                    # React Contexts 設定
│   ├── data/                        # ゲームデータ（単語リスト、敵データなど）
│   │   └── texts/                   # 問題設定ファイル収納フォルダ
│   ├── db/                          # Dexie.js用設定
│   ├── hooks/                       # 自作カスタムフック
│   │   ├── typingEngine/            # タイピングエンジンフック
│   │   └── typingPage/              # タイピングページフック
│   ├── lib/                         # 汎用ユーティリティ
│   ├── Pages/                       # ページコンポーネント
│   ├── repositories/                # Dexie.js使用関数保存フォルダ
│   ├── stories/                     # Ladle コンポーネント開発ツール
│   │   └── components/              # UIコンポーネントのデモ
│   │       └── typing/              # タイピングゲームのUIコンポーネントのデモ
│   ├── types/                       # 型定義ファイル
│   ├── App.tsx                      # 全体構成ファイル
│   └── main.tsx                     # アプリエントリポイントファイル
│
├── tests/                           # テストコード
│   ├── __mocks__/                   # モックデータやモック関数を定義
│   ├── custom/                      # カスタムcss
│   ├── hooks/                       # カスタムフックのテストスクリプト
│   │   ├── typingEngine/            # タイピングエンジンフックテストスクリプト
│   │   └── typingPage/              # タイピングページフックテストスクリプト
│   ├── lib/                         # テスト用ライブラリ
│   ├── setup/                       # テスト用セットアップ
│   ├── ui/                          # テスト用UIコンポーネントのデモ
│   │   ├── ResultsDialog/           # テスト用ResultsDialogコンポーネントのデモ
│   │   └── SettingsDrawer/          # テスト用SettingsDrawerコンポーネントのデモ
│   └── utils/                       # Providersの設定
│
├── biome.json                       # Biome用 Linter / Formatter 設定
├── index.html                       # index.html
├── package.json                     # npmスクリプト・依存関係
├── rspress.config.ts                # Rspress ドキュメント設定
├── README.md                        # プロジェクト概要
├── LICENSE.md                       # ライセンス文書
├── LICENSE.EN.md                    # ライセンス文書 (English)
├── tsconfig.json                    # 全体用 TypeScript 設定
├── tsconfig.app.json                # アプリ用 TypeScript 設定
├── tsconfig.node.json               # node用 TypeScript 設定
├── tsconfig.site.json               # Rspress 用 TypeScript 設定
├── tsconfig.tests.json              # tests 用 TypeScript 設定
├── typedoc.json                     # typedoc 用設定
├── vite.config.ts                   # Vite 設定
├── vitest.config.ts                 # テスト環境全体の設定ファイル
└── vitest.setup.ts                  # テスト実行前の初期化スクリプト
```

## 🧪 スクリプト一覧
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
| `npm run test` | テスト実行(ウォッチモード) |
| `npm run test:run` | テスト実行(一度だけテストを実行して終了) |
| `npm run test:cov` | テスト実行&カバレッジレポート出力 |
| `npm run docs:build` | APIドキュメント出力 |
| `npm run docs:check` | TSDoc形式の表記チェック |
| `npm run site:dev` | Rspress ドキュメント起動 |
| `npm run site:build` | Rspress ドキュメントビルド |
| `npm run site:preview` | Rspress ドキュメントプレビュー |
| `npm run build:all` | 一括ビルド |
