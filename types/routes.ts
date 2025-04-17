export interface Route {
  id: number;
  title: string;
  description: string;
  travelTime: number; // минуты, in POSTRESQL type=interval
  length: number; // метры
  startPoint: LatLng;
  endPoint: LatLng;
  path: LatLng[]; // Полный маршрут
}

// координата
export interface LatLng {
  latitude: number; // широта
  longitude: number; // долгота
}
