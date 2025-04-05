
import React, { useState } from "react";
import { MapPin, Sun, Cloud, CloudRain, Wind, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import WeatherArtGenerator from "./WeatherArtGenerator";
import { convertToWeatherImageData } from "@/utils/weather";
import { OpenWeatherResponse } from "@/utils/weather";

interface WeatherCardProps {
  weather: "sunny" | "cloudy" | "rainy" | "windy";
  temperature: number;
  location: string;
  onClick?: () => void;
  weatherData?: OpenWeatherResponse;
  measurementSystem?: string;
}

const EnhancedWeatherCard: React.FC<WeatherCardProps> = ({
  weather,
  temperature,
  location,
  onClick,
  weatherData,
  measurementSystem = "metric"
}) => {
  const navigate = useNavigate();
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const tempUnit = measurementSystem === "metric" ? "°C" : "°F";

  const handleImageGenerated = (imageUrl: string) => {
    setBackgroundImage(imageUrl);
  };

  const handleWeatherClick = () => {
    navigate(`/weather-details?location=${encodeURIComponent(location)}&weather=${weather}&temperature=${temperature}`);
  };
  const getWeatherIcon = () => {
    switch (weather) {
      case "sunny":
        return <Sun className="h-8 w-8 text-yellow-500 animate-pulse-slow" />;
      case "cloudy":
        return <Cloud className="h-8 w-8 text-gray-400 animate-bounce-subtle" />;
      case "rainy":
        return <CloudRain className="h-8 w-8 text-blue-400 animate-bounce-subtle" />;
      case "windy":
        return <Wind className="h-8 w-8 text-cyan-500 animate-pulse-slow" />;
      default:
        return <Sun className="h-8 w-8 text-yellow-500 animate-pulse-slow" />;
    }
  };

  const getWeatherGradient = () => {
    switch (weather) {
      case "sunny":
        return "from-amber-500 via-orange-400 to-yellow-300";
      case "cloudy":
        return "from-gray-400 via-slate-300 to-blue-200";
      case "rainy":
        return "from-blue-500 via-blue-400 to-indigo-300";
      case "windy":
        return "from-cyan-500 via-teal-400 to-blue-300";
      default:
        return "from-blue-500 to-purple-500";
    }
  };

  const getWeatherEmoji = () => {
    switch (weather) {
      case "sunny":
        return "☀️";
      case "cloudy":
        return "☁️";
      case "rainy":
        return "🌧️";
      case "windy":
        return "💨";
      default:
        return "🌤️";
    }
  };

  const getTextColor = () => {
    return weather === "sunny" || weather === "windy" ? "text-white" : "text-gray-800";
  };

  return (
    <>
      {weatherData && (
        <WeatherArtGenerator
          weatherData={convertToWeatherImageData(weatherData)}
          onImageGenerated={handleImageGenerated}
        />
      )}

      <div
        className={`rounded-xl overflow-hidden shadow-lg cursor-pointer animate-fade-in transform hover:scale-[1.01] transition-all duration-300`}
        onClick={onClick || handleWeatherClick}
        role="button"
        aria-label={`Weather details for ${location}: ${temperature}${tempUnit}, ${weather}`}
      >
        <div
          className={`p-5 relative ${!backgroundImage ? `bg-gradient-to-br ${getWeatherGradient()}` : ''}`}
          style={backgroundImage ? {
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          } : {}}
        >
          {/* Add overlay to ensure text is readable over the image */}
          {backgroundImage && (
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/30 rounded-lg" />
          )}
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/10"
              style={{
                width: `${Math.random() * 40 + 10}px`,
                height: `${Math.random() * 40 + 10}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5,
                animation: `float ${Math.random() * 10 + 5}s infinite ease-in-out`
              }}
            />
          ))}
        </div>

        <div className="flex justify-between items-start relative z-10">
          <div className={`${getTextColor()}`}>
            <div className="flex items-center mb-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="font-medium">{location}</span>
            </div>
            <p className="text-sm opacity-80">Now</p>
          </div>
          <div className={`flex items-center ${getTextColor()}`}>
            {getWeatherIcon()}
          </div>
        </div>

        <div className={`mt-4 ${getTextColor()}`}>
          <div className="flex items-end">
            <span className="text-5xl font-light">{temperature}{tempUnit}</span>
            <span className="ml-2 text-xl capitalize">{weather}</span>
          </div>
        </div>

        <div className={`mt-4 ${getTextColor()}`}>
          <div className="flex space-x-3 text-sm">
            <div className="flex flex-col items-center">
              <span className="opacity-70">Morning</span>
              <span className="font-medium">{temperature - 5}{tempUnit}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="opacity-70">Day</span>
              <span className="font-medium">{temperature}{tempUnit}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="opacity-70">Evening</span>
              <span className="font-medium">{temperature - 8}{tempUnit}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className={`text-xs opacity-70 ${getTextColor()}`}>
            Tap for detailed forecast
          </div>
          <div className={`text-lg ${getTextColor()}`}>
            {getWeatherEmoji()}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default EnhancedWeatherCard;
