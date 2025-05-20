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
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`,
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
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weather_code,wind_speed_10m&timezone=auto`,
    );
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
};

// import { WeatherData } from '@/types/weatherData';
//
// import Constants from 'expo-constants';
//
// // weatherAPI
// const extra = Constants.expoConfig?.extra || Constants.manifest2?.extra;
// if (!extra) throw new Error('Expo extra config is missing');
// const { BASE_URL, API_KEY } = extra;
//
// export const getCurrentWeather = async (
//   lat: number,
//   lon: number,
// ): Promise<WeatherData> => {
//   try {
//     // weatherAPI
//     const response = await fetch(
//       `${BASE_URL}/current.json?key=${API_KEY}&q=${lat},${lon}&lang=ru`,
//     );
//     const data = await response.json();
//
//     return {
//       temperature: Math.round(data.current.temp_c),
//       windSpeed: Math.round(data.current.wind_kph / 3.6), // конвертируем км/ч в м/с
//       weatherType: mapWeatherType(data.current.condition.code),
//       description: data.current.condition.text,
//       icon: data.current.condition.icon,
//       time: data.current.last_updated,
//     };
//   } catch (error) {
//     console.error('Error fetching current weather:', error);
//     throw error;
//   }
// };
//
// export const getWeatherForecast = async (
//   lat: number,
//   lon: number,
//   date: string,
// ): Promise<WeatherData> => {
//   try {
//     const response = await fetch(
//       `${BASE_URL}/forecast.json?key=${API_KEY}&q=${lat},${lon}&dt=${date}&lang=ru`,
//     );
//     const data = await response.json();
//
//     // Берем прогноз на указанную дату
//     const forecast = data.forecast.forecastday[0].day;
//     const hourForecast = data.forecast.forecastday[0].hour.find((h: any) =>
//       h.time.includes(date.split(' ')[1].substring(0, 2) + ':00'),
//     );
//
//     return {
//       temperature: Math.round(hourForecast?.temp_c || forecast.avgtemp_c),
//       windSpeed: Math.round(
//         (hourForecast?.wind_kph || forecast.maxwind_kph) / 3.6,
//       ),
//       weatherType: mapWeatherType(
//         hourForecast?.condition.code || forecast.condition.code,
//       ),
//       description: hourForecast?.condition.text || forecast.condition.text,
//       icon: hourForecast?.condition.icon || forecast.condition.icon,
//       time: date,
//     };
//   } catch (error) {
//     console.error('Error fetching weather forecast:', error);
//     throw error;
//   }
// };
//
// // Маппинг кодов погоды из WeatherAPI на ваши типы
// const mapWeatherType = (weatherCode: number): string => {
//   // Гроза
//   if (
//     weatherCode === 1087 ||
//     weatherCode === 1273 ||
//     weatherCode === 1276 ||
//     weatherCode === 1279 ||
//     weatherCode === 1282
//   )
//     return 'thunder';
//   // Дождь
//   if (
//     [
//       1063, 1069, 1072, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192,
//       1195, 1198, 1201, 1240, 1243, 1246,
//     ].includes(weatherCode)
//   )
//     return 'rain';
//   // Снег
//   if (
//     [
//       1066, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237,
//       1252, 1255, 1258, 1261, 1264,
//     ].includes(weatherCode)
//   )
//     return 'snow';
//   // Ясно
//   if (weatherCode === 1000) return 'sun';
//   // Облачно
//   return 'clouds';
// };
