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

```
■ 1. `components/rich-editor.tsx` の更新 (UI/UX)
- 「✨ AIに依頼」ボタンをクリックした際、ポップアップメニュー内のボタン一覧を隠し、「自由記述のテキスト入力フィールド（`<input type="text">`）」に表示を切り替える状態（State）を追加してください。
- 入力フィールドにはプレースホルダー（例：「AIに指示...」）を設定し、切り替わった瞬間に自動でフォーカス（`autoFocus`）を当ててください。
- ユーザーが入力フィールドに指示を入力し、Enterキーを押した際に、Vercel AI SDKの `useCompletion` の `complete` 関数を呼び出してください。
- APIに送信するリクエストボディ（`body`）には、選択中のテキスト（`selectedText`）、アクション種別（`action: 'custom'`）、およびユーザーの入力内容（`customPrompt`）を含めてください。
- AIの処理中（`isLoading`）およびストリーミング中のレスポンス（`completion`）を、ポップアップメニューの下部に拡張してリアルタイム表示するUIを追加してください。

■ 2. `app/api/completion/route.ts` の新規作成・更新 (API)
- Vercel AI SDK (`ai`, `@ai-sdk/google`) と `gemini-2.5-flash` を使用したAPIルートを作成（または更新）してください。
- リクエストから `selectedText`, `action`, `customPrompt` を受け取ってください。
- `action` が `'custom'` の場合、「あなたは優秀なアシスタントです。以下の【選択されたテキスト】に対して、【ユーザーの指示】に従って処理を行ってください。」という文脈のプロンプトを構築してください。
- `streamText` を用いて、テキストのストリーミングレスポンスをフロントエンドに返却してください。
```