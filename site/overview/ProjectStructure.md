---
title: 📁 ディレクトリ構成（Project Structure）
---
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
