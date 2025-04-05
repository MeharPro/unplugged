
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, TreePine, Mountain, UtensilsCrossed, List, Compass, Map as MapIcon, Route, Wind, CloudRain, Cloud, Sun } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import PlaceDetails from "@/components/PlaceDetails";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

interface Place {
  id: string;
  name: string;
  type: string;
  distance: string;
  address: string;
  description: string;
  sunExposure: string;
  hours: string;
  activities: string[];
}

const PlaceMapView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMobile = useIsMobile();
  
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [weather, setWeather] = useState<"sunny" | "cloudy" | "rainy" | "windy">("sunny");
  
  const placeType = searchParams.get('type') || "all";
  const placeName = searchParams.get('name') || "Explore";
  
  // Generate places data based on type
  useEffect(() => {
    // Simulated data fetching delay
    setIsLoading(true);
    
    setTimeout(() => {
      // Generate random weather
      const weathers: Array<"sunny" | "cloudy" | "rainy" | "windy"> = ["sunny", "cloudy", "rainy", "windy"];
      setWeather(weathers[Math.floor(Math.random() * weathers.length)]);
      
      // Generate places based on type
      const placesData = generatePlacesData();
      setPlaces(placesData);
      setIsLoading(false);
    }, 1000);
  }, [placeType]);
  
  // Generate places data based on selected type
  const generatePlacesData = () => {
    const parks: Place[] = [
      {
        id: "park1",
        name: "Central Park",
        type: "park",
        distance: "0.8 mi",
        address: "100 Central Park Way",
        description: "A beautiful urban park with walking paths, open meadows, and recreational facilities. Great for a quick nature escape in the city.",
        sunExposure: "High",
        hours: "5:00 AM - 10:00 PM",
        activities: ["Walking", "Picnics", "Sports", "Relaxation"]
      },
      {
        id: "park2",
        name: "Riverside Park",
        type: "park",
        distance: "1.2 mi",
        address: "45 River Lane",
        description: "Scenic park along the river with walking paths, sitting areas, and beautiful water views.",
        sunExposure: "Medium",
        hours: "6:00 AM - 9:00 PM",
        activities: ["Walking", "Bird watching", "Fishing", "Photography"]
      },
      {
        id: "park3",
        name: "Sunflower Gardens",
        type: "park",
        distance: "2.5 mi",
        address: "78 Flower Street",
        description: "Beautiful botanical garden featuring seasonal flowers and quiet reading nooks.",
        sunExposure: "High",
        hours: "8:00 AM - 6:00 PM",
        activities: ["Plant viewing", "Reading", "Photography", "Meditation"]
      }
    ];
    
    const trails: Place[] = [
      {
        id: "trail1",
        name: "Forest Loop Trail",
        type: "trail",
        distance: "3.2 mi",
        address: "Forest Park Entrance",
        description: "A serene trail winding through dense forest with several scenic viewpoints.",
        sunExposure: "Low",
        hours: "Dawn to Dusk",
        activities: ["Hiking", "Bird watching", "Photography", "Nature study"]
      },
      {
        id: "trail2",
        name: "Mountain Vista Trail",
        type: "trail",
        distance: "5.6 mi",
        address: "Mountain Trailhead",
        description: "Moderate difficulty trail leading to panoramic mountain views. Bring plenty of water.",
        sunExposure: "High",
        hours: "6:00 AM - 7:00 PM",
        activities: ["Hiking", "Mountain biking", "Photography", "Wildlife viewing"]
      }
    ];
    
    const cafes: Place[] = [
      {
        id: "cafe1",
        name: "Green Leaf Café",
        type: "cafe",
        distance: "0.5 mi",
        address: "123 Nature Way",
        description: "Eco-friendly café with outdoor seating surrounded by plants and trees.",
        sunExposure: "Medium",
        hours: "7:00 AM - 7:00 PM",
        activities: ["Dining", "Working", "Relaxation", "People watching"]
      },
      {
        id: "cafe2",
        name: "Riverside Coffee",
        type: "cafe",
        distance: "1.8 mi",
        address: "45 Water Street",
        description: "Café with scenic outdoor terrace overlooking the river.",
        sunExposure: "High",
        hours: "6:30 AM - 6:30 PM",
        activities: ["Coffee tasting", "Relaxation", "Nature viewing", "Reading"]
      }
    ];
    
    if (placeType === "park") return parks;
    if (placeType === "trail") return trails;
    if (placeType === "cafe") return cafes;
    if (placeType === "all") return [...parks, ...trails, ...cafes];
    
    // Return a combination by default
    return [...parks.slice(0, 1), ...trails.slice(0, 1), ...cafes.slice(0, 1)];
  };
  
  const handleBack = () => {
    if (selectedPlace) {
      setSelectedPlace(null);
    } else {
      navigate("/dashboard");
    }
  };
  
  const getPlaceIcon = (type: string, size = 5) => {
    if (type.toLowerCase().includes('park')) {
      return <TreePine className={`h-${size} w-${size}`} />;
    } else if (type.toLowerCase().includes('trail')) {
      return <Route className={`h-${size} w-${size}`} />;
    } else if (type.toLowerCase().includes('cafe')) {
      return <UtensilsCrossed className={`h-${size} w-${size}`} />;
    }
    return <MapPin className={`h-${size} w-${size}`} />;
  };
  
  const getWeatherIcon = () => {
    switch (weather) {
      case "sunny": return <Sun className="h-5 w-5 text-yellow-500" />;
      case "cloudy": return <Cloud className="h-5 w-5 text-gray-400" />;
      case "rainy": return <CloudRain className="h-5 w-5 text-blue-400" />;
      case "windy": return <Wind className="h-5 w-5 text-cyan-500" />;
      default: return <Sun className="h-5 w-5 text-yellow-500" />;
    }
  };
  
  // Render map view
  const renderMap = () => {
    if (isLoading) {
      return (
        <div className="h-[70vh] bg-blue-50/50 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            <p className="mt-2 text-gray-500">Loading map view...</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="relative h-[70vh] bg-blue-50/80 rounded-xl overflow-hidden border border-blue-100">
        {/* Map simulation */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1553095066-5014bc7b7f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2FsbCUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D&w=1000&q=80')] bg-cover bg-center opacity-20"></div>
        
        <div className="absolute top-4 right-4 z-10 flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4 mr-1" />
            List View
          </Button>
          
          <Button size="sm" className="bg-white/80 text-black hover:bg-white">
            <Compass className="h-4 w-4 mr-1" />
            My Location
          </Button>
        </div>
        
        <div className="absolute bottom-4 left-4 z-10 flex items-center">
          <div className="bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-sm flex items-center space-x-2">
            {getWeatherIcon()}
            <span className="text-sm font-medium capitalize">{weather} today</span>
          </div>
        </div>
        
        {/* Place markers */}
        {places.map((place, index) => (
          <motion.div
            key={place.id}
            className="absolute cursor-pointer z-20"
            style={{
              top: `${20 + Math.random() * 50}%`,
              left: `${20 + Math.random() * 60}%`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            onClick={() => setSelectedPlace(place)}
          >
            <div className="relative">
              <div className={`p-2 rounded-full bg-white shadow-md ${
                place.type === "park" ? "text-green-600" :
                place.type === "trail" ? "text-amber-600" : "text-orange-600"
              }`}>
                {getPlaceIcon(place.type, 4)}
              </div>
              <motion.div 
                className="absolute top-0 left-0 w-full h-full rounded-full bg-current opacity-30"
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              ></motion.div>
            </div>
            
            <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs shadow-sm whitespace-nowrap font-medium">
              {place.name}
            </div>
          </motion.div>
        ))}
        
        <motion.div 
          className="absolute bottom-4 right-4 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-white/90 backdrop-blur-sm border-none shadow-md">
            <CardContent className="p-3 text-xs">
              <div className="font-medium mb-1">Map Legend</div>
              <div className="space-y-1">
                <div className="flex items-center">
                  <div className="p-1 text-green-600">
                    <TreePine className="h-3 w-3" />
                  </div>
                  <span className="ml-1">Parks</span>
                </div>
                <div className="flex items-center">
                  <div className="p-1 text-amber-600">
                    <Route className="h-3 w-3" />
                  </div>
                  <span className="ml-1">Trails</span>
                </div>
                <div className="flex items-center">
                  <div className="p-1 text-orange-600">
                    <UtensilsCrossed className="h-3 w-3" />
                  </div>
                  <span className="ml-1">Cafés</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  };
  
  // Render list view
  const renderList = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-lg bg-white p-4 animate-pulse">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                  <div className="h-2 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="flex space-x-2">
                    <div className="h-6 rounded-full bg-gray-200 w-16"></div>
                    <div className="h-6 rounded-full bg-gray-200 w-16"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    return (
      <motion.div 
        className="space-y-3"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        <div className="flex justify-end mb-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setViewMode("map")}
          >
            <MapIcon className="h-4 w-4 mr-1" />
            Map View
          </Button>
        </div>
        
        {places.map((place) => (
          <motion.div 
            key={place.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <Card 
              className="border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedPlace(place)}
            >
              <CardContent className="p-4">
                <div className="flex items-start">
                  <div className={`p-2 rounded-full mr-3 ${
                    place.type === "park" ? "bg-green-100 text-green-600" :
                    place.type === "trail" ? "bg-amber-100 text-amber-600" : "bg-orange-100 text-orange-600"
                  }`}>
                    {getPlaceIcon(place.type, 4)}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium">{place.name}</h3>
                    <div className="flex items-center text-gray-500 text-sm mt-0.5">
                      <span>{place.type.charAt(0).toUpperCase() + place.type.slice(1)}</span>
                      <span className="mx-1">•</span>
                      <span>{place.distance} away</span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">{place.description}</p>
                    
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {place.activities.slice(0, 3).map((activity, i) => (
                        <Badge key={i} variant="outline" className="bg-gray-50 text-xs">
                          {activity}
                        </Badge>
                      ))}
                      {place.activities.length > 3 && (
                        <Badge variant="outline" className="bg-gray-50 text-xs">
                          +{place.activities.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    );
  };

  // If place is selected, show detailed view
  if (selectedPlace) {
    return <PlaceDetails place={selectedPlace} onBack={handleBack} weather={weather} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      <div className="container mx-auto px-4 pb-24">
        {/* Header */}
        <div className="py-6 flex items-center">
          <Button 
            variant="ghost" 
            size="icon"
            className="mr-3"
            onClick={handleBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">{placeName}</h1>
            <p className="text-sm text-gray-600">
              {placeType === "all" ? "All outdoor spaces" : `${placeType.charAt(0).toUpperCase() + placeType.slice(1)}s near you`}
            </p>
          </div>
        </div>
        
        {/* Map or List view */}
        <div className="mb-6">
          {viewMode === "map" ? renderMap() : renderList()}
        </div>
        
        {/* Bottom controls */}
        <div className="fixed bottom-4 left-0 right-0 px-4">
          <motion.div 
            className="w-full rounded-lg bg-white/80 backdrop-blur-sm p-3 shadow-lg border border-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mr-2"
                  onClick={() => {
                    toast({
                      title: "Saved to favorites",
                      description: "This location has been saved to your favorites.",
                    });
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1"
                  >
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
                  </svg>
                  Save
                </Button>
                
                <div className="flex items-center text-sm">
                  <span className="text-gray-500">{places.length} places</span>
                  <span className="mx-1 text-gray-300">•</span>
                  <div className="flex items-center">
                    {getWeatherIcon()}
                    <span className="ml-1 capitalize">{weather}</span>
                  </div>
                </div>
              </div>
              
              <Button 
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white"
                onClick={() => {
                  toast({
                    title: "Nature Goals Updated",
                    description: "Added to your Touch Grass goals for today!",
                  });
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <path d="M2 10s3-3 3-8"></path>
                  <path d="M8 12s3-2 3-6"></path>
                  <path d="M14 14s3-1 3-4"></path>
                  <path d="M20 16s3 0 3-2"></path>
                </svg>
                Touch Grass
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PlaceMapView;
