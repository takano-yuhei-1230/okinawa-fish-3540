import { NextResponse } from 'next/server';
import { Fish } from '@/types/fish';

import { getCloudflareContext } from '@opennextjs/cloudflare';

export async function GET(request: Request) {
  try {
    const db = (getCloudflareContext().env as any).DB;

    if (!db) {
      console.error('DB instance is undefined');
      return NextResponse.json({ error: 'データベース接続エラー' }, { status: 500 });
    }

    const result = await db.prepare('SELECT * FROM fish').all();

    return NextResponse.json({
      data: result,
      count: result.length,
    });
  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json({ error: 'データの取得に失敗しました', details: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const fishData: Fish = await request.json();

    const db = (getCloudflareContext().env as any).DB;

    if (!db) {
      console.error('DB instance is undefined');
      return NextResponse.json({ error: 'データベース接続エラー' }, { status: 500 });
    }

    // データを挿入
    const result = await db
      .prepare(
        'INSERT INTO fish (name, japanese_name, classification, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
      )
      .bind(
        fishData.name,
        fishData.japaneseName,
        fishData.classification,
        fishData.description,
        new Date().toISOString(),
        new Date().toISOString(),
      )
      .run();

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error saving fish data:', error);
    return NextResponse.json({ success: false, error: 'データの保存に失敗しました' }, { status: 500 });
  }
}
