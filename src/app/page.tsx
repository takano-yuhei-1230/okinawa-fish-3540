import Link from 'next/link';
import FishList from '@/components/FishList';

export const dynamic = 'force-dynamic';

export default async function Home() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <h2 className='text-2xl font-semibold mb-4'>登録魚一覧</h2>
      <FishList />
    </div>
  );
}
