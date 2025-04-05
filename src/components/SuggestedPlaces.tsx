import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { MapPin, TreePine, Mountain, UtensilsCrossed, ArrowRight, Compass, Route, Coffee, Camera, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchPlaces, Place } from "@/utils/mapboxPlaces";
import { toast } from "@/components/ui/use-toast";

interface SuggestedPlacesProps {
  weather: "sunny" | "cloudy" | "rainy" | "windy";
}

const SuggestedPlaces: React.FC<SuggestedPlacesProps> = ({ weather }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("parks");
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [placesData, setPlacesData] = useState<Record<string, Place[]>>({});
  const measurementSystem = localStorage.getItem("unplugged_measurement_system") || "metric";
  
  // Get user location and fetch places
  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setUserLocation(coords);
          
          try {
            // Fetch places for each category
            const categories = ['parks', 'trails', 'cafes', 'beaches', 'viewpoints'];
            const results: Record<string, Place[]> = {};
            
            for (const category of categories) {
              const places = await fetchPlaces(category, coords);
              results[category] = places;
            }
            
            setPlacesData(results);
          } catch (error) {
            console.error('Error fetching places:', error);
            toast({
              title: "Couldn't load places",
              description: "We had trouble finding places near you. Using sample data instead.",
              variant: "destructive"
            });
            // Use fallback data
            setPlacesData(getFallbackPlaces());
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setLoading(false);
          toast({
            title: "Location access denied",
            description: "We couldn't access your location. Using sample data instead.",
            variant: "destructive"
          });
          // Use fallback data
          setPlacesData(getFallbackPlaces());
        }
      );
    } else {
      // Geolocation not supported
      setLoading(false);
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation. Using sample data instead.",
        variant: "destructive"
      });
      // Use fallback data
      setPlacesData(getFallbackPlaces());
    }
  }, []);
  
  const handleViewAll = () => {
    navigate(`/places-list?type=${activeTab}&weather=${weather}`);
  };
  
  const handlePlaceClick = (name: string, type: string) => {
    navigate(`/place-map-view?name=${encodeURIComponent(name)}&type=${encodeURIComponent(type)}`);
  };
  
  // Animation variants for items
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
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };
  
  // Fallback place data in case location access fails
  const getFallbackPlaces = () => {
    return {
      parks: [
        {
          id: "p1",
          name: "Riverside Park",
          address: "123 Park Ave",
          coordinates: [-74.0060, 40.7128] as [number, number],
          distance: "0.8 mi",
          type: "park",
          sunExposure: "Medium",
          image: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=500&auto=format&fit=crop&q=60"
        },
        {
          id: "p2",
          name: "Oakwood Gardens",
          address: "456 Garden St",
          coordinates: [-74.0060, 40.7128] as [number, number],
          distance: "1.2 mi",
          type: "park",
          sunExposure: "Low",
          image: "https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=500&auto=format&fit=crop&q=60"
        }
      ],
      trails: [
        {
          id: "t1",
          name: "Forest Loop Trail",
          address: "123 Forest Path",
          coordinates: [-74.0060, 40.7128] as [number, number],
          distance: "2.3 mi",
          type: "trail",
          sunExposure: "Low",
          image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=500&auto=format&fit=crop&q=60"
        },
        {
          id: "t2",
          name: "Hillside Path",
          address: "456 Hill Rd",
          coordinates: [-74.0060, 40.7128] as [number, number],
          distance: "3.1 mi",
          type: "trail",
          sunExposure: "Medium",
          image: "https://images.unsplash.com/photo-1510077143771-1b6a7efe2be5?w=500&auto=format&fit=crop&q=60"
        }
      ],
      cafes: [
        {
          id: "c1",
          name: "Green Terrace Cafe",
          address: "123 Cafe St",
          coordinates: [-74.0060, 40.7128] as [number, number],
          distance: "0.5 mi",
          type: "cafe",
          sunExposure: "Medium",
          image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500&auto=format&fit=crop&q=60"
        },
        {
          id: "c2",
          name: "Sunshine Patio",
          address: "456 Sunny Ave",
          coordinates: [-74.0060, 40.7128] as [number, number],
          distance: "1.0 mi",
          type: "cafe",
          sunExposure: "High",
          image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&auto=format&fit=crop&q=60"
        }
      ],
      beaches: [
        {
          id: "b1",
          name: "Sandy Shores",
          address: "123 Beach Rd",
          coordinates: [-74.0060, 40.7128] as [number, number],
          distance: "4.2 mi",
          type: "beach",
          sunExposure: "High",
          image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=60"
        },
        {
          id: "b2",
          name: "Sunset Beach",
          address: "456 Sunset Dr",
          coordinates: [-74.0060, 40.7128] as [number, number],
          distance: "5.1 mi",
          type: "beach",
          sunExposure: "High",
          image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=500&auto=format&fit=crop&q=60"
        }
      ],
      viewpoints: [
        {
          id: "v1",
          name: "Eagle's Nest Lookout",
          address: "123 Mountain Rd",
          coordinates: [-74.0060, 40.7128] as [number, number],
          distance: "6.3 mi",
          type: "viewpoint",
          sunExposure: "High",
          image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&auto=format&fit=crop&q=60"
        },
        {
          id: "v2",
          name: "Mountain Vista",
          address: "456 Vista Point",
          coordinates: [-74.0060, 40.7128] as [number, number],
          distance: "8.2 mi",
          type: "viewpoint",
          sunExposure: "Medium",
          image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=500&auto=format&fit=crop&q=60"
        }
      ]
    };
  };
  
  const categoryLabels = {
    parks: "Parks",
    trails: "Trails",
    cafes: "Cafes",
    beaches: "Beaches",
    viewpoints: "Viewpoints"
  };
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "parks":
        return <TreePine className="h-4 w-4" />;
      case "trails":
        return <Route className="h-4 w-4" />;
      case "cafes":
        return <Coffee className="h-4 w-4" />;
      case "beaches":
        return <UtensilsCrossed className="h-4 w-4" />;
      case "viewpoints":
        return <Mountain className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  return (
    <Card className="overflow-hidden bg-white border-none shadow-sm">
      <div className="p-4 flex items-center justify-between bg-gradient-to-r from-blue-50 to-green-50">
        <div className="flex items-center">
          <MapPin className="h-5 w-5 text-blue-500 mr-2" />
          <h2 className="font-medium text-gray-900">Places to Go</h2>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs flex items-center text-blue-500"
          onClick={handleViewAll}
        >
          View All
          <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </div>
      
      <Tabs defaultValue="parks" value={activeTab} onValueChange={setActiveTab}>
        <div className="px-4 pt-2">
          <TabsList className="grid grid-cols-5 bg-gray-100">
            <TabsTrigger value="parks" className="text-xs py-1.5">
              <TreePine className="h-3.5 w-3.5 mr-1.5" />
              Parks
            </TabsTrigger>
            <TabsTrigger value="trails" className="text-xs py-1.5">
              <Route className="h-3.5 w-3.5 mr-1.5" />
              Trails
            </TabsTrigger>
            <TabsTrigger value="cafes" className="text-xs py-1.5">
              <Coffee className="h-3.5 w-3.5 mr-1.5" />
              Cafes
            </TabsTrigger>
            <TabsTrigger value="beaches" className="text-xs py-1.5">
              <UtensilsCrossed className="h-3.5 w-3.5 mr-1.5" />
              Beaches
            </TabsTrigger>
            <TabsTrigger value="viewpoints" className="text-xs py-1.5">
              <Mountain className="h-3.5 w-3.5 mr-1.5" />
              Views
            </TabsTrigger>
          </TabsList>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin mr-2" />
            <p className="text-gray-600">Finding places near you...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {Object.entries(placesData).map(([key, placeList]) => (
              <TabsContent key={key} value={key} className="m-0">
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white"
                  variants={container}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0 }}
                >
                  {placeList && placeList.length > 0 ? placeList.map((place) => (
                    <motion.div 
                      key={place.id}
                      variants={item}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className="overflow-hidden cursor-pointer border-none shadow-sm hover:shadow-md transition-shadow duration-300"
                        onClick={() => handlePlaceClick(place.name, key.slice(0, -1))}
                      >
                        <div className="relative h-24 w-full bg-gray-100 overflow-hidden">
                          {place.image && (
                            <img 
                              src={place.image} 
                              alt={place.name} 
                              className="w-full h-full object-cover"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                          <div className="absolute bottom-2 left-3 right-3 flex justify-between items-end">
                            <h3 className="font-medium text-white text-shadow">{place.name}</h3>
                            <span className="text-xs bg-black/40 backdrop-blur-sm text-white py-1 px-2 rounded-full">
                              {place.distance}
                            </span>
                          </div>
                        </div>
                        <div className="p-3 flex justify-between items-center">
                          <div className="flex items-center text-xs text-gray-500">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span className="truncate max-w-[120px]">{place.address}</span>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              place.sunExposure === "High" 
                                ? "bg-yellow-50 text-yellow-700 border-yellow-200" 
                                : place.sunExposure === "Medium" 
                                ? "bg-orange-50 text-orange-700 border-orange-200" 
                                : "bg-blue-50 text-blue-700 border-blue-200"
                            }`}
                          >
                            {place.sunExposure} sun
                          </Badge>
                        </div>
                      </Card>
                    </motion.div>
                  )) : (
                    <div className="col-span-2 p-4 text-center text-gray-500">
                      <p>No {key} found nearby. Try another category.</p>
                    </div>
                  )}
                </motion.div>
                <div className="p-3 text-center border-t border-gray-100 bg-gray-50">
                  <Button
                    variant="link"
                    className="text-xs text-blue-600"
                    onClick={() => navigate(`/places-list?type=${key}&weather=${weather}`)}
                  >
                    See all {categoryLabels[key as keyof typeof categoryLabels]}
                  </Button>
                </div>
              </TabsContent>
            ))}
          </AnimatePresence>
        )}
      </Tabs>
    </Card>
  );
};

export default SuggestedPlaces;
