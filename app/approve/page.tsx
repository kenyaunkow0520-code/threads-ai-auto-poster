'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

type Candidate = {
  id: string;
  content: string;
  status: string;
  created_at: string;
};

export default function ApprovePage() {
  const [content, setContent] = useState('');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [message, setMessage] = useState('');

  // 承認待ちの候補を読み込む
  async function loadCandidates() {
    const { data, error } = await supabase
      .from('post_candidates')
      .select('id, content, status, created_at')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    if (error) {
      setMessage('読み込みエラー: ' + error.message);
    } else {
      setCandidates(data ?? []);
    }
  }

  useEffect(() => {
    loadCandidates();
  }, []);

  // 候補を手動で追加（テスト用。あとでAI生成に置き換え）
  async function addCandidate() {
    if (content.trim() === '') return;
    const { error } = await supabase
      .from('post_candidates')
      .insert({ content });
    if (error) {
      setMessage('追加エラー: ' + error.message);
    } else {
      setContent('');
      loadCandidates();
    }
  }

  // 承認する
  async function approve(id: string) {
    const { error } = await supabase
      .from('post_candidates')
      .update({ status: 'approved' })
      .eq('id', id);
    if (error) {
      setMessage('承認エラー: ' + error.message);
    } else {
      setMessage('承認しました。');
      loadCandidates();
    }
  }

  // 却下する
  async function reject(id: string) {
    const { error } = await supabase
      .from('post_candidates')
      .update({ status: 'rejected' })
      .eq('id', id);
    if (error) {
      setMessage('却下エラー: ' + error.message);
    } else {
      setMessage('却下しました。');
      loadCandidates();
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-4 p-6">
      <h1 className="mt-2 text-xl font-bold text-white">承認待ち</h1>

      {/* テスト用：手動で候補を追加 */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
        <textarea
          placeholder="テスト用：候補を手入力..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          className="w-full resize-none bg-transparent text-base text-neutral-100 placeholder-neutral-600 outline-none"
        />
        <button
          onClick={addCandidate}
          className="mt-2 w-full rounded-xl border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-300"
        >
          候補に追加
        </button>
      </div>

      {message && (
        <p className="rounded-2xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-center text-sm text-neutral-300">
          {message}
        </p>
      )}

      {/* 承認待ち一覧 */}
      <h2 className="mt-2 text-sm font-semibold uppercase tracking-wider text-neutral-400">
        承認待ちの候補（{candidates.length}）
      </h2>
      {candidates.length === 0 ? (
        <p className="text-sm text-neutral-500">承認待ちの候補はありません。</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {candidates.map((c) => (
            <li
              key={c.id}
              className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4"
            >
              <p className="whitespace-pre-wrap text-sm text-neutral-100">
                {c.content}
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                {c.content.length} 文字
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => approve(c.id)}
                  className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  承認
                </button>
                <button
                  onClick={() => reject(c.id)}
                  className="flex-1 rounded-xl border border-red-500/50 px-4 py-2 text-sm font-medium text-red-400"
                >
                  却下
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
