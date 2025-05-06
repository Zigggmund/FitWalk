import { Route } from '@/types/routes';

import { getDatabase } from '@/services/db';

// Функция для вывода всех маршрутов
export const printAllRoutes = async (): Promise<void> => {
  const db = getDatabase();
  try {
    const routes = await db.getAllAsync('SELECT * FROM routes');
    console.log('Все маршруты:', routes);
  } catch (error) {
    console.error('Ошика при получении маршрутов:', error);
    throw error;
  }
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
