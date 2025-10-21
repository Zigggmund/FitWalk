import { getDatabase } from '@/services/db';

export const setSetting = async (key: string, value: string): Promise<void> => {
  try {
    const db = getDatabase();
    await db.runAsync(
      'INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)',
      key,
      JSON.stringify(value),
    );
  } catch (error) {
    console.error('Error saving setting:', error);
    throw error;
  }
};

export const getSetting = async <T = string>(
  key: string,
): Promise<T | null> => {
  try {
    const db = getDatabase();
    const result = await db.getFirstAsync<{ value: string }>(
      'SELECT value FROM app_settings WHERE key = ?',
      key,
    );

    if (!result) return null;

    try {
      return JSON.parse(result.value) as T;
    } catch (e) {
      console.warn(`Value for key "${key}" is not valid JSON. Returning raw value.`);
      return result.value as unknown as T;
    }
  } catch (error) {
    console.error('Error getting setting:', error);
    return null;
  }
};
