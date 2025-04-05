
import { Cloud, Sun, Umbrella, Wind, MapPin, Clock, ThermometerSun, CloudRain } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface WeatherCardProps {
  weather: "sunny" | "cloudy" | "rainy" | "windy";
  temperature: number;
  location: string;
  measurementSystem?: string;
}

const WeatherCard = ({ weather, temperature, location, measurementSystem = "metric" }: WeatherCardProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const tempUnit = measurementSystem === "metric" ? "°C" : "°F";

  const getWeatherIcon = () => {
    switch (weather) {
      case "sunny":
        return <Sun className="h-10 w-10 text-yellow-500" />;
      case "cloudy":
        return <Cloud className="h-10 w-10 text-gray-500" />;
      case "rainy":
        return <CloudRain className="h-10 w-10 text-blue-500" />;
      case "windy":
        return <Wind className="h-10 w-10 text-teal-500" />;
      default:
        return <Sun className="h-10 w-10 text-yellow-500" />;
    }
  };

  const getWeatherGradient = () => {
    switch (weather) {
      case "sunny":
        return "from-amber-300 to-yellow-500";
      case "cloudy":
        return "from-blue-300 to-gray-400";
      case "rainy":
        return "from-blue-400 to-indigo-600";
      case "windy":
        return "from-teal-300 to-cyan-500";
      default:
        return "from-blue-400 to-purple-500";
    }
  };

  const getWeatherDescription = () => {
    switch (weather) {
      case "sunny":
        return "Perfect day to get outside!";
      case "cloudy":
        return "Nice and cool, great for a walk!";
      case "rainy":
        return "Embrace the rain, it's refreshing!";
      case "windy":
        return "Feel the breeze on your adventure!";
      default:
        return "Great day to spend time outside!";
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleWeatherClick = () => {
    navigate(`/weather-details?location=${encodeURIComponent(location)}&weather=${weather}&temperature=${temperature}`);
  };

  // Make sure the card is clickable
  const onClick = () => {
    handleWeatherClick();
  };

  return (
    <Card
      className="overflow-hidden border-none shadow-lg cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
      onClick={onClick}
    >
      <div className={`bg-gradient-to-br ${getWeatherGradient()} p-5 rounded-lg`}>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-white opacity-90">
              <MapPin className="h-4 w-4" />
              <span className="text-sm font-medium">{location}</span>
            </div>

            <div className="flex flex-row items-center mt-1 text-white">
              <div className="flex items-center gap-1 text-xs opacity-80">
                <Clock className="h-3 w-3" />
                <span>{getCurrentTime()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xl font-medium text-white capitalize">
                {weather}
              </div>
              {!isMobile && (
                <div className="text-xs text-white opacity-80 mt-0.5 text-right">
                  {getWeatherDescription()}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <div className="text-4xl font-light text-white flex items-start">
              {temperature}
              <span className="text-xl mt-0">{tempUnit}</span>
            </div>
          </div>

          <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
            {getWeatherIcon()}
          </div>
        </div>

        {isMobile && (
          <div className="mt-3 text-xs text-white opacity-90">
            {getWeatherDescription().split(' ').slice(0, 4).join(' ')}...
          </div>
        )}
      </div>
    </Card>
  );
};

export default WeatherCard;
