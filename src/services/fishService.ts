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

type SingleFishResponse = {
  data?: Fish;
  error?: string;
  details?: string;
};

type MutateFishResponse = {
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

export async function getFishById(id: string): Promise<SingleFishResponse> {
  try {
    const db = (getCloudflareContext().env as any).DB;
    if (!db) {
      return { error: 'データベース接続エラー', details: 'DB instance undefined' };
    }
    const stmt = db.prepare('SELECT * FROM fish WHERE id = ?');
    const fish = await stmt.bind(id).first();

    if (!fish) {
      return { error: '指定された魚が見つかりません', details: `ID: ${id} not found` };
    }

    // キーをスネークケースからキャメルケースに変換
    const formattedFish: Fish = {
      id: fish.id,
      name: fish.name,
      japaneseName: fish.japanese_name,
      classification: fish.classification,
      description: fish.description,
      createdAt: fish.created_at,
      updatedAt: fish.updated_at,
    };

    return { data: formattedFish };
  } catch (error) {
    console.error(`Error fetching fish by id ${id}:`, error);
    return { error: 'データの取得に失敗しました', details: String(error) };
  }
}

export async function updateFish(id: string, fishData: Partial<Omit<Fish, 'id' | 'createdAt' | 'updatedAt'>>): Promise<MutateFishResponse> {
  try {
    const db = (getCloudflareContext().env as any).DB;
    if (!db) {
      return { success: false, error: 'データベース接続エラー', details: 'DB instance undefined' };
    }

    const now = new Date().toISOString();
    const fieldsToUpdate = [];
    const valuesToBind = [];

    if (fishData.name !== undefined) {
      fieldsToUpdate.push('name = ?');
      valuesToBind.push(fishData.name);
    }
    if (fishData.japaneseName !== undefined) {
      fieldsToUpdate.push('japanese_name = ?');
      valuesToBind.push(fishData.japaneseName);
    }
    if (fishData.classification !== undefined) {
      fieldsToUpdate.push('classification = ?');
      valuesToBind.push(fishData.classification);
    }
    if (fishData.description !== undefined) {
      fieldsToUpdate.push('description = ?');
      valuesToBind.push(fishData.description);
    }

    if (fieldsToUpdate.length === 0) {
      return { success: false, error: '更新するフィールドがありません' };
    }

    fieldsToUpdate.push('updated_at = ?');
    valuesToBind.push(now);
    valuesToBind.push(id); // WHERE句のID

    const stmt = db.prepare(`UPDATE fish SET ${fieldsToUpdate.join(', ')} WHERE id = ?`);
    const result = await stmt.bind(...valuesToBind).run();

    if (result.changes === 0) {
        return { success: false, error: '指定された魚が見つからないか、データが変更されていません', details: `ID: ${id}` };
    }

    return { success: true };
  } catch (error) {
    console.error(`Error updating fish by id ${id}:`, error);
    return { success: false, error: 'データの更新に失敗しました', details: String(error) };
  }
}

export async function deleteFish(id: string): Promise<MutateFishResponse> {
  try {
    const db = (getCloudflareContext().env as any).DB;
    if (!db) {
      return { success: false, error: 'データベース接続エラー', details: 'DB instance undefined' };
    }

    const stmt = db.prepare('DELETE FROM fish WHERE id = ?');
    const result = await stmt.bind(id).run();

    if (result.changes === 0) {
      return { success: false, error: '指定された魚が見つかりません', details: `ID: ${id} not found or already deleted` };
    }

    return { success: true };
  } catch (error) {
    console.error(`Error deleting fish by id ${id}:`, error);
    return { success: false, error: 'データの削除に失敗しました', details: String(error) };
  }
}
