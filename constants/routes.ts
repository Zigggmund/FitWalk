import { Route } from '@/types/routes';

export const routes: Route[] = [
  {
    id: 1,
    title: 'Центр',
    description:
      'Маршрут по центральной части города от театра оперы до набережной Енисея.',
    travelTime: 30,
    length: 2500,
    startPoint: { latitude: 56.012408, longitude: 92.852905 }, // Театр оперы и балета
    endPoint: { latitude: 56.010364, longitude: 92.87306 }, // Набережная
    path: [
      { latitude: 56.012408, longitude: 92.852905 },
      { latitude: 56.0122, longitude: 92.8561 },
      { latitude: 56.0113, longitude: 92.8625 },
      { latitude: 56.0108, longitude: 92.8673 },
      { latitude: 56.010364, longitude: 92.87306 },
    ],
    isRecording: false,
  },
  {
    id: 2,
    title: 'Тропа к Столбам (длинный маршрут)',
    description:
      'Походный маршрут от центрального входа в заповедник "Столбы" к Первому Столбу.',
    travelTime: 120,
    length: 7000,
    startPoint: { latitude: 55.9792, longitude: 92.7383 }, // Центральный вход
    endPoint: { latitude: 55.9971, longitude: 92.7344 }, // Первый Столб
    path: [
      { latitude: 55.9792, longitude: 92.7383 },
      { latitude: 55.9811, longitude: 92.7369 },
      { latitude: 55.9855, longitude: 92.7362 },
      { latitude: 55.992, longitude: 92.735 },
      { latitude: 55.9971, longitude: 92.7344 },
    ],
    isRecording: false,
  },
  {
    id: 3,
    title: 'Исторический маршрут',
    description:
      'От Речного вокзала до Часовни Параскевы Пятницы с остановками у достопримечательностей.',
    travelTime: 45,
    length: 3200,
    startPoint: { latitude: 56.0074, longitude: 92.8648 }, // Речной вокзал
    endPoint: { latitude: 56.0156, longitude: 92.8705 }, // Часовня
    path: [
      { latitude: 56.0074, longitude: 92.8648 },
      { latitude: 56.0091, longitude: 92.8659 },
      { latitude: 56.0113, longitude: 92.8678 },
      { latitude: 56.0137, longitude: 92.8693 },
      { latitude: 56.0156, longitude: 92.8705 },
    ],
    isRecording: false,
  },
  {
    id: 4,
    title: 'Парковая зона отдыха',
    description:
      'Прогулка по Татышев острову, круговой маршрут для велосипедистов и пешеходов.',
    travelTime: 40,
    length: 4500,
    startPoint: { latitude: 56.0138, longitude: 92.8552 }, // Вход на остров со стороны центра
    endPoint: { latitude: 56.0138, longitude: 92.8552 }, // Обратно в ту же точку
    path: [
      { latitude: 56.0138, longitude: 92.8552 },
      { latitude: 56.0145, longitude: 92.8486 },
      { latitude: 56.0172, longitude: 92.8443 },
      { latitude: 56.0197, longitude: 92.8491 },
      { latitude: 56.0168, longitude: 92.854 },
      { latitude: 56.0138, longitude: 92.8552 },
    ],
    isRecording: false,
  },
];
