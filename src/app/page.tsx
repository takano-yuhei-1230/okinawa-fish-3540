import Link from 'next/link';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">okinawa fish 3540</h1>
      <div className="mb-4">
        <Link
          href="/fish/new"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          新規登録
        </Link>
      </div>
      {/* 後でFishListコンポーネントを追加 */}
    </main>
  );
}
