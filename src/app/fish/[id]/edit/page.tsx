import FishForm from '@/components/FishForm';
import { getFishById } from '@/services/fishService';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { notFound, redirect } from 'next/navigation';
import { Fish } from '@/types/fish';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'データ編集',
  description: '魚の情報を編集します。',
};

export default async function EditFishPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect(`/login?callbackUrl=/fish/${params.id}/edit`);
  }

  const fishResponse = await getFishById(params.id);

  if (fishResponse.error || !fishResponse.data) {
    if (fishResponse.details?.includes('not found')) {
      notFound();
    } else {
      console.error('Error fetching fish for edit:', fishResponse.error, fishResponse.details);
      // ここではnotFound()を呼ぶが、より具体的なエラー表示も検討可能
      notFound();
    }
    return;
  }

  const fishToEdit = fishResponse.data;

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold mb-6'>魚の情報を編集</h1>
      {/* FishForm に編集対象の魚データ (fishToEdit) と編集モードであることを伝えるプロパティを渡す */}
      <FishForm existingFish={fishToEdit} isEditMode={true} />
    </div>
  );
}
