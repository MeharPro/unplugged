
// Weather data types
export type WeatherDescription = 
  | "Clear" 
  | "Few Clouds" 
  | "Scattered Clouds" 
  | "Broken Clouds" 
  | "Shower Rain" 
  | "Rain" 
  | "Thunderstorm" 
  | "Snow" 
  | "Mist" 
  | "Fog";

export interface WeatherData {
  temperature: number;
  precipitationProbability: number;
  precipitationIntensity: number;
  windSpeed: number;
  windDirection: number;
  cloudCover: number;
  humidity: number;
  uvIndex: number;
  description: WeatherDescription;
}

// Art style types
export type ArtGenre = 
  | "Impressionism" 
  | "Abstract Expressionism" 
  | "Watercolor" 
  | "Glitch Art" 
  | "Line Art"
  | "Geometric Abstract" 
  | "Fauvism" 
  | "Pop Art" 
  | "Minimalism" 
  | "Pointillism"
  | "Expressionism" 
  | "Surrealism";

export interface ArtStyle {
  genre: ArtGenre;
  mood: string;
  colorDescription: string;
  technique: string;
}

// Canvas drawing parameters
export interface DrawingParams {
  colorPalette: string[];
  backgroundGradient: string[];
  strokeWidth: number;
  density: number;
  opacity: number;
  distortion: number;
  directionality: number;
  contrast: number;
  saturation: number;
  brightness: number;
  blur: number;
  particleSize: number;
  movementSpeed: number;
  particleCount: number;
}
