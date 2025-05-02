-- 魚テーブルの作成
CREATE TABLE fish (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  japanese_name TEXT NOT NULL,
  classification TEXT,
  description TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
