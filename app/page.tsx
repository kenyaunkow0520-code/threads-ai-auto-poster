'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default function Page() {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      setLoading(false);
    });
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setEmail(null);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 p-6 text-center">
      <div className="w-full rounded-2xl bg-white px-6 py-8 shadow-md">
        <h1 className="text-2xl font-bold text-gray-900">Threads AI Auto Poster</h1>
        <p className="mt-2 text-sm text-gray-600">
          AIでThreadsの投稿文を生成・予約・自動投稿するツール
        </p>

        <div className="mt-6 rounded-lg bg-gray-100 px-4 py-3 text-sm">
          {loading ? (
            <p className="text-gray-500">確認中...</p>
          ) : email ? (
            <p className="text-gray-700">
              ログイン中：<span className="font-semibold">{email}</span>
            </p>
          ) : (
            <p className="text-gray-700">ログインしていません</p>
          )}
        </div>

        {!loading &&
          (email ? (
            <button
              onClick={handleLogout}
              className="mt-4 w-full rounded-lg border border-red-500 px-4 py-3 font-semibold text-red-500"
            >
              ログアウト
            </button>
          ) : (
            <Link
              href="/login"
              className="mt-4 block w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white"
            >
              ログインする
            </Link>
          ))}
      </div>

      <div className="w-full rounded-lg bg-white/80 px-4 py-3 text-left text-xs text-gray-500 shadow">
        <p className="font-semibold text-gray-700">開発の進み具合</p>
        <ul className="mt-2 space-y-1">
          <li>✅ 開発環境・GitHub・公開</li>
          <li>✅ ログイン機能</li>
          <li>✅ データベース</li>
          <li>🔜 AI文章生成（第6段階）</li>
        </ul>
      </div>
    </main>
  );
}
