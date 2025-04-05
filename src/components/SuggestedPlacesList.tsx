
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Trees, Compass, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SuggestedPlacesListProps {
  weather: "sunny" | "cloudy" | "rainy" | "windy";
}

const SuggestedPlacesList = ({ weather }: SuggestedPlacesListProps) => {
  const navigate = useNavigate();
  
  const placeTypes = [
    { id: "parks", name: "Local Parks", icon: <Trees className="h-5 w-5" />, color: "text-green-500", count: 8 },
    { id: "trails", name: "Hiking Trails", icon: <Compass className="h-5 w-5" />, color: "text-blue-500", count: 5 },
    { id: "cafes", name: "Outdoor Cafes", icon: <Activity className="h-5 w-5" />, color: "text-amber-500", count: 6 }
  ];
  
  const handlePlaceTypeClick = (typeId: string) => {
    navigate(`/places-list?type=${typeId}&weather=${weather}`);
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Suggested Places</h2>
        <Button variant="link" className="text-blue-600 p-0" onClick={() => navigate("/places-list")}>
          See All
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {placeTypes.map((placeType) => (
          <Card 
            key={placeType.id} 
            className="border-none shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handlePlaceTypeClick(placeType.id)}
          >
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className={`p-3 rounded-full bg-white mb-3 ${placeType.color}`}>
                {placeType.icon}
              </div>
              <h3 className="font-medium">{placeType.name}</h3>
              <Badge className="mt-2 bg-blue-100 text-blue-800 border-0">
                {placeType.count} nearby
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SuggestedPlacesList;
