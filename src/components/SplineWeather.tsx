
import { useState, useEffect } from "react";
import { Wind, Droplets } from "lucide-react";

interface SplineWeatherProps {
  weather: "sunny" | "cloudy" | "rainy" | "windy";
  temperature?: number;
  location?: string;
}

const SplineWeather = ({ 
  weather, 
  temperature = 22, 
  location = "San Francisco" 
}: SplineWeatherProps) => {
  const [time, setTime] = useState<string>("");
  const [windSpeed, setWindSpeed] = useState<number>(5);
  const [visibility, setVisibility] = useState<number>(2);
  const [airQuality, setAirQuality] = useState<number>(73);
  const [humidity, setHumidity] = useState<number>(29);

  useEffect(() => {
    // Set current time
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes} ${now.getHours() >= 12 ? 'PM' : 'AM'}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  // Generate background colors based on weather
  const getBackgroundStyle = () => {
    switch (weather) {
      case "sunny":
        return "bg-gradient-to-b from-amber-300/70 to-yellow-100/70";
      case "cloudy":
        return "bg-gradient-to-b from-blue-300/70 to-gray-200/70";
      case "rainy":
        return "bg-gradient-to-b from-blue-400/70 to-indigo-200/70";
      case "windy":
        return "bg-gradient-to-b from-teal-300/70 to-cyan-100/70";
      default:
        return "bg-gradient-to-b from-amber-300/70 to-yellow-100/70";
    }
  };

  return (
    <div className={`w-full h-64 rounded-xl ${getBackgroundStyle()} backdrop-blur-md flex items-center justify-center relative overflow-hidden`}>
      {/* Decorative circles for background */}
      <div className="absolute top-6 right-6 w-20 h-20 rounded-full bg-white/20 blur-sm"></div>
      <div className="absolute bottom-6 left-6 w-16 h-16 rounded-full bg-white/10 blur-sm"></div>
      
      {/* Glass card */}
      <div className="bg-white/20 backdrop-blur-md rounded-lg p-6 w-80 shadow-lg border border-white/30">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-light text-white">{location}</h2>
            <p className="text-white/90 text-sm flex items-center gap-2">
              {weather.charAt(0).toUpperCase() + weather.slice(1)} · {time}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          {/* Left column - conditions */}
          <div className="space-y-3">
            <div>
              <p className="text-white/80 text-xs mb-1">Wind</p>
              <div className="flex items-center gap-1">
                <div className="w-16 h-1.5 bg-gradient-to-r from-green-300 via-yellow-300 to-red-300 rounded-full"></div>
                <span className="text-white text-xs">{windSpeed} km/h</span>
              </div>
            </div>
            
            <div>
              <p className="text-white/80 text-xs mb-1">Air quality</p>
              <div className="flex items-center gap-1">
                <div className="w-16 h-1.5 bg-gradient-to-r from-green-300 via-yellow-300 to-red-300 rounded-full"></div>
                <span className="text-white text-xs">{airQuality}</span>
              </div>
            </div>
          </div>
          
          {/* Right column - conditions */}
          <div className="space-y-3">
            <div>
              <p className="text-white/80 text-xs mb-1">Visibility</p>
              <div className="flex items-center gap-1">
                <span className="text-white text-xs">≈ {visibility} km</span>
              </div>
            </div>
            
            <div>
              <p className="text-white/80 text-xs mb-1">Humidity</p>
              <div className="flex items-center gap-1">
                <Droplets className="h-3 w-3 text-white" />
                <span className="text-white text-xs">{humidity}%</span>
                <div className="w-8 h-1.5 bg-gradient-to-r from-blue-300 to-orange-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Temperature display */}
        <div className="absolute right-6 bottom-6">
          <div className="text-white text-5xl font-light flex items-start">
            {temperature}
            <span className="text-xl mt-1">°C</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplineWeather;
