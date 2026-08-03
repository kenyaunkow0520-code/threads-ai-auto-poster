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

  async function saveDraft() {
    setLoading(true);
    setMessage('');
    if (editingId) {
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
      const { error } = await supabase.from('drafts').insert({ content });
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

  function startEdit(d: Draft) {
    setEditingId(d.id);
    setContent(d.content);
    setMessage('編集モードです。直して「更新する」を押してください。');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

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

  const over = content.length > 500;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-4 p-6">
      <h1 className="mt-2 text-xl font-bold text-white">
        {editingId ? '下書きを編集' : '下書き'}
      </h1>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
        <textarea
          placeholder="ここに下書きを入力..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          className="w-full resize-none bg-transparent text-base text-neutral-100 placeholder-neutral-600 outline-none"
        />
        <div className="mt-2 flex items-center justify-between">
          <span className={over ? 'text-xs text-red-400' : 'text-xs text-neutral-500'}>
            {content.length} / 500
          </span>
        </div>
      </div>

      <button
        onClick={saveDraft}
        disabled={loading || content.trim() === ''}
        className="rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-4 font-semibold text-white shadow-lg transition active:scale-[0.98] disabled:opacity-40"
      >
        {editingId ? '更新する' : '保存する'}
      </button>

      {editingId && (
        <button
          onClick={cancelEdit}
          className="rounded-2xl border border-neutral-700 px-5 py-3 font-medium text-neutral-300"
        >
          編集をやめる
        </button>
      )}

      {message && (
        <p className="rounded-2xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-center text-sm text-neutral-300">
          {message}
        </p>
      )}

      <h2 className="mt-4 text-sm font-semibold uppercase tracking-wider text-neutral-400">
        保存した下書き
      </h2>
      {drafts.length === 0 ? (
        <p className="text-sm text-neutral-500">まだ下書きがありません。</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {drafts.map((d) => (
            <li
              key={d.id}
              className="rounded-2xl border border-neutral-800 bg-neutral-900 px-4 py-3"
            >
              <p className="whitespace-pre-wrap text-sm text-neutral-100">{d.content}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-neutral-500">
                  {new Date(d.created_at).toLocaleString('ja-JP')}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(d)}
                    className="rounded-lg border border-indigo-500/50 px-3 py-1 text-xs font-medium text-indigo-400 transition hover:bg-indigo-500/10"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => deleteDraft(d.id)}
                    className="rounded-lg border border-red-500/50 px-3 py-1 text-xs font-medium text-red-400 transition hover:bg-red-500/10"
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
