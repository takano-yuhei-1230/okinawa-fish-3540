import FishList from '@/components/FishList';

export default async function Fish() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold mb-6'>魚</h1>
      <FishList />
    </div>
  );
}
