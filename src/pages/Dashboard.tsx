
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, Sun, Cloud, Camera, CloudRain, Bell, Search, MapPin } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import useUserName from "@/hooks/use-user-name";
import MainMenu from "@/components/MainMenu";
import WeatherCard from "@/components/WeatherCard";
import EnhancedWeatherCard from "@/components/EnhancedWeatherCard";
import SuggestedPlaces from "@/components/SuggestedPlaces";
import NatureSoundPlayer from "@/components/NatureSoundPlayer";
import { motion } from "framer-motion";
import { fetchWeather, mapWeatherType, OpenWeatherResponse } from "@/utils/weather";

const Dashboard = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName] = useUserName();
  const [weather, setWeather] = useState<"sunny" | "cloudy" | "rainy" | "windy">("sunny");
  const [temperature, setTemperature] = useState(72);
  const [location, setLocation] = useState("Current Location");
  const [weatherData, setWeatherData] = useState<OpenWeatherResponse | null>(null);
  const [userCoords, setUserCoords] = useState<{latitude: number, longitude: number} | null>(null);
  const measurementSystem = localStorage.getItem("unplugged_measurement_system") || "metric";
  const [showSoundPlayer, setShowSoundPlayer] = useState(false);
  const [minimizedPlayer, setMinimizedPlayer] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCaptureDialog, setShowCaptureDialog] = useState(false);

  // Get current time greeting
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Fetch real weather data
  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setUserCoords(coords);

          // Fetch weather data
          fetchWeather(coords.latitude, coords.longitude).then(data => {
            if (data) {
              setWeatherData(data);

              // Convert to app's weather type
              const weatherType = mapWeatherType(data.weather[0].main);
              setWeather(weatherType);

              // Convert temperature based on user preference
              const temp = measurementSystem === "metric"
                ? Math.round(data.main.temp)
                : Math.round((data.main.temp * 9/5) + 32);
              setTemperature(temp);

              // Set location name
              setLocation(data.name);
            }
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Location access denied",
            description: "Using default weather data instead.",
            variant: "destructive"
          });

          // Fallback to random weather
          const weathers: Array<"sunny" | "cloudy" | "rainy" | "windy"> = ["sunny", "cloudy", "rainy", "windy"];
          const randomWeather = weathers[Math.floor(Math.random() * weathers.length)];
          const randomTemp = Math.floor(Math.random() * 20) + 65; // Between 65-85°F

          setWeather(randomWeather);
          setTemperature(randomTemp);
        }
      );
    } else {
      // Geolocation not supported
      toast({
        title: "Geolocation not supported",
        description: "Using default weather data instead.",
        variant: "destructive"
      });

      // Fallback to random weather
      const weathers: Array<"sunny" | "cloudy" | "rainy" | "windy"> = ["sunny", "cloudy", "rainy", "windy"];
      const randomWeather = weathers[Math.floor(Math.random() * weathers.length)];
      const randomTemp = Math.floor(Math.random() * 20) + 65; // Between 65-85°F

      setWeather(randomWeather);
      setTemperature(randomTemp);
    }
  }, []);

  const handleNatureSoundToggle = () => {
    if (!showSoundPlayer) {
      setShowSoundPlayer(true);
      setMinimizedPlayer(false);
      toast({
        title: "Nature Sounds Activated",
        description: "Relax with the sounds of nature based on today's weather.",
      });
    } else {
      setMinimizedPlayer(!minimizedPlayer);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/map-search?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCaptureMoment = () => {
    // Navigate to capture page
    navigate("/capture");
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      <div className="container mx-auto px-4 pb-24 max-w-4xl">
        <MainMenu open={menuOpen} onOpenChange={setMenuOpen} weather={weather} />

        {/* Header */}
        <motion.div
          className="py-6 flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <h1 className="text-2xl font-bold">
              {getTimeGreeting()}, {userName.firstName || "Explorer"}
            </h1>
            <p className="text-gray-600 text-sm">It's time to reconnect with nature</p>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white shadow-sm"
              onClick={handleNatureSoundToggle}
            >
              {!showSoundPlayer ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-green-600"
                >
                  <path d="M2 10s3-3 3-8"></path>
                  <path d="M8 12s3-2 3-6"></path>
                  <path d="M14 14s3-1 3-4"></path>
                  <path d="M20 16s3 0 3-2"></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-green-600"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="4"></circle>
                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                </svg>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white shadow-sm"
              onClick={() => setMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </motion.div>

        {/* Weather Card */}
        <motion.div
          className="my-4"
          variants={item}
          initial="hidden"
          animate="show"
        >
          {weatherData ? (
            <EnhancedWeatherCard
              weather={weather}
              temperature={temperature}
              location={location}
              weatherData={weatherData}
              measurementSystem={measurementSystem}
            />
          ) : (
            <WeatherCard
              weather={weather}
              temperature={temperature}
              location={location}
              measurementSystem={measurementSystem}
            />
          )}
        </motion.div>

        {/* Search Bar */}
        <motion.form
          onSubmit={handleSearch}
          className="relative my-6"
          variants={item}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.1 }}
        >
          <Input
            type="text"
            placeholder="Search for parks, trails, or outdoor spaces..."
            className="pr-10 bg-white/80 backdrop-blur-sm border-green-100 focus:border-green-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1 h-8 w-8 p-0"
          >
            <Search className="h-4 w-4 text-green-600" />
          </Button>
        </motion.form>

        {/* Nature Sound Player (if active) */}
        {showSoundPlayer && !minimizedPlayer && (
          <motion.div
            className="my-4"
            variants={item}
            initial="hidden"
            animate="show"
          >
            <NatureSoundPlayer
              weather={weather}
              onToggleMinimize={() => setMinimizedPlayer(true)}
            />
          </motion.div>
        )}

        {/* Show minimized player */}
        {showSoundPlayer && minimizedPlayer && (
          <NatureSoundPlayer
            weather={weather}
            minimized={true}
            onToggleMinimize={() => setMinimizedPlayer(false)}
          />
        )}

        {/* Suggested Places */}
        <motion.div
          className="my-6"
          variants={item}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.1 }}
        >
          <SuggestedPlaces weather={weather} />
        </motion.div>

        {/* Capture Button - Fixed at bottom */}
        <motion.div
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={handleCaptureMoment}
            className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg flex items-center justify-center"
          >
            <Camera className="h-6 w-6" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
