'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

type Scheduled = {
  id: string;
  content: string;
  scheduled_at: string;
};

export default function SchedulePage() {
  const [items, setItems] = useState<Scheduled[]>([]);
  const [message, setMessage] = useState('');

  async function loadScheduled() {
    const { data, error } = await supabase
      .from('post_candidates')
      .select('id, content, scheduled_at')
      .eq('status', 'approved')
      .order('scheduled_at', { ascending: true });
    if (error) {
      setMessage('読み込みエラー: ' + error.message);
    } else {
      setItems(data ?? []);
    }
  }

  useEffect(() => {
    loadScheduled();
  }, []);

  // 予定を取り消して承認待ちに戻す
  async function cancelSchedule(id: string) {
    const ok = window.confirm('この予定を取り消して承認待ちに戻しますか？');
    if (!ok) return;
    const { error } = await supabase
      .from('post_candidates')
      .update({ status: 'pending', scheduled_at: null })
      .eq('id', id);
    if (!error) {
      setMessage('承認待ちに戻しました。');
      loadScheduled();
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-4 p-6">
      <h1 className="mt-2 text-xl font-bold text-white">投稿予定</h1>

      {message && (
        <p className="rounded-2xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-center text-sm text-neutral-300">
          {message}
        </p>
      )}

      {items.length === 0 ? (
        <p className="text-sm text-neutral-500">投稿予定はありません。</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4"
            >
              {/* 予定日時 */}
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-1 text-xs font-bold text-white">
                  {item.scheduled_at
                    ? new Date(item.scheduled_at).toLocaleString('ja-JP', {
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '未設定'}
                </span>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-neutral-100">
                {item.content}
              </p>
              <button
                onClick={() => cancelSchedule(item.id)}
                className="mt-3 rounded-lg border border-neutral-700 px-3 py-1 text-xs text-neutral-400"
              >
                予定を取り消す
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
