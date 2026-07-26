export default function Page() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 p-6 text-center">
      <div className="rounded-2xl bg-white px-6 py-8 shadow-md">
        <h1 className="text-2xl font-bold text-gray-900">
          Threads AI Auto Poster
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          AIでThreadsの投稿文を生成・予約・自動投稿するツール
        </p>
        <div className="mt-6 rounded-lg bg-gray-100 px-4 py-3 text-left text-xs text-gray-500">
          <p className="font-semibold text-gray-700">開発の進み具合</p>
          <ul className="mt-2 space-y-1">
            <li>✅ 開発環境（StackBlitz）</li>
            <li>✅ GitHub連携</li>
            <li>🔜 ログイン機能（第3段階）</li>
            <li>🔜 AI文章生成（第6段階）</li>
            <li>🔜 Threads連携・投稿（第8段階〜）</li>
          </ul>
        </div>
      </div>
      <p className="text-xs text-gray-400">この画面が出れば、書き換え成功です 🎉</p>
    </main>
  );
}
