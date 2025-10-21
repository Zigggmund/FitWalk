import * as SQLite from 'expo-sqlite';

// Открываем базу данных асинхронно
let db: SQLite.SQLiteDatabase;

export const initDatabase = async (): Promise<void> => {
  try {
    db = await SQLite.openDatabaseAsync('routes.db');
    console.log('Database opened successfully');

    // Включаем режим WAL для лучшей производительности
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;
    `);


    // Создаем таблицы
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS app_settings (
        key TEXT PRIMARY KEY,
        value TEXT DEFAULT NULL
      );

      CREATE TABLE IF NOT EXISTS routes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        travelTime INTEGER NOT NULL,  -- в минутах
        length REAL NOT NULL         -- в метрах
      );

      CREATE TABLE IF NOT EXISTS route_points (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        routeId INTEGER NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        timestamp INTEGER NOT NULL,  -- время записи точки (Unix timestamp)
        pointType TEXT CHECK(pointType IN ('start', 'end', 'path')) NOT NULL,
        FOREIGN KEY(routeId) REFERENCES routes(id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_route_points_routeId 
      ON route_points(routeId);
    `);

    await db.runAsync(`DELETE FROM app_settings WHERE key = 'location_permission_requested'`);

    await db.runAsync(
      `INSERT OR IGNORE INTO app_settings (key, value) VALUES (?, ?)`,
      'language',
      JSON.stringify('en')
    );
    await db.runAsync(
      `INSERT OR IGNORE INTO app_settings (key, value) VALUES (?, ?)`,
      'location_permission_requested',
      JSON.stringify(false)
    );

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Проверка структуры БД
export const checkDatabase = async (): Promise<void> => {
  try {
    const tables = await db.getAllAsync<{name: string}>(
      "SELECT name FROM sqlite_master WHERE type='table'"
    );
    console.log('Все таблицы:', tables);

    const routesStructure = await db.getAllAsync('PRAGMA table_info(routes)');
    console.log('Структура routes:', routesStructure);

    const pointsStructure = await db.getAllAsync('PRAGMA table_info(route_points)');
    console.log('Структура route_points:', pointsStructure);
  } catch (error) {
    console.error('Error checking database:', error);
    throw error;
  }
};

// Экспортируем db для использования в других местах
export const getDatabase = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
};