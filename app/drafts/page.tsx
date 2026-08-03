'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

type Draft = {
  id: string;
  content: string;
  created_at: string;
};

export default function DraftsPage() {
  const [content, setContent] = useState('');
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  // 編集中の下書きID（新規作成中はnull）
  const [editingId, setEditingId] = useState<string | null>(null);

  async function loadDrafts() {
    const { data, error } = await supabase
      .from('drafts')
      .select('id, content, created_at')
      .order('created_at', { ascending: false });
    if (error) {
      setMessage('読み込みエラー: ' + error.message);
    } else {
      setDrafts(data ?? []);
    }
  }

  useEffect(() => {
    loadDrafts();
  }, []);

  // 保存（新規）または更新（編集中）
  async function saveDraft() {
    setLoading(true);
    setMessage('');
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) {
      setMessage('ログインしていません。先にログインしてください。');
      setLoading(false);
      return;
    }

    if (editingId) {
      // 編集中 → 更新
      const { error } = await supabase
        .from('drafts')
        .update({ content })
        .eq('id', editingId);
      if (error) {
        setMessage('更新エラー: ' + error.message);
      } else {
        setMessage('更新しました！');
        setContent('');
        setEditingId(null);
        loadDrafts();
      }
    } else {
      // 新規 → 保存
      const { error } = await supabase
        .from('drafts')
        .insert({ user_id: user.id, content });
      if (error) {
        setMessage('保存エラー: ' + error.message);
      } else {
        setMessage('保存しました！');
        setContent('');
        loadDrafts();
      }
    }
    setLoading(false);
  }

  // 編集を開始（入力欄に読み込む）
  function startEdit(d: Draft) {
    setEditingId(d.id);
    setContent(d.content);
    setMessage('編集モードです。直して「更新する」を押してください。');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // 編集をやめる
  function cancelEdit() {
    setEditingId(null);
    setContent('');
    setMessage('');
  }

  async function deleteDraft(id: string) {
    const ok = window.confirm('この下書きを削除しますか？');
    if (!ok) return;
    const { error } = await supabase.from('drafts').delete().eq('id', id);
    if (error) {
      setMessage('削除エラー: ' + error.message);
    } else {
      setMessage('削除しました。');
      loadDrafts();
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-4 p-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {editingId ? '下書きを編集' : '下書き'}
      </h1>

      <textarea
        placeholder="ここに下書きを入力..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        className="rounded-lg border border-gray-300 px-4 py-3 text-base"
      />
      <p
        className={
          content.length > 500
            ? 'text-right text-xs text-red-500'
            : 'text-right text-xs text-gray-400'
        }
      >
        {content.length} / 500
      </p>

      <button
        onClick={saveDraft}
        disabled={loading || content.trim() === ''}
        className="rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-50"
      >
        {editingId ? '更新する' : '保存する'}
      </button>

      {editingId && (
        <button
          onClick={cancelEdit}
          className="rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-600"
        >
          編集をやめる
        </button>
      )}

      {message && (
        <p className="rounded-lg bg-gray-100 px-4 py-3 text-center text-sm text-gray-700">
          {message}
        </p>
      )}

      <h2 className="mt-4 text-lg font-semibold text-gray-800">保存した下書き</h2>
      {drafts.length === 0 ? (
        <p className="text-sm text-gray-500">まだ下書きがありません。</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {drafts.map((d) => (
            <li
              key={d.id}
              className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800"
            >
              <p className="whitespace-pre-wrap">{d.content}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {new Date(d.created_at).toLocaleString('ja-JP')}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(d)}
                    className="rounded-md border border-blue-400 px-3 py-1 text-xs font-semibold text-blue-500"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => deleteDraft(d.id)}
                    className="rounded-md border border-red-400 px-3 py-1 text-xs font-semibold text-red-500"
                  >
                    削除
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
