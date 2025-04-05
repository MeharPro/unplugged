import { WeatherDescription } from "../../weather-to-image/src/types/weather";

// OpenWeather API response interface
export interface OpenWeatherResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  rain?: {
    "1h"?: number;
    "3h"?: number;
  };
  snow?: {
    "1h"?: number;
    "3h"?: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

// Fetch current weather data from OpenWeather API
export const fetchWeather = async (lat: number, lon: number): Promise<OpenWeatherResponse | null> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error('Weather data fetch failed');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error fetching weather:', err);
    return null;
  }
};

// Convert OpenWeather data to app's weather type
export const mapWeatherType = (weatherMain: string): "sunny" | "cloudy" | "rainy" | "windy" => {
  const main = weatherMain.toLowerCase();

  if (main.includes('clear') || main.includes('sun')) {
    return "sunny";
  } else if (main.includes('cloud')) {
    return "cloudy";
  } else if (main.includes('rain') || main.includes('drizzle') || main.includes('shower') || main.includes('storm') || main.includes('thunder')) {
    return "rainy";
  } else if (main.includes('wind') || main.includes('breeze') || main.includes('gale')) {
    return "windy";
  }

  // Default to cloudy for other weather types
  return "cloudy";
};

// Import the enhanced color palette function
import { getEnhancedColorPalette } from './artEnhancer';

// Convert OpenWeather data to weather-to-image WeatherData format
export const convertToWeatherImageData = (data: OpenWeatherResponse) => {
  // Map OpenWeather main weather to WeatherDescription
  const mapToWeatherDescription = (main: string): WeatherDescription => {
    const mainLower = main.toLowerCase();

    if (mainLower.includes('clear')) return "Clear";
    if (mainLower.includes('few clouds')) return "Few Clouds";
    if (mainLower.includes('scattered clouds')) return "Scattered Clouds";
    if (mainLower.includes('broken clouds')) return "Broken Clouds";
    if (mainLower.includes('shower rain')) return "Shower Rain";
    if (mainLower.includes('rain')) return "Rain";
    if (mainLower.includes('thunderstorm')) return "Thunderstorm";
    if (mainLower.includes('snow')) return "Snow";
    if (mainLower.includes('mist')) return "Mist";
    if (mainLower.includes('fog')) return "Fog";

    // Default to Scattered Clouds if no match
    return "Scattered Clouds";
  };

  // Calculate precipitation probability and intensity from rain/snow data
  const calculatePrecipitation = () => {
    let probability = 0;
    let intensity = 0;

    if (data.rain && data.rain["1h"]) {
      probability = Math.min(1, data.rain["1h"] / 10); // Scale 0-10mm to 0-1
      intensity = Math.min(10, data.rain["1h"]); // Scale 0-10mm
    } else if (data.snow && data.snow["1h"]) {
      probability = Math.min(1, data.snow["1h"] / 10);
      intensity = Math.min(10, data.snow["1h"]);
    } else if (data.weather[0].main.toLowerCase().includes('rain') ||
               data.weather[0].main.toLowerCase().includes('shower') ||
               data.weather[0].main.toLowerCase().includes('drizzle')) {
      // If no rain data but weather indicates rain
      probability = 0.7;
      intensity = 3;
    } else if (data.weather[0].main.toLowerCase().includes('snow')) {
      // If no snow data but weather indicates snow
      probability = 0.7;
      intensity = 3;
    }

    return { probability, intensity };
  };

  const { probability, intensity } = calculatePrecipitation();

  return {
    temperature: data.main.temp,
    precipitationProbability: probability,
    precipitationIntensity: intensity,
    windSpeed: data.wind.speed,
    windDirection: data.wind.deg,
    cloudCover: data.clouds.all,
    humidity: data.main.humidity,
    uvIndex: 5, // OpenWeather doesn't provide UV index in the basic API
    description: mapToWeatherDescription(data.weather[0].main)
  };
};

// Generate a data URL from a canvas with weather art
export const generateWeatherArtDataUrl = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): string => {
  return ctx.canvas.toDataURL('image/png');
};
