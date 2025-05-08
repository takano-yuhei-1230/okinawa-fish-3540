import Link from 'next/link';
import FishList from '@/components/FishList';

export const dynamic = 'force-dynamic';

export default async function Home() {
  return (
    <main className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-8'>🐟️🐠🐡</h1>
      <div className='mb-4'>
        <Link href='/fish/new' className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors'>
          新規登録
        </Link>
      </div>
      <FishList />
    </main>
  );
}
