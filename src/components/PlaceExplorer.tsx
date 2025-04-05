
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MapPin, TreePine, Mountain, UtensilsCrossed, 
  Compass, Map, Route, Heart, Tent, List, ChevronDown,
  Search, RefreshCw, Sun, Leaf
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

type PlaceType = "park" | "trail" | "cafe" | "viewpoint" | "garden" | "beach";

interface Place {
  id: string;
  name: string;
  type: PlaceType;
  distance: string;
  numericDistance: number;
  address: string;
  description: string;
  sunExposure: "High" | "Medium" | "Low";
  hours: string;
  activities: string[];
  coordinates: [number, number]; // [longitude, latitude]
  image?: string;
}

const PlaceExplorer = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [selectedPlaceType, setSelectedPlaceType] = useState<PlaceType>("park");
  const [viewMode, setViewMode] = useState<"map" | "list">("list");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [touchGrassMode, setTouchGrassMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [maxDistance, setMaxDistance] = useState(5);
  const [animateRefresh, setAnimateRefresh] = useState(false);

  // Simulate data fetch
  useEffect(() => {
    const fetchPlaces = () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    };
    
    fetchPlaces();
  }, [selectedPlaceType]);

  const playSound = (sound: string) => {
    // This would actually play a sound if we had sound files
    console.log(`Would play sound: ${sound}`);
    // In a real implementation we would use the Web Audio API or HTML5 audio
  };

  const handleRefresh = () => {
    setAnimateRefresh(true);
    setIsLoading(true);
    
    // Simulate data refresh
    setTimeout(() => {
      setIsLoading(false);
      setAnimateRefresh(false);
      
      toast({
        title: "Places Refreshed",
        description: "Found new outdoor spaces nearby",
      });
      
      playSound("refresh_sound");
    }, 1000);
  };

  const handleTouchGrass = (place?: Place) => {
    if (place) {
      const selectedPlace = place.name;
      toast({
        title: `Touch Grass at ${selectedPlace}`,
        description: `Added ${selectedPlace} to your outdoor goals! Get some fresh air and vitamin D.`,
      });
      
      setTouchGrassMode(false);
      playSound("success_chime");
      return;
    }
    
    setTouchGrassMode(!touchGrassMode);
    
    if (!touchGrassMode) {
      toast({
        title: "Touch Grass Mode Activated",
        description: "Select a location where you'd like to connect with nature today!",
      });
      
      playSound("activate_sound");
    } else {
      playSound("deactivate_sound");
    }
  };

  const getPlaceIcon = (type: PlaceType, size = 5) => {
    switch (type) {
      case "park":
        return <TreePine className={`h-${size} w-${size} animate-bounce-subtle`} />;
      case "trail":
        return <Route className={`h-${size} w-${size}`} />;
      case "cafe":
        return <UtensilsCrossed className={`h-${size} w-${size}`} />;
      case "viewpoint":
        return <Mountain className={`h-${size} w-${size}`} />;
      case "garden":
        return <TreePine className={`h-${size} w-${size} animate-sway`} />;
      case "beach":
        return <Tent className={`h-${size} w-${size}`} />;
      default:
        return <MapPin className={`h-${size} w-${size}`} />;
    }
  };
  
  const getPlaceColor = (type: PlaceType) => {
    switch (type) {
      case "park":
        return "bg-green-100 text-green-600";
      case "trail":
        return "bg-amber-100 text-amber-600";
      case "cafe":
        return "bg-orange-100 text-orange-600";
      case "viewpoint":
        return "bg-blue-100 text-blue-600";
      case "garden":
        return "bg-emerald-100 text-emerald-600";
      case "beach":
        return "bg-cyan-100 text-cyan-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };
  
  const placeCategories: Array<{type: PlaceType, name: string}> = [
    { type: "park", name: "Parks" },
    { type: "trail", name: "Trails" },
    { type: "cafe", name: "Outdoor Cafés" },
    { type: "viewpoint", name: "Viewpoints" },
    { type: "garden", name: "Gardens" },
    { type: "beach", name: "Beaches" }
  ];
  
  // Generate places data
  const generatePlacesData = (): Record<PlaceType, Place[]> => {
    return {
      park: [
        {
          id: "park-1",
          name: "Central Park",
          type: "park",
          distance: "0.8 mi",
          numericDistance: 0.8,
          address: "100 Central Park Way",
          description: "A beautiful urban park with walking paths, open meadows, and recreational facilities.",
          sunExposure: "High",
          hours: "5:00 AM - 9:00 PM",
          activities: ["Walking", "Picnics", "Sports"],
          coordinates: [-122.4194, 37.7749],
          image: "/images/central-park.jpg"
        },
        {
          id: "park-2",
          name: "Green Valley Gardens",
          type: "park",
          distance: "1.5 mi",
          numericDistance: 1.5,
          address: "200 Green Valley Rd",
          description: "Peaceful park with botanical gardens and quiet reading areas.",
          sunExposure: "Medium",
          hours: "6:00 AM - 8:00 PM",
          activities: ["Reading", "Garden tours", "Relaxation"],
          coordinates: [-122.4294, 37.7849]
        },
        {
          id: "park-3",
          name: "Riverside Park",
          type: "park",
          distance: "2.1 mi",
          numericDistance: 2.1,
          address: "45 Riverside Ave",
          description: "Park along the river with beautiful water views and picnic areas.",
          sunExposure: "Medium",
          hours: "5:30 AM - 10:00 PM",
          activities: ["Fishing", "Boating", "Picnics"],
          coordinates: [-122.4094, 37.7649]
        }
      ],
      trail: [
        {
          id: "trail-1",
          name: "Mountain Ridge Trail",
          type: "trail",
          distance: "3.2 mi",
          numericDistance: 3.2,
          address: "Mountain Ridge Trailhead",
          description: "Moderate hiking trail with panoramic views of the valley.",
          sunExposure: "High",
          hours: "Sunrise to Sunset",
          activities: ["Hiking", "Photography", "Birdwatching"],
          coordinates: [-122.4894, 37.8049]
        },
        {
          id: "trail-2",
          name: "Forest Loop",
          type: "trail",
          distance: "1.7 mi",
          numericDistance: 1.7,
          address: "Forest Park Entrance",
          description: "Easy walking trail through shaded forest areas.",
          sunExposure: "Low",
          hours: "6:00 AM - 8:00 PM",
          activities: ["Walking", "Running", "Nature study"],
          coordinates: [-122.4694, 37.7949]
        }
      ],
      cafe: [
        {
          id: "cafe-1",
          name: "Sunny Side Café",
          type: "cafe",
          distance: "0.5 mi",
          numericDistance: 0.5,
          address: "123 Sunny Ave",
          description: "Café with outdoor seating and great coffee.",
          sunExposure: "Medium",
          hours: "7:00 AM - 6:00 PM",
          activities: ["Coffee", "Work remotely", "Socializing"],
          coordinates: [-122.4174, 37.7789]
        }
      ],
      viewpoint: [
        {
          id: "view-1",
          name: "Hilltop Vista",
          type: "viewpoint",
          distance: "4.3 mi",
          numericDistance: 4.3,
          address: "Hilltop Drive",
          description: "Panoramic viewpoint overlooking the city and bay.",
          sunExposure: "High",
          hours: "24 hours",
          activities: ["Photography", "Stargazing", "Picnics"],
          coordinates: [-122.4494, 37.7849]
        }
      ],
      garden: [
        {
          id: "garden-1",
          name: "Botanical Gardens",
          type: "garden",
          distance: "2.8 mi",
          numericDistance: 2.8,
          address: "300 Garden Way",
          description: "Extensive collection of plants from around the world.",
          sunExposure: "Medium",
          hours: "9:00 AM - 5:00 PM",
          activities: ["Tours", "Photography", "Learning"],
          coordinates: [-122.4694, 37.7649]
        }
      ],
      beach: [
        {
          id: "beach-1",
          name: "Sandy Shore Beach",
          type: "beach",
          distance: "5.6 mi",
          numericDistance: 5.6,
          address: "Beach Access Road",
          description: "Sandy beach with swimming areas and excellent sunset views.",
          sunExposure: "High",
          hours: "6:00 AM - 10:00 PM",
          activities: ["Swimming", "Sunbathing", "Beach volleyball"],
          coordinates: [-122.5094, 37.7549]
        }
      ]
    };
  };
  
  const placesData = generatePlacesData();
  
  const getFilteredPlaces = () => {
    if (!placesData[selectedPlaceType]) return [];
    
    let filtered = placesData[selectedPlaceType];
    
    // Filter by distance
    filtered = filtered.filter(place => place.numericDistance <= maxDistance);
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(place => 
        place.name.toLowerCase().includes(query) ||
        place.description.toLowerCase().includes(query) ||
        place.activities.some(activity => activity.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  };
  
  const places = getFilteredPlaces();
  
  const renderMap = () => {
    // This would be replaced with an actual map component
    return (
      <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl h-64 md:h-96 relative overflow-hidden animate-fade-in">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Map className="h-12 w-12 text-blue-400/50 mb-2" />
          <p className="text-sm text-gray-500">Map view would show {places.length} {selectedPlaceType}s nearby</p>
          <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
            {places.map((place, index) => (
              <Badge 
                key={index} 
                className={`${getPlaceColor(place.type)} animate-fade-in`}
                style={{animationDelay: `${0.1 * index}s`}}
              >
                {place.name} ({place.distance})
              </Badge>
            ))}
          </div>
        </div>
        
        {touchGrassMode && (
          <div className="absolute bottom-4 left-4 right-4 bg-green-100 border border-green-300 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Leaf className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-green-800 text-sm font-medium">Touch Grass Mode</span>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-7 text-green-700 hover:text-green-900 hover:bg-green-200 p-1"
                onClick={() => setTouchGrassMode(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  const renderList = () => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border border-gray-100 animate-pulse-slow">
              <CardContent className="p-4">
                <div className="flex items-start">
                  <div className="p-2 rounded-full bg-gray-100 mr-3 w-10 h-10"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-100 rounded w-full"></div>
                    <div className="flex space-x-2">
                      <div className="h-6 w-14 bg-gray-100 rounded-full"></div>
                      <div className="h-6 w-14 bg-gray-100 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }
    
    if (places.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500 animate-fade-in">
          <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          {searchQuery ? (
            <div>
              <p className="mb-1">No {selectedPlaceType} locations found for "{searchQuery}"</p>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-blue-500" 
                onClick={() => {
                  setSearchQuery("");
                  playSound("clear_sound");
                }}
              >
                Clear search
              </Button>
            </div>
          ) : (
            <p>No {selectedPlaceType} locations found in this area.</p>
          )}
          <p className="text-sm mt-2">Try adjusting your distance or search criteria.</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-3 animate-fade-in">
        {places.map((place, index) => (
          <Card 
            key={place.id}
            className="border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300 animate-scale-in cursor-pointer group"
            style={{animationDelay: `${0.1 * index}s`}}
            onClick={() => {
              setSelectedPlace(place);
              playSound("soft_click");
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-start">
                <div className={`p-2 rounded-full ${getPlaceColor(place.type)} mr-3 mt-1`}>
                  {getPlaceIcon(place.type, 4)}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium group-hover:text-blue-600 transition-colors">{place.name}</h3>
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{place.distance} away</span>
                    <span className="mx-1">•</span>
                    <span className={place.sunExposure === "High" ? "text-yellow-500" : place.sunExposure === "Medium" ? "text-orange-400" : "text-blue-400"}>
                      {place.sunExposure} sun
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">{place.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {place.activities.slice(0, 2).map((activity, i) => (
                      <Badge key={i} variant="outline" className="bg-gray-50 text-xs">
                        {activity}
                      </Badge>
                    ))}
                    {place.activities.length > 2 && (
                      <Badge variant="outline" className="bg-gray-50 text-xs">
                        +{place.activities.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
                
                {touchGrassMode && (
                  <Button
                    size="sm"
                    className="ml-2 bg-green-500 hover:bg-green-600 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTouchGrass(place);
                    }}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderPlaceDetails = () => {
    if (!selectedPlace) return null;
    
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-auto animate-fade-in">
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="container mx-auto px-4">
            <div className="py-4 flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSelectedPlace(null);
                  playSound("back_click");
                }}
              >
                <ChevronDown className="h-6 w-6" />
              </Button>
              <h2 className="text-xl font-semibold ml-2">{selectedPlace.name}</h2>
              <div className="ml-auto">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                  onClick={() => {
                    handleTouchGrass(selectedPlace);
                  }}
                >
                  <Heart className="h-4 w-4 mr-1" /> Touch Grass
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 pb-24">
          <div className="h-48 bg-gray-100 rounded-xl mb-4 flex items-center justify-center">
            <div className="relative">
              <Map className="h-12 w-12 text-gray-400" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{selectedPlace.address}</span>
                  </div>
                  <div className="flex">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{selectedPlace.hours}</span>
                  </div>
                  <div className="flex">
                    <Sun className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Sun exposure: {selectedPlace.sunExposure}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">Activities</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPlace.activities.map((activity, i) => (
                    <Badge key={i} className="bg-blue-50 text-blue-600 hover:bg-blue-100">
                      {activity}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-4">
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-gray-700">{selectedPlace.description}</p>
            </CardContent>
          </Card>
          
          <Card className="mt-4 bg-green-50 border-green-100">
            <CardContent className="p-4">
              <div className="flex items-start">
                <Leaf className="h-5 w-5 text-green-600 mr-3 mt-1 animate-bounce-subtle" />
                <div>
                  <h3 className="font-medium text-green-800">Nature Connection</h3>
                  <p className="text-sm text-green-700 mt-1">
                    {selectedPlace.sunExposure === "High" 
                      ? `This location offers excellent sun exposure, perfect for vitamin D absorption (15-20 minutes recommended).` 
                      : selectedPlace.sunExposure === "Medium"
                      ? `This location has moderate sun exposure. Spend 30+ minutes here for vitamin D benefits.`
                      : `This location has limited sun exposure, but still offers excellent nature connection benefits.`}
                  </p>
                  
                  <Button
                    size="sm"
                    className="mt-3 bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => handleTouchGrass(selectedPlace)}
                  >
                    <Heart className="h-4 w-4 mr-1" /> Set as Touch Grass Location
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Places to Go</h2>
        <Button 
          onClick={() => handleTouchGrass()}
          className={`flex items-center space-x-1.5 px-3 py-1 rounded-full ${
            touchGrassMode 
              ? "bg-green-500 hover:bg-green-600 text-white" 
              : "bg-green-100 hover:bg-green-200 text-green-600"
          } transition-colors`}
        >
          <Leaf className="h-4 w-4 animate-bounce-subtle" />
          <span>{touchGrassMode ? "Selecting..." : "Touch Grass"}</span>
        </Button>
      </div>
      
      {touchGrassMode && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 animate-fade-in">
          <div className="flex items-start">
            <Sun className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
            <div>
              <h3 className="font-medium text-green-800">Touch Grass Mode</h3>
              <p className="text-sm text-green-700">Select a location to set your outdoor connection goal</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-gradient-to-tr from-blue-50 via-purple-50 to-green-50 rounded-xl p-4 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-gray-800">Explore Outdoor Spaces</h3>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="ghost"
              className={`px-2 text-gray-500 ${animateRefresh ? 'animate-spin' : ''}`}
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <div className="flex bg-white rounded-lg p-0.5 shadow-sm">
              <Button
                size="sm"
                variant={viewMode === "list" ? "default" : "ghost"}
                className={`px-3 ${viewMode === "list" ? "" : "text-gray-500"}`}
                onClick={() => {
                  setViewMode("list");
                  playSound("switch_sound");
                }}
              >
                <List className="h-4 w-4 mr-1" />
                List
              </Button>
              <Button
                size="sm"
                variant={viewMode === "map" ? "default" : "ghost"}
                className={`px-3 ${viewMode === "map" ? "" : "text-gray-500"}`}
                onClick={() => {
                  setViewMode("map");
                  playSound("switch_sound");
                }}
              >
                <Map className="h-4 w-4 mr-1" />
                Map
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search parks, trails, activities..."
              className="pl-10 bg-white/70 backdrop-blur-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-60">
            <span className="text-sm text-gray-500 whitespace-nowrap">Max {maxDistance} mi</span>
            <Slider
              value={[maxDistance]}
              min={0.5}
              max={10}
              step={0.5}
              onValueChange={(val) => {
                setMaxDistance(val[0]);
                playSound("slider_tick");
              }}
              disabled={isLoading}
              className="flex-1"
            />
          </div>
        </div>
        
        <Tabs 
          defaultValue={selectedPlaceType} 
          onValueChange={(value) => {
            setSelectedPlaceType(value as PlaceType);
            playSound("tab_switch");
          }}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-3 h-auto bg-white/60 p-1">
            {placeCategories.map(category => (
              <TabsTrigger
                key={category.type}
                value={category.type}
                className="py-1.5 text-sm data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                disabled={isLoading}
              >
                <div className="flex items-center">
                  {getPlaceIcon(category.type, 3)}
                  <span className={isMobile ? "sr-only" : "ml-1"}>{category.name}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {placeCategories.map(category => (
            <TabsContent key={category.type} value={category.type} className="mt-4">
              {viewMode === "map" ? renderMap() : renderList()}
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      {selectedPlace && renderPlaceDetails()}
    </div>
  );
};

function Clock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export default PlaceExplorer;
