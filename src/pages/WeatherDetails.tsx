
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft, Sun, Cloud, CloudRain, Wind, MapPin,
  Calendar, Clock, ThermometerSun, Compass,
  CloudSun, Droplets, Leaf
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import WeatherArtGenerator from "@/components/WeatherArtGenerator";
import { convertToWeatherImageData, fetchWeather } from "@/utils/weather";

const WeatherDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const locationName = queryParams.get("location") || "San Francisco";
  const weatherParam = queryParams.get("weather") || "sunny";
  const temperature = parseInt(queryParams.get("temperature") || "72");
  const weather = weatherParam as "sunny" | "cloudy" | "rainy" | "windy";
  const [measurementSystem, setMeasurementSystem] = useState("metric");
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [userCoords, setUserCoords] = useState<{latitude: number, longitude: number} | null>(null);

  // Get user's temperature unit preference
  useEffect(() => {
    const userPref = localStorage.getItem("unplugged_measurement_system") || "metric";
    setMeasurementSystem(userPref);

    // Get user location for weather data
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setUserCoords(coords);

          // Fetch real weather data
          fetchWeather(coords.latitude, coords.longitude).then(data => {
            if (data) {
              setWeatherData(data);
            }
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  const handleBack = () => {
    navigate("/dashboard");
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

  const getWeatherDescription = () => {
    switch (weather) {
      case "sunny":
        return "Perfect day to get outside! Soak up some vitamin D and enjoy the sunshine.";
      case "cloudy":
        return "Nice and cool, great for a walk! Less UV exposure makes it ideal for longer outdoor sessions.";
      case "rainy":
        return "Embrace the rain, it's refreshing! Look for covered spots or bring waterproof gear.";
      case "windy":
        return "Feel the breeze on your adventure! Great for flying kites or enjoying clean, fresh air.";
      default:
        return "Great day to spend time outside!";
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const handleImageGenerated = (imageUrl: string) => {
    setBackgroundImage(imageUrl);
  };

  return (
    <>
      {weatherData && (
        <WeatherArtGenerator
          weatherData={convertToWeatherImageData(weatherData)}
          onImageGenerated={handleImageGenerated}
          width={1200}
          height={800}
        />
      )}

      <div
        className="min-h-screen relative"
        style={backgroundImage ? {
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        } : { background: 'linear-gradient(to bottom, #f0f9ff, #e6fffa)' }}
      >
        {/* Add overlay to ensure content is readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/30" />

        <div className="container mx-auto px-4 pt-6 pb-24 relative z-10">
        <Button
          variant="ghost"
          size="icon"
          className="mb-4 rounded-full bg-white/30 backdrop-blur-sm text-white hover:bg-white/40"
          onClick={handleBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {/* Weather Card - Same styling as dashboard */}
        <Card className="overflow-hidden border-none shadow-lg mb-6 bg-white/20 backdrop-blur-md">
          <div className="p-5 rounded-lg relative">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-white opacity-90">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm font-medium">{locationName}</span>
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
                  <div className="text-xs text-white opacity-80 mt-0.5 text-right">
                    {getCurrentDate()}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center">
                <div className="text-4xl font-light text-white flex items-start">
                  {temperature}
                  <span className="text-xl mt-0">{measurementSystem === "metric" ? "°C" : "°F"}</span>
                </div>
              </div>

              <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                {getWeatherIcon()}
              </div>
            </div>

            <div className="mt-3 text-sm text-white opacity-90">
              {getWeatherDescription()}
            </div>
          </div>
        </Card>

        {/* Detailed Weather Info */}
        <Card className="mb-6 border-none shadow-sm overflow-hidden bg-white/20 backdrop-blur-md">
          <CardContent className="p-5 text-white">
            <h2 className="font-semibold text-lg mb-4">Detailed Weather</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center p-3 bg-white/50 backdrop-blur-sm rounded-lg">
                <ThermometerSun className="h-6 w-6 text-amber-500 mb-2" />
                <span className="text-sm text-gray-500">Feels Like</span>
                <span className="font-medium">{temperature - 2}{measurementSystem === "metric" ? "°C" : "°F"}</span>
              </div>

              <div className="flex flex-col items-center p-3 bg-white/50 backdrop-blur-sm rounded-lg">
                <Droplets className="h-6 w-6 text-blue-500 mb-2" />
                <span className="text-sm text-gray-500">Humidity</span>
                <span className="font-medium">42%</span>
              </div>

              <div className="flex flex-col items-center p-3 bg-white/50 backdrop-blur-sm rounded-lg">
                <Wind className="h-6 w-6 text-teal-500 mb-2" />
                <span className="text-sm text-gray-500">Wind</span>
                <span className="font-medium">8 mph</span>
              </div>

              <div className="flex flex-col items-center p-3 bg-white/50 backdrop-blur-sm rounded-lg">
                <CloudSun className="h-6 w-6 text-purple-500 mb-2" />
                <span className="text-sm text-gray-500">UV Index</span>
                <span className="font-medium">{weather === "sunny" ? "High" : weather === "cloudy" ? "Moderate" : "Low"}</span>
              </div>
            </div>

            <Separator className="my-5" />

            <div className="space-y-4">
              <h3 className="font-medium">Health Impact</h3>

              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Leaf className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Nature Connection</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {weather === "sunny"
                      ? "Excellent conditions for vitamin D production. 15-20 minutes of sun exposure is recommended."
                      : weather === "cloudy"
                      ? "Great conditions for extended outdoor activities with reduced UV risk."
                      : weather === "rainy"
                      ? "Rainwater creates negative ions that can improve mood and reduce stress."
                      : "Wind helps clear airborne allergens and pollutants, improving air quality."}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Best Times to Go Outside</h3>
                <div className="flex flex-wrap gap-2">
                  {weather === "sunny" ? (
                    <>
                      <Badge className="bg-green-100 text-green-800 border-0">Early Morning (6-9am)</Badge>
                      <Badge className="bg-green-100 text-green-800 border-0">Late Afternoon (4-6pm)</Badge>
                    </>
                  ) : weather === "cloudy" ? (
                    <>
                      <Badge className="bg-blue-100 text-blue-800 border-0">Midday (11am-2pm)</Badge>
                      <Badge className="bg-blue-100 text-blue-800 border-0">Afternoon (2-5pm)</Badge>
                    </>
                  ) : weather === "rainy" ? (
                    <>
                      <Badge className="bg-indigo-100 text-indigo-800 border-0">Light Rain Periods</Badge>
                      <Badge className="bg-indigo-100 text-indigo-800 border-0">After Rain (Fresh Air)</Badge>
                    </>
                  ) : (
                    <>
                      <Badge className="bg-teal-100 text-teal-800 border-0">Midday (10am-2pm)</Badge>
                      <Badge className="bg-teal-100 text-teal-800 border-0">Protected Areas</Badge>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
};

export default WeatherDetails;
