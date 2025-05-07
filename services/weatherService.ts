import Config from 'react-native-config';
import { WeatherData } from '@/types/weatherData';

const BASE_URL = Config.WEATHER_API_BASE_URL;
const API_KEY = Config.WEATHER_API_KEY;

export const getCurrentWeather = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `${BASE_URL}/current.json?key=${API_KEY}&q=${lat},${lon}&lang=ru`
    );
    const data = await response.json();

    return {
      temperature: Math.round(data.current.temp_c),
      windSpeed: Math.round(data.current.wind_kph / 3.6), // конвертируем км/ч в м/с
      weatherType: mapWeatherType(data.current.condition.code),
      description: data.current.condition.text,
      icon: data.current.condition.icon,
      time: data.current.last_updated
    };
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw error;
  }
};

export const getWeatherForecast = async (lat: number, lon: number, date: string): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast.json?key=${API_KEY}&q=${lat},${lon}&dt=${date}&lang=ru`
    );
    const data = await response.json();

    // Берем прогноз на указанную дату
    const forecast = data.forecast.forecastday[0].day;
    const hourForecast = data.forecast.forecastday[0].hour.find(
      (h: any) => h.time.includes(date.split(' ')[1].substring(0, 2) + ':00')
    ); // <-- Missing parenthesis was here

    return {
      temperature: Math.round(hourForecast?.temp_c || forecast.avgtemp_c),
      windSpeed: Math.round((hourForecast?.wind_kph || forecast.maxwind_kph) / 3.6),
      weatherType: mapWeatherType(hourForecast?.condition.code || forecast.condition.code),
      description: hourForecast?.condition.text || forecast.condition.text,
      icon: hourForecast?.condition.icon || forecast.condition.icon,
      time: date
    };
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    throw error;
  }
};

// Маппинг кодов погоды из WeatherAPI на ваши типы
const mapWeatherType = (weatherCode: number): string => {
  // Гроза
  if (weatherCode === 1087 || weatherCode === 1273 || weatherCode === 1276 ||
    weatherCode === 1279 || weatherCode === 1282) return 'thunder';
  // Дождь
  if ([1063, 1069, 1072, 1150, 1153, 1168, 1171, 1180, 1183, 1186,
    1189, 1192, 1195, 1198, 1201, 1240, 1243, 1246].includes(weatherCode)) return 'rain';
  // Снег
  if ([1066, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1222,
    1225, 1237, 1252, 1255, 1258, 1261, 1264].includes(weatherCode)) return 'snow';
  // Ясно
  if (weatherCode === 1000) return 'sun';
  // Облачно
  return 'clouds';
};