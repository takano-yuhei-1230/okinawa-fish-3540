import Link from 'next/link';
import { Fish } from '@/types/fish'; // Fish型をインポート

export const dynamic = 'force-dynamic';

// APIレスポンスの型定義 (必要に応じて調整)
type ApiResponse = {
  data?: { results: Fish[] };
  error?: string;
  details?: string;
};

async function getFishData(): Promise<ApiResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  const apiUrl = `${baseUrl}/api/fish`;

  try {
    const res = await fetch(apiUrl, {
      cache: 'no-store', // キャッシュを無効化して常に最新データを取得
    });

    if (!res.ok) {
      // エラーレスポンスの内容を取得
      const errorData = await res.json().catch(() => ({})); // JSONパース失敗も考慮
      console.error('API Error Response:', errorData);
      throw new Error(
        `Failed to fetch fish data: ${res.status} ${res.statusText} - ${errorData.error || 'Unknown error'} - ${
          errorData.details || ''
        }`,
      );
    }

    const data: ApiResponse = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching fish data:', error);
    // エラー情報を構造化して返す
    return {
      error: 'データの取得に失敗しました。',
      details: error instanceof Error ? error.message : String(error),
    };
  }
}

export default async function Home() {
  const apiResponse = await getFishData();
  const fishList = apiResponse.data?.results;
  const fetchError = apiResponse.error;
  const errorDetails = apiResponse.details;

  return (
    <main className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-8'>🐟️🐠🐡</h1>
      <div className='mb-4'>
        <Link href='/fish/new' className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors'>
          新規登録
        </Link>
      </div>

      {fetchError && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4' role='alert'>
          <strong className='font-bold'>エラー:</strong>
          <span className='block sm:inline'> {fetchError}</span>
          {errorDetails && <p className='text-sm mt-1'>詳細: {errorDetails}</p>}
        </div>
      )}

      {!fetchError && (
        <div>
          <h2 className='text-2xl font-semibold mb-4'>登録魚一覧</h2>
          {fishList && fishList.length > 0 ? (
            <ul className='space-y-2'>
              {fishList.map(fish => (
                <li key={fish.id} className='border p-4 rounded shadow'>
                  <h3 className='text-xl font-medium'>{fish.name}</h3>
                  <p className='text-gray-600'>和名: {fish.japaneseName}</p>
                  <p className='text-gray-600'>分類: {fish.classification}</p>
                  <p className='mt-2'>{fish.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>登録されている魚はいません。</p>
          )}
        </div>
      )}
    </main>
  );
}
