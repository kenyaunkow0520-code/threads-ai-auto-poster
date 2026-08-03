'use client';

import Link from 'next/link';

export default function Page() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-6 p-6">
      {/* タイトル */}
      <div className="mt-6 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl shadow-lg">
          🧵
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Threads AI Auto Poster
        </h1>
        <p className="mt-1 text-sm text-neutral-400">
          AIでThreadsの投稿文を生成・予約・自動投稿
        </p>
      </div>

      {/* メニュー */}
      <div className="flex flex-col gap-3">
        <Link
          href="/drafts"
          className="rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-4 font-semibold text-white shadow-lg transition active:scale-[0.98]"
        >
          ✏️ 下書きを書く
        </Link>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 px-5 py-4 text-sm text-neutral-500">
          🤖 AIで投稿文を生成（準備中）
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 px-5 py-4 text-sm text-neutral-500">
          📤 Threadsへ投稿（準備中）
        </div>
      </div>

      {/* 開発の進み具合 */}
      <div className="mt-2 rounded-2xl border border-neutral-800 bg-neutral-900 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
          開発の進み具合
        </p>
        <ul className="mt-3 space-y-2 text-sm text-neutral-300">
          <li>✅ 下書きの保存・編集・削除</li>
          <li>✅ 画面ナビゲーション</li>
          <li>✅ Vercelで公開</li>
          <li className="text-neutral-500">🔜 AI文章生成・Threads連携</li>
        </ul>
      </div>
    </main>
  );
}
