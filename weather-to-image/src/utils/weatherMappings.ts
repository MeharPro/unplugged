
import { WeatherData, WeatherDescription, ArtGenre, ArtStyle, DrawingParams } from "@/types/weather";

// Map weather descriptions to appropriate art genres
export const getGenresByWeatherDescription = (description: WeatherDescription): ArtGenre[] => {
  const genreMap: Record<WeatherDescription, ArtGenre[]> = {
    "Clear": ["Minimalism", "Geometric Abstract", "Pop Art"],
    "Few Clouds": ["Minimalism", "Watercolor", "Geometric Abstract"],
    "Scattered Clouds": ["Impressionism", "Watercolor", "Abstract Expressionism"],
    "Broken Clouds": ["Abstract Expressionism", "Impressionism", "Surrealism"],
    "Shower Rain": ["Impressionism", "Watercolor", "Line Art"],
    "Rain": ["Impressionism", "Watercolor", "Abstract Expressionism"],
    "Thunderstorm": ["Expressionism", "Surrealism", "Glitch Art"],
    "Snow": ["Minimalism", "Pointillism", "Watercolor"],
    "Mist": ["Impressionism", "Minimalism", "Watercolor"],
    "Fog": ["Impressionism", "Minimalism", "Abstract Expressionism"]
  };
  
  return genreMap[description] || ["Abstract Expressionism"];
};

// Generate appropriate color palettes based on temperature
export const getColorPaletteByTemperature = (temperature: number): string[] => {
  // Hot temperature (>30°C)
  if (temperature > 30) {
    return ["#FF4500", "#FF7F50", "#FFA07A", "#FFD700", "#FFFFE0"];
  }
  // Warm temperature (20-30°C)
  else if (temperature > 20) {
    return ["#FFA500", "#FFD700", "#FFDAB9", "#FFFACD", "#FFFFE0"];
  }
  // Mild temperature (10-20°C)
  else if (temperature > 10) {
    return ["#98FB98", "#7FFFD4", "#FFFACD", "#B0E0E6", "#87CEEB"];
  }
  // Cool temperature (0-10°C)
  else if (temperature > 0) {
    return ["#ADD8E6", "#B0E0E6", "#87CEEB", "#E0FFFF", "#F0F8FF"];
  }
  // Cold temperature (<0°C)
  else {
    return ["#E0FFFF", "#F0F8FF", "#B0C4DE", "#D6BCFA", "#9370DB"];
  }
};

// Map precipitation to visual parameters
export const getPrecipitationParams = (probability: number, intensity: number): {density: number, opacity: number} => {
  const density = Math.max(5, Math.min(100, probability * 100));
  const opacity = Math.max(0.3, Math.min(0.9, 0.3 + (intensity / 10)));
  
  return { density, opacity };
};

// Map wind data to visual distortion
export const getWindParams = (speed: number, direction: number): {distortion: number, directionality: number} => {
  const distortion = Math.max(0, Math.min(50, speed * 5));
  const directionality = direction;
  
  return { distortion, directionality };
};

// Map cloud cover and humidity to atmospheric effects
export const getAtmosphericParams = (cloudCover: number, humidity: number): {contrast: number, saturation: number, brightness: number, blur: number} => {
  const contrast = Math.max(50, 100 - cloudCover);
  const saturation = Math.max(50, 100 - (cloudCover * 0.5));
  const brightness = Math.max(50, 100 - (cloudCover * 0.7));
  const blur = Math.min(5, (humidity / 20));
  
  return { contrast, saturation, brightness, blur };
};

// Select a random genre from the appropriate list for this weather
export const selectRandomGenre = (description: WeatherDescription): ArtGenre => {
  const genres = getGenresByWeatherDescription(description);
  return genres[Math.floor(Math.random() * genres.length)];
};

// Generate art style description
export const generateArtStyle = (weatherData: WeatherData): ArtStyle => {
  const genre = selectRandomGenre(weatherData.description);
  
  let mood = "";
  let colorDescription = "";
  let technique = "";
  
  // Set mood based on temperature and weather
  if (weatherData.temperature > 25) mood = "warm, vibrant";
  else if (weatherData.temperature < 5) mood = "cold, stark";
  else mood = "balanced, moderate";
  
  if (weatherData.description.includes("Rain") || weatherData.description.includes("Storm")) {
    mood += ", dramatic";
  } else if (weatherData.description.includes("Clear")) {
    mood += ", peaceful";
  }
  
  // Set color description based on temperature and cloud cover
  const tempWord = weatherData.temperature > 25 ? "warm" : weatherData.temperature < 5 ? "cool" : "neutral";
  const saturationWord = weatherData.cloudCover > 70 ? "muted" : "vibrant";
  colorDescription = `${saturationWord} ${tempWord} tones`;
  
  // Set technique based on genre and weather
  switch(genre) {
    case "Impressionism":
      technique = weatherData.description.includes("Rain") ? "wet-on-wet brushwork" : "quick, light brushstrokes";
      break;
    case "Abstract Expressionism":
      technique = weatherData.windSpeed > 20 ? "dynamic, sweeping gestures" : "layered, textural application";
      break;
    case "Watercolor":
      technique = weatherData.humidity > 70 ? "blended washes with soft edges" : "controlled wash with defined edges";
      break;
    case "Geometric Abstract":
      technique = "structured geometric shapes with clean lines";
      break;
    case "Minimalism":
      technique = "restrained elements with emphasis on negative space";
      break;
    case "Pointillism":
      technique = "densely packed color points creating optical blending";
      break;
    default:
      technique = "mixed media with varied mark-making";
  }
  
  return {
    genre,
    mood,
    colorDescription,
    technique
  };
};

// Generate complete drawing parameters from weather data
export const generateDrawingParams = (weatherData: WeatherData): DrawingParams => {
  const colorPalette = getColorPaletteByTemperature(weatherData.temperature);
  
  // Generate a complementary background gradient
  const backgroundGradient = [colorPalette[0], colorPalette[colorPalette.length - 1]];
  
  const { density, opacity } = getPrecipitationParams(
    weatherData.precipitationProbability, 
    weatherData.precipitationIntensity
  );
  
  const { distortion, directionality } = getWindParams(
    weatherData.windSpeed, 
    weatherData.windDirection
  );
  
  const { contrast, saturation, brightness, blur } = getAtmosphericParams(
    weatherData.cloudCover, 
    weatherData.humidity
  );
  
  // Calculate stroke width based on UV index (higher UV = thinner, more precise lines)
  const strokeWidth = Math.max(1, 5 - (weatherData.uvIndex / 3));
  
  // Particle parameters for animation
  const particleSize = Math.max(1, Math.min(5, weatherData.precipitationIntensity * 2));
  const movementSpeed = Math.max(1, Math.min(10, weatherData.windSpeed * 0.5));
  const particleCount = Math.max(10, Math.min(500, weatherData.precipitationProbability * 500));
  
  return {
    colorPalette,
    backgroundGradient,
    strokeWidth,
    density,
    opacity,
    distortion,
    directionality,
    contrast,
    saturation,
    brightness,
    blur,
    particleSize,
    movementSpeed,
    particleCount
  };
};
