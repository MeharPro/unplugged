
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Map as MapIcon, Navigation, Trees, Mountain, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface GreenSpace {
  id: string;
  name: string;
  type: string;
  distance: string;
  amenities: string[];
}

interface LocalGreenSpacesMapProps {
  weather: string;
}

const LocalGreenSpacesMap = ({ weather }: LocalGreenSpacesMapProps) => {
  const navigate = useNavigate();
  const [spaces, setSpaces] = useState<GreenSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [showList, setShowList] = useState(true);
  
  // Simulated data fetch
  useEffect(() => {
    setTimeout(() => {
      setSpaces([
        {
          id: "park1",
          name: "Cedar Grove Park",
          type: "Local Park",
          distance: "0.8 miles",
          amenities: ["Walking Paths", "Picnic Area", "Playground"]
        },
        {
          id: "trail1",
          name: "Riverside Trail",
          type: "Nature Trail",
          distance: "1.2 miles",
          amenities: ["Hiking", "Bird Watching", "Scenic Views"]
        },
        {
          id: "garden1",
          name: "Botanical Gardens",
          type: "Public Garden",
          distance: "2.5 miles",
          amenities: ["Plant Collection", "Water Features", "Educational Tours"]
        },
        {
          id: "preserve1",
          name: "Wildlife Preserve",
          type: "Nature Preserve",
          distance: "3.7 miles",
          amenities: ["Wildlife Viewing", "Photography", "Guided Tours"]
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);
  
  const getIconForType = (type: string) => {
    if (type.toLowerCase().includes("park")) return <Trees className="h-4 w-4 text-green-600" />;
    if (type.toLowerCase().includes("trail")) return <Navigation className="h-4 w-4 text-blue-600" />;
    if (type.toLowerCase().includes("mountain") || type.toLowerCase().includes("preserve")) 
      return <Mountain className="h-4 w-4 text-amber-600" />;
    return <MapPin className="h-4 w-4 text-purple-600" />;
  };
  
  const handleSpaceClick = (space: GreenSpace) => {
    navigate(`/place-map-view?name=${encodeURIComponent(space.name)}&type=${encodeURIComponent(space.type.toLowerCase())}`);
  };
  
  const toggleView = () => {
    setShowList(!showList);
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
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <MapPin className="h-5 w-5 text-green-500 mr-2" />
          Local Green Spaces
        </h2>
        <Button 
          variant="outline"
          size="sm"
          onClick={toggleView}
          className="flex items-center gap-1"
        >
          {showList ? <MapIcon className="h-4 w-4 mr-1" /> : <Trees className="h-4 w-4 mr-1" />}
          {showList ? "Map View" : "List View"}
        </Button>
      </div>
      
      {showList ? (
        <motion.div 
          className="space-y-2"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ) : (
            spaces.map((space) => (
              <motion.div 
                key={space.id}
                variants={item}
                onClick={() => handleSpaceClick(space)}
                className="cursor-pointer"
              >
                <Card className="p-3 hover:shadow-md transition-shadow border-gray-100">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <div className="p-2 rounded-full bg-green-50 mr-3">
                        {getIconForType(space.type)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{space.name}</h3>
                        <div className="flex items-center text-gray-500 text-sm">
                          <span>{space.type}</span>
                          <span className="mx-1">•</span>
                          <span>{space.distance}</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1 ml-10">
                    {space.amenities.map((amenity, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-gray-50">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>
      ) : (
        <div className="relative h-64 rounded-xl overflow-hidden border border-gray-200">
          <div className="absolute inset-0 bg-green-50">
            {/* Simulated Map */}
            <div className="h-full w-full flex items-center justify-center flex-col">
              <MapIcon className="h-10 w-10 text-green-200 mb-2" />
              <p className="text-gray-500">Interactive map would display here</p>
              <p className="text-sm text-gray-400">{spaces.length} green spaces nearby</p>
            </div>
            
            {/* Map pins */}
            {!loading && spaces.map((space, index) => (
              <motion.div
                key={space.id}
                className="absolute cursor-pointer"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `${20 + Math.random() * 60}%`,
                }}
                onClick={() => handleSpaceClick(space)}
              >
                <div className="relative">
                  <div className="p-1 rounded-full bg-white shadow-md">
                    {getIconForType(space.type)}
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-gray-400"></div>
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
                <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs whitespace-nowrap shadow-sm">
                  {space.name}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      
      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => navigate("/places-list")}
      >
        View All Green Spaces
      </Button>
    </div>
  );
};

export default LocalGreenSpacesMap;
