import { Route, RoutePoint } from '@/types/routes';

import { getDatabase } from '@/services/db';

export const getAllRoutes = async (): Promise<Route[]> => {
  const db = getDatabase();
  return await db.getAllAsync<Route>('SELECT * FROM routes ORDER BY id DESC');
};

// Добавить маршрут (с параметрами)
export const insertRoute = async (route: Route): Promise<number> => {
  try {
    const db = getDatabase();
    const result = await db.runAsync(
      `INSERT INTO routes (title, description, travelTime, length)
         VALUES (?, ?, ?, ?)`,
      route.title,
      route.description || null, // Если undefined, сохраняем как NULL
      route.travelTime || null,
      route.length || null,
    );
    return result.lastInsertRowId; // Возвращаем ID нового маршрута
  } catch (error) {
    console.error('Ошибка при добавлении маршрута:', error);
    throw error;
  }
};

// Удалить маршрут по ID
export const deleteRoute = async (id: number): Promise<void> => {
  try {
    const db = getDatabase();
    await db.runAsync('DELETE FROM routes WHERE id = ?', id);
  } catch (error) {
    console.error('Ошибка при удалении маршрута:', error);
    throw error;
  }
};
// Добавление точек маршрута
export const addRoutePoints = async (points: RoutePoint[]): Promise<void> => {
  const db = getDatabase();
  await db.execAsync('BEGIN TRANSACTION');
  try {
    for (const point of points) {
      await db.runAsync(
        `INSERT INTO route_points (routeId, latitude, longitude, pointType, timestamp)
         VALUES (?, ?, ?, ?, ?)`,
        point.routeId,
        point.latitude,
        point.longitude,
        point.pointType,
        point.timestamp || Math.floor(Date.now() / 1000),
      );
    }
    await db.execAsync('COMMIT');
  } catch (error) {
    await db.execAsync('ROLLBACK');
    throw error;
  }
};

// Получение маршрута с точками
export const getRouteWithPoints = async (
  routeId: number,
): Promise<{ route: Route | null; points: RoutePoint[] }> => {
  const db = getDatabase();
  const route = await db.getFirstAsync<Route>(
    'SELECT * FROM routes WHERE id = ?',
    routeId,
  );
  const points = await db.getAllAsync<RoutePoint>(
    'SELECT * FROM route_points WHERE routeId = ? ORDER BY timestamp',
    routeId,
  );
  return { route, points };
};

// Получение всех маршрутов с точками
export const getAllRoutesWithPoints = async (): Promise<
  Array<{
    route: Route;
    points: RoutePoint[];
  }>
> => {
  const db = getDatabase();
  const routes = await db.getAllAsync<Route>('SELECT * FROM routes');

  const routesWithPoints = await Promise.all(
    routes.map(async route => {
      const points = await db.getAllAsync<RoutePoint>(
        'SELECT * FROM route_points WHERE routeId = ? ORDER BY timestamp',
        route.id as number,
      );
      return { route, points };
    }),
  );

  return routesWithPoints;
};

// Получить конкретный маршрут по ID
export const getRouteById = async (routeId: number) => {
  const db = getDatabase();
  const route = await db.getFirstAsync<Route>(
    'SELECT * FROM routes WHERE id = ?',
    routeId
  );

  const points = await db.getAllAsync<RoutePoint>(
    'SELECT * FROM route_points WHERE routeId = ? ORDER BY timestamp',
    routeId
  );

  return { route, points };
};


export const testDb = async () => {
  const db = getDatabase();

  try {
    // Очищаем таблицы
    await db.execAsync('DELETE FROM route_points');
    await db.execAsync('DELETE FROM routes');

    // Добавляем тестовые маршруты
    const route1 = await insertRoute({
      title: 'Тестовый маршрут 1',
      description: 'Первый тестовый маршрут',
      travelTime: 30,
      length: 1500,
    });

    const route2 = await insertRoute({
      title: 'Тестовый маршрут 2',
      description: 'Второй тестовый маршрут с большим количеством точек',
      travelTime: 45,
      length: 2500,
    });

    // Добавляем точки для первого маршрута (3 точки)
    await addRoutePoints([
      {
        routeId: route1,
        latitude: 55.751244,
        longitude: 37.618423,
        pointType: 'start',
        timestamp: Date.now() / 1000 - 3600,
      },
      {
        routeId: route1,
        latitude: 55.752000,
        longitude: 37.619000,
        pointType: 'path',
        timestamp: Date.now() / 1000 - 1800,
      },
      {
        routeId: route1,
        latitude: 55.753000,
        longitude: 37.620000,
        pointType: 'end',
        timestamp: Date.now() / 1000,
      },
    ]);

    // Добавляем точки для второго маршрута (5 точек)
    await addRoutePoints([
      {
        routeId: route2,
        latitude: 55.761244,
        longitude: 37.628423,
        pointType: 'start',
        timestamp: Date.now() / 1000 - 4000,
      },
      {
        routeId: route2,
        latitude: 55.762000,
        longitude: 37.629000,
        pointType: 'path',
        timestamp: Date.now() / 1000 - 3000,
      },
      {
        routeId: route2,
        latitude: 55.763000,
        longitude: 37.630000,
        pointType: 'path',
        timestamp: Date.now() / 1000 - 2000,
      },
      {
        routeId: route2,
        latitude: 55.764000,
        longitude: 37.631000,
        pointType: 'path',
        timestamp: Date.now() / 1000 - 1000,
      },
      {
        routeId: route2,
        latitude: 55.765000,
        longitude: 37.632000,
        pointType: 'end',
        timestamp: Date.now() / 1000,
      },
    ]);

    console.log('Тестовые данные успешно добавлены');
  } catch (error) {
    console.error('Ошибка при добавлении тестовых данных:', error);
  }
};