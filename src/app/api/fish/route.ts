import { NextResponse } from 'next/server';
import { Fish } from '@/types/fish';
import { createFish } from '@/services/fishService';

import { getCloudflareContext } from '@opennextjs/cloudflare';

export async function GET(request: Request) {
  try {
    const db = (getCloudflareContext().env as any).DB;

    if (!db) {
      console.error('DB instance is undefined');
      return NextResponse.json({ error: 'データベース接続エラー' }, { status: 500 });
    }

    const dbResult = await db.prepare('SELECT * FROM fish').all();

    // D1の `all()` の結果は { results: [...] } 形式の場合があるため、確認
    const rawResults = dbResult.results || dbResult; // 結果が直接配列か、resultsプロパティ内か判定

    // キーをスネークケースからキャメルケースに変換
    const formattedData = rawResults.map((row: any) => ({
      id: row.id,
      name: row.name,
      japaneseName: row.japanese_name, // ここで変換
      classification: row.classification,
      description: row.description,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return NextResponse.json({
      data: { results: formattedData }, // 変換後のデータを results プロパティに入れる
      count: formattedData.length,
    });
  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json({ error: 'データの取得に失敗しました', details: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const fishData: Fish = await request.json();
    const result = await createFish(fishData);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error, details: result.details },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving fish data:', error);
    return NextResponse.json(
      { success: false, error: 'データの保存に失敗しました', details: String(error) },
      { status: 500 }
    );
  }
}
