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
      route.title || null,
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
    routeId,
  );

  const points = await db.getAllAsync<RoutePoint>(
    'SELECT * FROM route_points WHERE routeId = ? ORDER BY timestamp',
    routeId,
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

    const route3 = await insertRoute({
      title: 'Дивногорск → Красноярск',
      description: 'От железнодорожного вокзала Дивногорска до Предмостной площади Красноярска',
      travelTime: 10,
      length: 29000, // примерно 29 км
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
        latitude: 55.752,
        longitude: 37.619,
        pointType: 'path',
        timestamp: Date.now() / 1000 - 1800,
      },
      {
        routeId: route1,
        latitude: 55.753,
        longitude: 37.62,
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
        latitude: 55.762,
        longitude: 37.629,
        pointType: 'path',
        timestamp: Date.now() / 1000 - 3000,
      },
      {
        routeId: route2,
        latitude: 55.763,
        longitude: 37.63,
        pointType: 'path',
        timestamp: Date.now() / 1000 - 2000,
      },
      {
        routeId: route2,
        latitude: 55.764,
        longitude: 37.631,
        pointType: 'path',
        timestamp: Date.now() / 1000 - 1000,
      },
      {
        routeId: route2,
        latitude: 55.765,
        longitude: 37.632,
        pointType: 'end',
        timestamp: Date.now() / 1000,
      },
    ]);

    await addRoutePoints([
      {
        routeId: route3,
        latitude: 55.950278, // Дивногорск, ж/д вокзал
        longitude: 92.303056,
        pointType: 'start',
        timestamp: Date.now() / 1000 - 600,
      },
      {
        routeId: route3,
        latitude: 56.008889, // Красноярск, Предмостная площадь
        longitude: 92.870556,
        pointType: 'end',
        timestamp: Date.now() / 1000,
      },
    ]);

    console.log('Тестовые данные успешно добавлены');
  } catch (error) {
    console.error('Ошибка при добавлении тестовых данных:', error);
  }
};

// Обновление данных маршрута
export const updateRoute = async (
  id: number,
  route: Partial<Route>,
): Promise<Route> => {
  const db = getDatabase();

  try {
    // Выполняем обновление маршрута
    await db.runAsync(
      `UPDATE routes 
       SET title = ?, 
           description = ?, 
           travelTime = ?, 
           length = ?
       WHERE id = ?`,
      route.title || null,
      route.description || null,
      route.travelTime || null,
      route.length || null,
      id,
    );

    // Получаем обновленный маршрут из базы данных
    const updatedRoute = await db.getFirstAsync<Route>(
      'SELECT * FROM routes WHERE id = ?',
      id,
    );

    if (!updatedRoute) {
      throw new Error('Маршрут не найден после обновления');
    }

    return updatedRoute;
  } catch (error) {
    console.error('Ошибка при обновлении маршрута:', error);
    throw error;
  }
};
