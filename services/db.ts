import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('routes.db');

export const initDatabase = () => {
  db.transaction(tx => {
    // Основная таблица маршрутов
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS routes (
        id INTEGER PRIMARY KEY,
        title TEXT,
        description TEXT,
        travelTime INTEGER,  // в минутах
        length REAL,        // в метрах
      );
    `);

    // Таблица точек маршрута
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS route_points (
        id INTEGER PRIMARY KEY,
        routeId INTEGER NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        timestamp INTEGER NOT NULL,  // время записи точки (Unix timestamp)
        pointType TEXT CHECK(pointType IN ('start', 'end', 'path')) NOT NULL,
        FOREIGN KEY(routeId) REFERENCES routes(id) ON DELETE CASCADE
      );
    `);

    // Индексы для ускорения запросов
    tx.executeSql(`
      CREATE INDEX IF NOT EXISTS idx_route_points_routeId 
      ON route_points(routeId);
    `);
  });
};

// Новая функция для проверки структуры БД
export const checkDatabase = (): void => {
  db.transaction((tx) => {
    // Проверка таблиц
    tx.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table';",
      [],
      (_, result) => console.log('Все таблицы:', result.rows._array)
    );

    // Проверка структуры таблицы routes
    tx.executeSql(
      "PRAGMA table_info(routes);",
      [],
      (_, result) => console.log('Структура routes:', result.rows._array)
    );

    // Проверка структуры таблицы route_points
    tx.executeSql(
      "PRAGMA table_info(route_points);",
      [],
      (_, result) => console.log('Структура route_points:', result.rows._array)
    );
  });
};

// Функция для вывода всех маршрутов (если нужно)
export const printAllRoutes = (): void => {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM routes;",
      [],
      (_, result) => console.log('Все маршруты:', result.rows._array)
    );
  });
};
