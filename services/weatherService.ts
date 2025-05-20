import { WeatherData } from '@/types/weatherData';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || Constants.manifest2?.extra;
if (!extra) throw new Error('Expo extra config is missing');

export const getCurrentWeather = async (
  lat: number,
  lon: number,
): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `http://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`,
    );
    const data = await response.json();
    const current = data.current;

    return {
      temperature: Math.round(current.temperature_2m),
      windSpeed: Math.round(current.wind_speed_10m),
      weatherType: mapWeatherType(current.weather_code),
      time: current.time,
    };
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw error;
  }
};

export const getWeatherForecast = async (
  lat: number,
  lon: number,
  date: string,
): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `http://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weather_code,wind_speed_10m&timezone=auto`,
    );
    if (!response.ok) {
      const text = await response.text(); // чтобы увидеть HTML-ошибку
      console.error('Weather API error:', response.status, text);
      throw new Error(`Ошибка API погоды: ${response.status}`);
    }

    const data = await response.json();

    const hourIndex = data.hourly.time.findIndex((t: string) =>
      t.startsWith(date),
    );

    const temp = data.hourly.temperature_2m[hourIndex];
    const wind = data.hourly.wind_speed_10m[hourIndex];
    const code = data.hourly.weather_code[hourIndex];

    return {
      temperature: Math.round(temp),
      windSpeed: Math.round(wind),
      weatherType: mapWeatherType(code),
      time: data.hourly.time[hourIndex],
    };
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    throw error;
  }
};

const mapWeatherType = (code: number): string => {
  if ([95, 96, 99].includes(code)) return 'thunder';
  if ([61, 63, 65, 80, 81, 82].includes(code)) return 'rain';
  if ([71, 73, 75, 85, 86].includes(code)) return 'snow';
  if (code === 0) return 'clear';
  return 'clouds';
}