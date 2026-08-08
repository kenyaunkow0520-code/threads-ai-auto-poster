import { NextResponse } from 'next/server';

// このAPIはサーバー側で動く（APIキーはブラウザに出ない）
export async function POST(request: Request) {
  try {
    const { theme } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY が設定されていません' },
        { status: 500 }
      );
    }

    // Geminiへの指示（プロンプト）
    const prompt = `あなたはSNS「Threads」の投稿文を作る専門家です。
以下の条件で、Threads用の投稿文を10個、考えてください。

# テーマ
${theme || 'おまかせ（日常・共感を集める内容）'}

# ルール
- 各投稿は日本語で、40〜120文字程度
- 自然で親しみやすい口調
- 共感されやすい、または役立つ内容
- ハッシュタグは付けない
- 絵文字は控えめに（0〜2個）
- 10個それぞれ違う内容にする

# 出力形式
必ず次のJSON形式だけで出力してください（説明文は不要）:
{"posts": ["投稿文1", "投稿文2", ..., "投稿文10"]}`;

    // Gemini API を呼ぶ
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { error: 'Gemini APIエラー: ' + errText },
        { status: 500 }
      );
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    // JSON部分を取り出す（余計な記号を除去）
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();

    let posts: string[] = [];
    try {
      const parsed = JSON.parse(cleaned);
      posts = parsed.posts ?? [];
    } catch {
      return NextResponse.json(
        { error: 'AIの出力を読み取れませんでした', raw: text },
        { status: 500 }
      );
    }

    return NextResponse.json({ posts });
  } catch (e) {
    return NextResponse.json(
      { error: 'サーバーエラー: ' + String(e) },
      { status: 500 }
    );
  }
}
