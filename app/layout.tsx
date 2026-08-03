import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Threads AI Auto Poster',
  description: 'AIによるThreads投稿文の生成・予約投稿・完全自動投稿ツール',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-neutral-950 text-neutral-100 antialiased">
        <div className="pb-20">{children}</div>

        <nav className="fixed bottom-0 left-0 right-0 border-t border-neutral-800 bg-neutral-900/95 backdrop-blur">
          <div className="mx-auto flex max-w-md items-center justify-around">
            <Link
              href="/"
              className="flex-1 py-4 text-center text-xs font-medium text-neutral-300 transition hover:text-white"
            >
              🏠<br />ホーム
            </Link>
            <Link
              href="/approve"
              className="flex-1 py-4 text-center text-xs font-medium text-neutral-300 transition hover:text-white"
            >
              ✅<br />承認待ち
            </Link>
            <Link
              href="/drafts"
              className="flex-1 py-4 text-center text-xs font-medium text-neutral-300 transition hover:text-white"
            >
              ✏️<br />下書き
            </Link>
          </div>
        </nav>
      </body>
    </html>
  );
}
