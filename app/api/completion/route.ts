import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

// 必要に応じて関数実行の最大タイムアウト時間を設定（今回は30秒）
export const maxDuration = 30;

export async function POST(req: Request) {
  const { selectedText, action, customPrompt } = await req.json();

  let prompt = '';

  if (action === 'custom') {
    prompt = `あなたは優秀なアシスタントです。以下の【選択されたテキスト】に対して、【ユーザーの指示】に従って処理を行ってください。

    【選択されたテキスト】
    ${selectedText}

    【ユーザーの指示】
    ${customPrompt}`;
  } else if (action === 'summarize') {
    prompt = `あなたは優秀なエディターアシスタントです。以下の【選択されたテキスト】の要点を抽出し、簡潔な箇条書きで要約してください。

    【選択されたテキスト】
    ${selectedText}`;
  } else if (action === 'translate') {
    prompt = `あなたは優秀な翻訳アシスタントです。以下の【選択されたテキスト】の言語を自動判定し、日本語で書かれている場合は自然な英語に翻訳してください。英語やその他の言語で書かれている場合は、自然な日本語に翻訳してください。翻訳結果のテキストのみを出力し、解説などは含めないでください。

    【選択されたテキスト】
    ${selectedText}`;
  } else {
    return new Response('Invalid action', { status: 400 });
  }

  const result = streamText({
    model: google('gemini-2.5-flash'),
    prompt,
  });

  return result.toTextStreamResponse();
}