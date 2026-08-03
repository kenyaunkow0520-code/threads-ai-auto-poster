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
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-6 p-6">
      {/* タイトル */}
      <div className="mt-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Threads AI Auto Poster</h1>
        <p className="mt-1 text-sm text-gray-500">
          AIでThreadsの投稿文を生成・予約・自動投稿
        </p>
      </div>

      {/* ログイン状態の表示 */}
      <div className="rounded-xl bg-white px-4 py-3 text-center text-sm shadow-sm">
        {loading ? (
          <span className="text-gray-400">確認中...</span>
        ) : email ? (
          <span className="text-gray-700">
            ログイン中：<span className="font-semibold">{email}</span>
          </span>
        ) : (
          <span className="text-gray-500">ログインしていません</span>
        )}
      </div>

      {/* ログイン済みのときのメニュー */}
      {!loading && email && (
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

          <button
            onClick={handleLogout}
            className="mt-2 rounded-xl border border-red-400 px-4 py-3 text-center font-semibold text-red-500"
          >
            ログアウト
          </button>
        </div>
      )}

      {/* 未ログインのとき */}
      {!loading && !email && (
        <Link
          href="/login"
          className="rounded-xl bg-blue-600 px-4 py-4 text-center font-semibold text-white shadow-sm"
        >
          ログイン / 新規登録
        </Link>
      )}

      {/* 開発の進み具合 */}
      <div className="mt-2 rounded-xl bg-white/70 px-4 py-3 text-xs text-gray-500 shadow-sm">
        <p className="font-semibold text-gray-600">開発の進み具合</p>
        <ul className="mt-2 space-y-1">
          <li>✅ ログイン機能</li>
          <li>✅ 下書きの保存・削除</li>
          <li>✅ 画面ナビゲーション</li>
          <li>🔜 AI文章生成・Threads連携</li>
        </ul>
      </div>
    </main>
  );
}
