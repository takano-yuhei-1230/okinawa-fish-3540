import { NextResponse } from 'next/server';
import { getFishById, updateFish, deleteFish } from '@/services/fishService';
import { Fish } from '@/types/fish';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

interface Params {
  id: string;
}

// GETメソッドはCloudflareWorkersで動作しないためAPIを使用しない

// export async function GET(request: Request, { params }: { params: Params }) {
//   const { id } = params;

//   if (!id) {
//     return NextResponse.json({ error: 'IDが指定されていません' }, { status: 400 });
//   }

//   try {
//     const fishResponse = await getFishById(id);

//     if (fishResponse.error) {
//       const statusCode = fishResponse.details?.includes('not found') ? 404 : 500;
//       return NextResponse.json({ error: fishResponse.error, details: fishResponse.details }, { status: statusCode });
//     }

//     return NextResponse.json(fishResponse.data);
//   } catch (error) {
//     console.error(`Error in GET /api/fish/${id}:`, error);
//     return NextResponse.json({ error: 'サーバー内部エラーが発生しました', details: String(error) }, { status: 500 });
//   }
// }

export async function PUT(request: Request, { params }: { params: Params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: 'IDが指定されていません' }, { status: 400 });
  }

  try {
    const fishDataToUpdate: Partial<Omit<Fish, 'id' | 'createdAt' | 'updatedAt'>> = await request.json();

    // 空のリクエストボディをチェック (任意)
    if (Object.keys(fishDataToUpdate).length === 0) {
      return NextResponse.json({ error: '更新データがありません' }, { status: 400 });
    }

    const result = await updateFish(id, fishDataToUpdate);

    if (!result.success) {
      const statusCode = result.details?.includes('not found') ? 404 : result.details?.includes('更新するフィールドがありません') ? 400 : 500;
      return NextResponse.json({ error: result.error, details: result.details }, { status: statusCode });
    }

    return NextResponse.json({ success: true, message: '魚のデータが更新されました' });
  } catch (error) {
    console.error(`Error in PUT /api/fish/${id}:`, error);
    // JSON解析エラーなども考慮
    if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'リクエスト形式が正しくありません', details: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'サーバー内部エラーが発生しました', details: String(error) }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: 'IDが指定されていません' }, { status: 400 });
  }

  try {
    const result = await deleteFish(id);

    if (!result.success) {
      const statusCode = result.details?.includes('not found') ? 404 : 500;
      return NextResponse.json({ error: result.error, details: result.details }, { status: statusCode });
    }

    return NextResponse.json({ success: true, message: '魚のデータが削除されました' });
  } catch (error) {
    console.error(`Error in DELETE /api/fish/${id}:`, error);
    return NextResponse.json({ error: 'サーバー内部エラーが発生しました', details: String(error) }, { status: 500 });
  }
}
