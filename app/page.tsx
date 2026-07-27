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
              onClick={
