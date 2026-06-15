# Harness Engineering Log (AI Prompt History)

- このファイルは、VS Code + Gemini Code Assist を用いた開発において、AIの挙動を制御・最適化するために設計したプロンプトの記録です。
- プロンプトと修正ファイルをいっしょにコミットしていきます

## プロンプト

```
プロジェクトのルートにある `AGENTS.md` のルール（フロントエンド主導のUX最優先、Selection APIの適切なハンドリングなど）に従い、以下の2つのファイルを作成および更新してください。

■ 1. `app/page.tsx` の更新
- `components/rich-editor.tsx` を中央に配置するシンプルなレイアウトを作成してください。
- Tailwind CSSを使用して、グレー系の背景色や適切な余白を設定してください。

■ 2. `components/rich-editor.tsx` の新規作成
以下の仕様を満たすコンポーネントを作成してください。
- `'use client'` を宣言すること。
- `contentEditable` を使用したエディタエリア（`min-h-[500px]` 程度）を作成すること。プレースホルダーとなるダミーテキストも最初から入れておくこと。
- `window.getSelection()` を使用し、`onMouseUp` と `onKeyUp` イベントでテキスト選択状態を検知すること。
- テキストが選択された場合、`getRangeAt(0).getBoundingClientRect()` を用いて座標を計算し、選択範囲の真上（スクロール量 `window.scrollY` 等も考慮）に絶対配置（`absolute`）でダミーのAIアシストメニューをポップアップ表示させること。
- メニューには「✨ AIに依頼」「要約する」「翻訳する」などのダミーボタンを横並びで配置すること。
- エディタ外（またはメニュー外）をクリックした際、あるいは選択が解除された際にメニューを閉じる処理を入れること。
```