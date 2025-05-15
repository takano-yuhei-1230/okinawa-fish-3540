'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  return (
    <header className='bg-gray-800 text-white p-4'>
      <nav className='container mx-auto flex justify-between items-center'>
        <div className="flex items-center space-x-4">
          <Link href='/' className='text-xl font-bold'>
            沖縄の魚たち
          </Link>
          {!isLoading && session && (
            <Link href='/fish/new' className='text-sm hover:text-gray-300'>
              新規登録
            </Link>
          )}
        </div>
        <div className='space-x-4 flex items-center'>
          {isLoading ? (
            <p className='text-sm'>読み込み中...</p>
          ) : session ? (
            <>
              <span className='text-sm'>ようこそ、{session.user?.name || 'ユーザー'}さん</span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className='bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm'
              >
                ログアウト
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn()}
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm'
            >
              ログイン
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
