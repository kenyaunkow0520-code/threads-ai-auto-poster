import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Threads AI Auto Poster',
  description: 'AIによるThreads投稿文の生成・予約投稿・完全自動投稿ツール',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        {/* ページ本体（下部ナビと重ならないよう下に余白） */}
        <div className="pb-20">{children}</div>

        {/* 画面下の固定ナビ */}
        <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white">
          <div className="mx-auto flex max-w-md items-center justify-around">
            <Link
              href="/"
              className="flex-1 py-3 text-center text-sm font-semibold text-gray-700"
            >
              ホーム
            </Link>
            <Link
              href="/drafts"
              className="flex-1 py-3 text-center text-sm font-semibold text-gray-700"
            >
              下書き
            </Link>
            <Link
              href="/login"
              className="flex-1 py-3 text-center text-sm font-semibold text-gray-700"
            >
              ログイン
            </Link>
          </div>
        </nav>
      </body>
    </html>
  );
}
