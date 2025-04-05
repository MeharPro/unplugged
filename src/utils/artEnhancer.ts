import { WeatherData } from "../../weather-to-image/src/types/weather";

// Enhanced color palettes for more vibrant weather art
export const getEnhancedColorPalette = (weatherData: WeatherData): string[] => {
  const { temperature, description } = weatherData;

  // Always use vibrant, happy colors regardless of weather
  // We'll have different vibrant palettes for different weather types

  // Sunny palette - warm, bright colors
  const sunnyPalette = [
    "#FF9500", // Bright orange
    "#FFD700", // Gold
    "#FF4500", // Orange red
    "#FFA500", // Orange
    "#FFFF00"  // Yellow
  ];

  // Cloudy palette - still bright and cheerful, not gray
  const cloudyPalette = [
    "#FF6B6B", // Bright red
    "#4ECDC4", // Turquoise
    "#FF9A8B", // Salmon pink
    "#FFD166", // Bright yellow
    "#06D6A0"  // Bright green
  ];

  // Rainy palette - vibrant blues and purples, not dreary
  const rainyPalette = [
    "#00BFFF", // Deep sky blue
    "#9370DB", // Medium purple
    "#FF69B4", // Hot pink
    "#00CED1", // Dark turquoise
    "#FF1493"  // Deep pink
  ];

  // Windy palette - dynamic, energetic colors
  const windyPalette = [
    "#00FFFF", // Cyan
    "#FF00FF", // Magenta
    "#FFFF00", // Yellow
    "#00FF00", // Lime
    "#FF6347"  // Tomato
  ];

  // Default vibrant palette - for any other weather condition
  const defaultPalette = [
    "#FF6347", // Tomato
    "#FF7F50", // Coral
    "#FFA500", // Orange
    "#FFD700", // Gold
    "#ADFF2F"  // Green yellow
  ];

  // Select a base palette based on weather description, but ensure it's always vibrant
  let basePalette: string[];

  if (description.includes("Clear") || description.includes("Sun")) {
    basePalette = sunnyPalette;
  } else if (description.includes("Cloud")) {
    basePalette = cloudyPalette;
  } else if (description.includes("Rain") || description.includes("Shower")) {
    basePalette = rainyPalette;
  } else if (description.includes("Wind")) {
    basePalette = windyPalette;
  } else {
    basePalette = defaultPalette;
  }

  // Adjust palette based on temperature
  if (temperature > 25) {
    // Make warmer for hot temperatures
    return [
      "#FF4500", // Orange red
      "#FF6347", // Tomato
      ...basePalette.slice(0, 3)
    ];
  } else if (temperature < 5) {
    // Make cooler for cold temperatures
    return [
      "#4169E1", // Royal blue
      "#1E90FF", // Dodger blue
      ...basePalette.slice(0, 3)
    ];
  }

  return basePalette;
};

// Enhance the art generation parameters for more vibrant results
export const enhanceArtParams = (weatherData: WeatherData): Partial<WeatherData> => {
  // Create a copy to avoid modifying the original
  const enhancedData = { ...weatherData };

  // Always reduce cloud cover significantly to ensure brightness
  enhancedData.cloudCover = Math.min(enhancedData.cloudCover, 30); // Drastically limit cloud cover for better contrast

  // Increase UV index for brighter colors
  enhancedData.uvIndex = Math.max(enhancedData.uvIndex, 7);

  // Ensure precipitation isn't too heavy which can make images dark
  if (enhancedData.precipitationIntensity > 3) {
    enhancedData.precipitationIntensity = 3;
  }

  // Ensure there's some wind for dynamic effects but not too much
  if (enhancedData.windSpeed < 5) {
    enhancedData.windSpeed = 5;
  } else if (enhancedData.windSpeed > 15) {
    enhancedData.windSpeed = 15; // Cap wind speed to prevent too much distortion
  }

  // For cloudy weather, modify the description to ensure it doesn't use gray tones
  if (enhancedData.description.includes("Cloud")) {
    // Force a more colorful interpretation by changing the description
    enhancedData.description = "Scattered Clouds" as any; // This tends to produce more colorful art
  }

  return enhancedData;
};
