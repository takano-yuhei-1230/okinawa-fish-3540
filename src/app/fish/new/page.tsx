import FishForm from '@/components/FishForm';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '新規登録',
  description: '新しい魚の情報を登録します。',
};

export default async function NewFishPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login?callbackUrl=/fish/new');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">新規登録</h1>
      <FishForm />
    </div>
  );
}
