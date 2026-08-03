'use client';

import Link from 'next/link';

export default function Page() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-6 p-6">
      {/* タイトル */}
      <div className="mt-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Threads AI Auto Poster</h1>
        <p className="mt-1 text-sm text-gray-500">
          AIでThreadsの投稿文を生成・予約・自動投稿
        </p>
      </div>

      {/* メニュー */}
      <div className="flex flex-col gap-3">
        <Link
          href="/drafts"
          className="rounded-xl bg-blue-600 px-4 py-4 text-center font-semibold text-white shadow-sm"
        >
          ✏️ 下書きを書く
        </Link>

        <div className="rounded-xl border border-dashed border-gray-300 px-4 py-4 text-center text-sm text-gray-400">
          🤖 AIで投稿文を生成（準備中）
        </div>

        <div className="rounded-xl border border-dashed border-gray-300 px-4 py-4 text-center text-sm text-gray-400">
          📤 Threadsへ投稿（準備中）
        </div>
      </div>

      {/* 開発の進み具合 */}
      <div className="mt-2 rounded-xl bg-white/70 px-4 py-3 text-xs text-gray-500 shadow-sm">
        <p className="font-semibold text-gray-600">開発の進み具合</p>
        <ul className="mt-2 space-y-1">
          <li>✅ 下書きの保存・編集・削除</li>
          <li>✅ 画面ナビゲーション</li>
          <li>✅ Vercelで公開</li>
          <li>🔜 AI文章生成・Threads連携</li>
        </ul>
      </div>
    </main>
  );
}
