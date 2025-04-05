export interface Location {
  latitude: number;
  longitude: number;
}

export interface WeatherData {
  temp: number;
  description: string;
  main: string;
}

export interface SearchResult {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
}