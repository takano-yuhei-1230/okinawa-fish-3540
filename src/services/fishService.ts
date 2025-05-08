import { Fish } from '@/types/fish';
import { getCloudflareContext } from '@opennextjs/cloudflare';

type FishDataResponse = {
  data?: { results: Fish[] };
  error?: string;
  details?: string;
};

type CreateFishResponse = {
  success: boolean;
  error?: string;
  details?: string;
};

export async function getFishData(): Promise<FishDataResponse> {
  try {
    const db = (getCloudflareContext().env as any).DB;

    if (!db) {
      console.error('DB instance is undefined');
      return {
        error: 'データベース接続エラー',
        details: 'データベースインスタンスが未定義です'
      };
    }

    const dbResult = await db.prepare('SELECT * FROM fish').all();
    const rawResults = dbResult.results || dbResult;

    const formattedData = rawResults.map((row: any) => ({
      id: row.id,
      name: row.name,
      japaneseName: row.japanese_name,
      classification: row.classification,
      description: row.description,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return {
      data: { results: formattedData }
    };
  } catch (error) {
    console.error('Error fetching fish data:', error);
    return {
      error: 'データの取得に失敗しました。',
      details: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function createFish(fishData: Omit<Fish, 'id' | 'createdAt' | 'updatedAt'>): Promise<CreateFishResponse> {
  try {
    const db = (getCloudflareContext().env as any).DB;

    if (!db) {
      console.error('DB instance is undefined');
      return {
        success: false,
        error: 'データベース接続エラー',
        details: 'データベースインスタンスが未定義です'
      };
    }

    const now = new Date().toISOString();
    const result = await db
      .prepare(
        'INSERT INTO fish (name, japanese_name, classification, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)'
      )
      .bind(
        fishData.name,
        fishData.japaneseName,
        fishData.classification,
        fishData.description,
        now,
        now
      )
      .run();

    return {
      success: true
    };
  } catch (error) {
    console.error('Error creating fish data:', error);
    return {
      success: false,
      error: 'データの登録に失敗しました。',
      details: error instanceof Error ? error.message : String(error),
    };
  }
}
