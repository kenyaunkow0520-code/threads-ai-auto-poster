import { NextResponse } from 'next/server';

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

    // 今日の日付から季節を判定
    const now = new Date();
    const month = now.getMonth() + 1;
    let season = '';
    if (month >= 3 && month <= 5) season = '春';
    else if (month >= 6 && month <= 8) season = '夏';
    else if (month >= 9 && month <= 11) season = '秋';
    else season = '冬';

    // アカウントの固定テーマ ＋ 今の季節を反映
    const prompt = `あなたは「季節ごとのライフハック」を発信する人気Threadsアカウントの中の人です。
読者が「知れてよかった！」「保存しておこう」と思う、実用的な生活の知恵を投稿します。

# 今の季節
${season}（${month}月）

# 今回のテーマ
${theme || `${season}に役立つライフハック（おまかせ）`}

# 投稿のルール
- 各投稿は日本語で40〜120文字程度
- 「${season}」の生活シーンに合った、今すぐ使える具体的な知恵
- 例：暑さ・寒さ対策、食材の保存、掃除、節約、体調管理、便利グッズの使い方など
- 「へぇ！」となる意外性や、すぐ試せる手軽さを大切に
- 押しつけがましくない、親しみやすい口調
- ハッシュタグは付けない
- 絵文字は0〜2個まで
- 10個すべて違う切り口にする（食・住・健康・掃除・節約などバラけさせる）

# 出力形式
必ず次のJSON形式だけで出力してください（説明文は不要）:
{"posts": ["投稿文1", "投稿文2", ..., "投稿文10"]}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`,
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
