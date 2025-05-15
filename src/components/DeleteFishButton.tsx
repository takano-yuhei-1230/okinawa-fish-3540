'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DeleteFishButtonProps {
  fishId: number; // 魚のIDを受け取る
  fishName: string; // 確認メッセージ用に魚の名前も受け取る
}

export default function DeleteFishButton({ fishId, fishName }: DeleteFishButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    // 確認ダイアログ
    if (!window.confirm(`本当に「${fishName}」を削除しますか？この操作は元に戻せません。`)) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/fish/${fishId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'データの削除に失敗しました。');
      }

      const result = await response.json();
      if (result.success) {
        alert('魚のデータが正常に削除されました。');
        router.push('/'); // 一覧ページにリダイレクト
        router.refresh(); // サーバーコンポーネントのデータを再フェッチさせる (任意)
      } else {
        throw new Error(result.error || '削除処理中にエラーが発生しました。');
      }
    } catch (err) {
      console.error('Error deleting fish:', err);
      setError(err instanceof Error ? err.message : '削除中に不明なエラーが発生しました。');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition duration-150 ease-in-out disabled:bg-gray-400"
      >
        {isDeleting ? '削除中...' : '削除'}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">エラー: {error}</p>}
    </>
  );
}
