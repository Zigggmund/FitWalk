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
    return result ? (JSON.parse(result.value) as T) : null;
  } catch (error) {
    console.error('Error getting setting:', error);
    return null;
  }
};