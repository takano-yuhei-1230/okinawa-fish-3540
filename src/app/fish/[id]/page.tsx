import { Fish } from "@/types/fish";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { getFishById } from "@/services/fishService";
import DeleteFishButton from "@/components/DeleteFishButton";
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: { id: string };
  // searchParams: { [key: string]: string | string[] | undefined }; // 必要であれば
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata // 親のメタデータにアクセス可能 (オプション)
): Promise<Metadata> {
  const id = params.id;
  const fishResponse = await getFishById(id);

  if (fishResponse.data) {
    const fish = fishResponse.data;
    // オプション: 親のタイトルに魚の名前を付加するなどの処理も可能
    // const previousImages = (await parent).openGraph?.images || [];
    return {
      title: `${fish.name} (${fish.japaneseName}) - 沖縄の魚図鑑`, // ページタイトルを動的に設定
      description: `${fish.name} (${fish.japaneseName}) の詳細情報。分類: ${fish.classification || '未分類'}。${fish.description.substring(0, 100)}...`,
      // openGraph: { images: [
      //   // もし魚の画像URLがあればここに追加
      //   // ...previousImages,
      // ]}
    };
  }

  // データが見つからない場合やエラーの場合はデフォルトのタイトル
  return {
    title: "魚が見つかりません - 沖縄の魚図鑑",
    description: "指定された魚の情報は見つかりませんでした。",
  };
}

export default async function FishDetailPage({ params }: Props) {
  const fishResponse = await getFishById(params.id);
  const session = await getServerSession(authOptions);

  if (fishResponse.error || !fishResponse.data) {
    if (fishResponse.details?.includes('not found')) {
        notFound();
    } else {
        console.error("Error fetching fish by id:", fishResponse.error, fishResponse.details);
        notFound();
    }
    return;
  }

  const fish = fishResponse.data;

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">{fish.name}</h1>
        <p className="text-xl text-gray-600 mb-4">和名: {fish.japaneseName}</p>

        {fish.classification && (
          <p className="text-md text-gray-500 mb-1">分類: {fish.classification}</p>
        )}
        <p className="text-md text-gray-500 mb-4">登録日: {new Date(fish.createdAt).toLocaleDateString()}</p>

        {fish.description && (
          <section className="mt-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">詳細情報</h2>
            <p className="text-gray-600 whitespace-pre-wrap">{fish.description}</p>
          </section>
        )}

        {session && (
          <div className="mt-8 pt-6 border-t border-gray-200 flex space-x-4">
            <Link
              href={`/fish/${fish.id}/edit`}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-150 ease-in-out"
            >
              編集
            </Link>
            <DeleteFishButton fishId={fish.id} fishName={fish.name} />
          </div>
        )}
      </article>

      <div className="mt-8">
        <Link href="/" className="text-blue-600 hover:text-blue-800 hover:underline">
          &larr; 登録魚一覧へ戻る
        </Link>
      </div>
    </div>
  );
}
