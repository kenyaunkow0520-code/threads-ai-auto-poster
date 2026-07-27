'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // 新規登録
  async function handleSignUp() {
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setMessage('登録エラー: ' + error.message);
    } else {
      setMessage('確認メールを送信しました。メールのリンクを開いてください。');
    }
    setLoading(false);
  }

  // ログイン → 成功したらトップページへ移動
  async function handleSignIn() {
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage('ログインエラー: ' + error.message);
      setLoading(false);
    } else {
      setMessage('ログイン成功しました！移動します...');
      router.push('/');
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 p-6">
      <h1 className="text-center text-2xl font-bold text-gray-900">ログイン</h1>

      <input
        type="email"
        placeholder="メールアドレス"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="rounded-lg border border-gray-300 px-4 py-3 text-base"
      />
      <input
        type="password"
        placeholder="パスワード（6文字以上）"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="rounded-lg border border-gray-300 px-4 py-3 text-base"
      />

      <button
        onClick={handleSignIn}
        disabled={loading}
        className="rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-50"
      >
        ログイン
      </button>
      <button
        onClick={handleSignUp}
        disabled={loading}
        className="rounded-lg border border-blue-600 px-4 py-3 font-semibold text-blue-600 disabled:opacity-50"
      >
        新規登録
      </button>

      {message && (
        <p className="rounded-lg bg-gray-100 px-4 py-3 text-center text-sm text-gray-700">
          {message}
        </p>
      )}
    </main>
  );
}
