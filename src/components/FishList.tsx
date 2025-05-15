import { Fish } from '@/types/fish';
import { getFishData } from '@/services/fishService';
import Link from 'next/link';

export default async function FishList() {
  const fishData = await getFishData();
  const fishList = fishData.data?.results;
  const fetchError = fishData.error;
  const errorDetails = fishData.details;

  return (
    <div>
      {fetchError && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4' role='alert'>
          <strong className='font-bold'>エラー:</strong>
          <span className='block sm:inline'> {fetchError}</span>
          {errorDetails && <p className='text-sm mt-1'>詳細: {errorDetails}</p>}
        </div>
      )}

      {!fetchError && (
        <div>
          {fishList && fishList.length > 0 ? (
            <ul className='space-y-2'>
              {fishList.map((fish: Fish) => (
                <li key={fish.id} className='border p-4 rounded shadow hover:bg-gray-50 cursor-pointer transition-colors'>
                  <Link href={`/fish/${fish.id}`}>
                    <div>
                      <h3 className='text-xl font-medium'>{fish.name}</h3>
                      <p className='text-gray-600'>和名: {fish.japaneseName}</p>
                      <p className='text-gray-600'>分類: {fish.classification}</p>
                      <p className='mt-2'>{fish.description}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>登録されている魚はいません。</p>
          )}
        </div>
      )}
    </div>
  );
}
