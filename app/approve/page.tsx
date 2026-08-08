'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

type Candidate = {
  id: string;
  content: string;
  status: string;
  created_at: string;
};

type Slot = { id: string; slot_time: string };

export default function ApprovePage() {
  const [theme, setTheme] = useState('');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [message, setMessage] = useState('');
  const [generating, setGenerating] = useState(false);
  const [choices, setChoices] = useState<Record<string, { day: string; time: string }>>({});

  async function loadCandidates() {
    const { data } = await supabase
      .from('post_candidates')
      .select('id, content, status, created_at')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    setCandidates(data ?? []);
  }

  async function loadSlots() {
    const { data } = await supabase
      .from('time_slots')
      .select('id, slot_time')
      .order('slot_time', { ascending: true });
    setSlots(data ?? []);
  }

  useEffect(() => {
    loadCandidates();
    loadSlots();
  }, []);

  // AIで10個生成する
  async function generate() {
    setGenerating(true);
    setMessage('AIが生成中です...少しお待ちください');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setMessage('生成エラー: ' + (data.error || '不明なエラー'));
        setGenerating(false);
        return;
      }

      const posts: string[] = data.posts ?? [];
      if (posts.length === 0) {
        setMessage('生成できませんでした。もう一度お試しください。');
        setGenerating(false);
        return;
      }

      // 生成された10個を候補として保存
      const rows = posts.map((p) => ({ content: p }));
      const { error } = await supabase.from('post_candidates').insert(rows);
      if (error) {
        setMessage('保存エラー: ' + error.message);
      } else {
        setMessage(`${posts.length}個の候補を生成しました！`);
        loadCandidates();
      }
    } catch (e) {
      setMessage('通信エラー: ' + String(e));
    }
    setGenerating(false);
  }

  function setDay(id: string, day: string) {
    setChoices((prev) => ({ ...prev, [id]: { ...prev[id], day } }));
  }
  function setTime(id: string, time: string) {
    setChoices((prev) => ({ ...prev, [id]: { ...prev[id], time } }));
  }

  async function approve(id: string) {
    const choice = choices[id];
    if (!choice || !choice.day || !choice.time) {
      setMessage('先に「今日/明日」と「時間」を選んでください。');
      return;
    }
    const base = new Date();
    if (choice.day === 'tomorrow') base.setDate(base.getDate() + 1);
    const [h, m] = choice.time.split(':').map(Number);
    base.setHours(h, m, 0, 0);

    const { error } = await supabase
      .from('post_candidates')
      .update({ status: 'approved', scheduled_at: base.toISOString() })
      .eq('id', id);
    if (error) {
      setMessage('承認エラー: ' + error.message);
    } else {
      setMessage(`承認しました（${choice.day === 'today' ? '今日' : '明日'} ${choice.time}）`);
      loadCandidates();
    }
  }

  async function reject(id: string) {
    const { error } = await supabase
      .from('post_candidates')
      .update({ status: 'rejected' })
      .eq('id', id);
    if (!error) {
      setMessage('却下しました。');
      loadCandidates();
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-4 p-6">
      <h1 className="mt-2 text-xl font-bold text-white">承認待ち</h1>

      {/* AI生成エリア */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
        <input
          type="text"
          placeholder="テーマ（空欄でおまかせ）例：副業、育児、節約"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="w-full rounded-lg bg-neutral-800 px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 outline-none"
        />
        <button
          onClick={generate}
          disabled={generating}
          className="mt-3 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {generating ? '生成中...' : '🤖 AIで10個生成'}
        </button>
      </div>

      {message && (
        <p className="rounded-2xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-center text-sm text-neutral-300">
          {message}
        </p>
      )}

      <h2 className="mt-2 text-sm font-semibold uppercase tracking-wider text-neutral-400">
        承認待ちの候補（{candidates.length}）
      </h2>
      {candidates.length === 0 ? (
        <p className="text-sm text-neutral-500">承認待ちの候補はありません。</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {candidates.map((c) => {
            const choice = choices[c.id] || { day: '', time: '' };
            return (
              <li key={c.id} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
                <p className="whitespace-pre-wrap text-sm text-neutral-100">{c.content}</p>
                <p className="mt-1 text-xs text-neutral-500">{c.content.length} 文字</p>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => setDay(c.id, 'today')}
                    className={choice.day === 'today'
                      ? 'flex-1 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white'
                      : 'flex-1 rounded-xl border border-neutral-700 px-3 py-2 text-sm text-neutral-300'}
                  >今日</button>
                  <button
                    onClick={() => setDay(c.id, 'tomorrow')}
                    className={choice.day === 'tomorrow'
                      ? 'flex-1 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white'
                      : 'flex-1 rounded-xl border border-neutral-700 px-3 py-2 text-sm text-neutral-300'}
                  >明日</button>
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  {slots.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setTime(c.id, s.slot_time)}
                      className={choice.time === s.slot_time
                        ? 'rounded-lg bg-purple-600 px-3 py-1 text-sm font-semibold text-white'
                        : 'rounded-lg border border-neutral-700 px-3 py-1 text-sm text-neutral-300'}
                    >{s.slot_time}</button>
                  ))}
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => approve(c.id)}
                    className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white"
                  >この設定で承認</button>
                  <button
                    onClick={() => reject(c.id)}
                    className="rounded-xl border border-red-500/50 px-4 py-2 text-sm font-medium text-red-400"
                  >却下</button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
