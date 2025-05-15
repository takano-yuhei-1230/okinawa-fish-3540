'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // App Router 用の useRouter

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null); // 前のエラーをクリア

    try {
      const result = await signIn('credentials', {
        redirect: false, // 自前でリダイレクト処理するため false
        username,
        password,
      });

      if (result?.error) {
        setError('ユーザーIDまたはパスワードが正しくありません。');
        console.error('Login failed:', result.error);
      } else if (result?.ok) {
        // ログイン成功時はトップページなどにリダイレクト
        router.push('/');
      } else {
        setError('ログイン処理中に不明なエラーが発生しました。');
      }
    } catch (err) {
      console.error('Login submission error:', err);
      setError('ログインリクエストの送信に失敗しました。');
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md'>
        <h2 className='text-2xl font-bold text-center text-gray-900'>ログイン</h2>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label htmlFor='username' className='block text-sm font-medium text-gray-700'>
              ユーザーID
            </label>
            <input
              id='username'
              name='username'
              type='text'
              autoComplete='username'
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className='block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
            />
          </div>

          <div>
            <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
              パスワード
            </label>
            <input
              id='password'
              name='password'
              type='password'
              autoComplete='current-password'
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
            />
          </div>

          {error && (
            <p className='text-sm text-red-600'>{error}</p>
          )}

          <div>
            <button
              type='submit'
              className='flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            >
              ログイン
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
