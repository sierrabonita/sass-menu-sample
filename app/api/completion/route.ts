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
  } else {
    return new Response('Invalid action', { status: 400 });
  }

  const result = streamText({
    model: google('gemini-2.5-flash'),
    prompt,
  });

  return result.toTextStreamResponse();
}