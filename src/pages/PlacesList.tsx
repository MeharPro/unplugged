
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, TreePine, Mountain, UtensilsCrossed, Search, Filter, CalendarDays } from "lucide-react";
import { Input } from "@/components/ui/input";
import OutdoorActivitySuggestions from "@/components/OutdoorActivitySuggestions";
import { motion } from "framer-motion";
import LocalGreenSpacesMap from "@/components/LocalGreenSpacesMap";

const PlacesList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedType = searchParams.get('type') || "all";
  const currentWeather = searchParams.get('weather') || "sunny";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [placeTypes, setPlaceTypes] = useState<string[]>(["park", "trail", "cafe"]);
  const [selectedPlaceType, setSelectedPlaceType] = useState<string>(selectedType);
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulated data loading
    setLoading(true);
    setTimeout(() => {
      // Generate places based on selected type
      const placesData = generatePlacesData();
      setPlaces(placesData);
      setLoading(false);
    }, 1000);
  }, [selectedPlaceType]);
  
  const handleBack = () => {
    navigate("/dashboard");
  };
  
  const generatePlacesData = () => {
    const allPlaces = [
      {
        id: "park1",
        name: "Central Park",
        type: "park",
        distance: "0.8 mi",
        description: "A beautiful urban park with walking paths and recreational facilities.",
        sunExposure: "High",
        activities: ["Walking", "Picnics", "Sports"]
      },
      {
        id: "park2",
        name: "Riverside Gardens",
        type: "park",
        distance: "1.2 mi",
        description: "Scenic park along the river with beautiful water views.",
        sunExposure: "Medium",
        activities: ["Walking", "Bird watching", "Photography"]
      },
      {
        id: "trail1",
        name: "Forest Loop Trail",
        type: "trail",
        distance: "3.2 mi",
        description: "A serene trail winding through dense forest with scenic viewpoints.",
        sunExposure: "Low",
        activities: ["Hiking", "Nature study", "Photography"]
      },
      {
        id: "trail2",
        name: "Mountain Vista Trail",
        type: "trail",
        distance: "5.6 mi",
        description: "Moderate difficulty trail leading to panoramic mountain views.",
        sunExposure: "High",
        activities: ["Hiking", "Mountain biking", "Photography"]
      },
      {
        id: "cafe1",
        name: "Green Leaf Café",
        type: "cafe",
        distance: "0.5 mi",
        description: "Eco-friendly café with outdoor seating surrounded by plants.",
        sunExposure: "Medium",
        activities: ["Dining", "Working", "Relaxation"]
      },
      {
        id: "cafe2",
        name: "Riverside Coffee",
        type: "cafe",
        distance: "1.8 mi",
        description: "Café with scenic outdoor terrace overlooking the river.",
        sunExposure: "High",
        activities: ["Coffee", "Relaxation", "Nature viewing"]
      },
    ];
    
    let filteredPlaces = allPlaces;
    
    // Filter by type if not "all"
    if (selectedPlaceType !== "all") {
      filteredPlaces = allPlaces.filter(place => place.type === selectedPlaceType);
    }
    
    // Filter by search if present
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredPlaces = filteredPlaces.filter(place => 
        place.name.toLowerCase().includes(query) ||
        place.description.toLowerCase().includes(query) ||
        place.activities.some((act: string) => act.toLowerCase().includes(query))
      );
    }
    
    return filteredPlaces;
  };
  
  const getPlaceIcon = (type: string) => {
    switch (type) {
      case "park":
        return <TreePine className="h-4 w-4" />;
      case "trail":
        return <Mountain className="h-4 w-4" />;
      case "cafe":
        return <UtensilsCrossed className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };
  
  const getPlaceColor = (type: string) => {
    switch (type) {
      case "park":
        return "bg-green-100 text-green-600";
      case "trail":
        return "bg-amber-100 text-amber-600";
      case "cafe":
        return "bg-orange-100 text-orange-600";
      default:
        return "bg-blue-100 text-blue-600";
    }
  };
  
  const handlePlaceClick = (place: any) => {
    navigate(`/place-map-view?name=${encodeURIComponent(place.name)}&type=${encodeURIComponent(place.type)}`);
  };
  
  const filterByType = (type: string) => {
    setSelectedPlaceType(type);
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

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
            <h1 className="text-xl font-bold">Outdoor Places</h1>
            <p className="text-sm text-gray-600">Find your next nature connection spot</p>
          </div>
        </div>
        
        {/* Search and filter bar */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search parks, trails, activities..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              variant="ghost" 
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          {filterOpen && (
            <motion.div 
              className="bg-white rounded-lg p-4 shadow-md"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="font-medium mb-2">Filter by type</h3>
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant={selectedPlaceType === "all" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => filterByType("all")}
                >
                  All Places
                </Badge>
                {placeTypes.map((type) => (
                  <Badge
                    key={type}
                    variant={selectedPlaceType === type ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => filterByType(type)}
                  >
                    <span className="capitalize">{type}s</span>
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Activity suggestions based on weather */}
        <div className="mb-6">
          <OutdoorActivitySuggestions weather={currentWeather as "sunny" | "cloudy" | "rainy" | "windy"} />
        </div>
        
        {/* Local green spaces map */}
        <div className="mb-6">
          <LocalGreenSpacesMap weather={currentWeather} />
        </div>
        
        {/* Places list */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <CalendarDays className="h-5 w-5 text-blue-600 mr-2" />
              Places to Visit
            </h2>
            <Badge variant="outline">
              {places.length} {selectedPlaceType === "all" ? "places" : selectedPlaceType + "s"} found
            </Badge>
          </div>
          
          {loading ? (
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
          ) : places.length === 0 ? (
            <div className="text-center py-8 bg-white/50 backdrop-blur-sm rounded-lg">
              <MapPin className="h-12 w-12 mx-auto text-gray-300 mb-2" />
              <h3 className="text-lg font-medium text-gray-700">No places found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedPlaceType("all");
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <motion.div 
              className="space-y-3"
              initial="hidden"
              animate="visible"
              variants={container}
            >
              {places.map((place) => (
                <motion.div 
                  key={place.id}
                  variants={item}
                >
                  <Card 
                    className="border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300 cursor-pointer"
                    onClick={() => handlePlaceClick(place)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <div className={`p-2 rounded-full mr-3 ${getPlaceColor(place.type)}`}>
                          {getPlaceIcon(place.type)}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-medium">{place.name}</h3>
                          <div className="flex items-center text-gray-500 text-sm mt-0.5">
                            <span>{place.type.charAt(0).toUpperCase() + place.type.slice(1)}</span>
                            <span className="mx-1">•</span>
                            <span>{place.distance} away</span>
                            <span className="mx-1">•</span>
                            <span className={
                              place.sunExposure === "High" ? "text-yellow-500" :
                              place.sunExposure === "Medium" ? "text-orange-400" : "text-blue-400"
                            }>
                              {place.sunExposure} sun
                            </span>
                          </div>
                          
                          <p className="text-gray-600 text-sm mt-2">{place.description}</p>
                          
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {place.activities.map((activity: string, i: number) => (
                              <Badge key={i} variant="outline" className="bg-gray-50 text-xs">
                                {activity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlacesList;
