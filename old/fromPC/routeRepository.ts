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

export const insertRoute = async (
  title: string,
  description: string,
  travelTimeL: number,
  length: number,
): Promise<void> => {
  const db = getDatabase();
  try {
    await db.runAsync(
      `
      INSERT INTO routes (title, description, travelTime, length)
      VALUES(?, ?, ?, ?)`,
      title,
      description,
      travelTimeL,
      length,
    );
  } catch (error) {
    console.error('Ошика при добавлении маршрута:', error);
    throw error;
  }
};

export const deleteError = async (): Promise<void> => {
  const db = getDatabase();
  try {
    await db.execAsync(`
      INSERT
    `);
  } catch (error) {
    console.error('Ошика при удалении маршрута:', error);
    throw error;
  }
};
