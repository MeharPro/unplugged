
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, MapPin, Clock, CalendarDays, Activity,
  Sun, ExternalLink, Check, Compass
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";

interface PlaceDetailsProps {
  place: {
    name: string;
    type: string;
    distance: string;
    sunExposure: string;
    description: string;
    activities: string[];
    hours: string;
    address: string;
  };
  onBack: () => void;
  weather: "sunny" | "cloudy" | "rainy" | "windy";
}

const PlaceDetails = ({ place, onBack, weather }: PlaceDetailsProps) => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  
  const getWeatherCompatibility = () => {
    if (weather === "sunny" && (place.sunExposure === "High" || place.sunExposure === "Medium")) {
      return { compatible: true, message: "Perfect for today's sunny weather!" };
    } else if (weather === "cloudy" && place.sunExposure === "Medium") {
      return { compatible: true, message: "Good choice for cloudy weather" };
    } else if (weather === "rainy" && place.sunExposure === "Low") {
      return { compatible: true, message: "Suitable even in rainy conditions" };
    } else if (weather === "windy" && place.activities.includes("Walking")) {
      return { compatible: true, message: "Still accessible in windy conditions" };
    } else {
      return { 
        compatible: false, 
        message: weather === "rainy" ? 
          "May be challenging in rainy weather" : 
          "Weather conditions may not be ideal" 
      };
    }
  };

  const compatibility = getWeatherCompatibility();
  
  const handleTouchGrass = () => {
    toast({
      title: `Touch Grass at ${place.name}`,
      description: "Added to your outdoor goals. We'll remind you to visit soon!",
    });
    
    setSaved(true);
    
    // In a real app, we would set a reminder or save to user preferences
    setTimeout(() => {
      onBack();
    }, 1500);
  };
  
  const getWeatherAdvice = () => {
    switch (weather) {
      case "sunny":
        return "Don't forget sunscreen! Perfect day for vitamin D intake.";
      case "cloudy":
        return "Comfortable temperatures for outdoor activities.";
      case "rainy":
        return "Bring waterproof gear and check for covered areas.";
      case "windy":
        return "Dress in layers and be cautious of flying debris.";
      default:
        return "Check weather before heading out.";
    }
  };
  
  const handleViewMap = () => {
    navigate(`/place-map-view?name=${encodeURIComponent(place.name)}&type=${encodeURIComponent(place.type)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      <div className="container mx-auto px-4 pb-24">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-blue-50/80 backdrop-blur-lg py-4 px-4 flex items-center">
          <Button 
            variant="ghost" 
            size="icon"
            className="mr-3 hover:bg-white/20"
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">{place.name}</h1>
            <p className="text-sm text-gray-600">{place.type}</p>
          </div>
        </header>
        
        {/* Place Hero */}
        <div className="mt-4 relative">
          <div className="h-40 bg-gradient-to-r from-blue-200 to-green-200 rounded-xl flex items-center justify-center">
            {place.type === "trail" && <Compass className="h-12 w-12 text-blue-500" />}
            {place.type === "cafe" && <Activity className="h-12 w-12 text-amber-500" />}
            {place.type === "park" && <Sun className="h-12 w-12 text-green-500" />}
          </div>
          
          <Card className="border-none bg-white shadow-md -mt-10 mx-4 relative z-10">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{place.distance} away</span>
                  </div>
                  <h2 className="text-lg font-bold">{place.name}</h2>
                </div>
                <Badge className={compatibility.compatible ? "bg-green-500" : "bg-amber-500"}>
                  {place.sunExposure} Sun Exposure
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Weather Compatibility */}
        <Card className="border-none bg-white shadow-md mt-4">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className={`p-2 rounded-full ${compatibility.compatible ? 'bg-green-100' : 'bg-amber-100'} mr-3`}>
                {compatibility.compatible ? 
                  <Check className="h-5 w-5 text-green-500" /> : 
                  <Sun className="h-5 w-5 text-amber-500" />
                }
              </div>
              <div>
                <h3 className="font-medium">{compatibility.compatible ? 'Weather Compatible' : 'Weather Notice'}</h3>
                <p className="text-sm text-gray-600">{compatibility.message}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Details */}
        <div className="mt-4 space-y-4">
          <Card className="border-none bg-white shadow-md">
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">About</h3>
              <p className="text-sm text-gray-600">{place.description}</p>
              
              <Separator className="my-3" />
              
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">Hours: {place.hours}</span>
              </div>
              
              <div className="flex items-center mt-2">
                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">{place.address}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-none bg-white shadow-md">
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">Activities</h3>
              <div className="flex flex-wrap gap-2">
                {place.activities.map((activity, index) => (
                  <Badge key={index} variant="outline">
                    {activity}
                  </Badge>
                ))}
              </div>
              
              <Separator className="my-3" />
              
              <h3 className="font-medium mb-2">Weather Tip</h3>
              <p className="text-sm text-gray-600">{getWeatherAdvice()}</p>
            </CardContent>
          </Card>
          
          <Button 
            className={`w-full ${saved ? 'bg-green-600' : 'bg-green-500 hover:bg-green-600'}`}
            onClick={handleTouchGrass}
            disabled={saved}
          >
            {saved ? "Added to Goals!" : "Touch Grass Here"}
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleViewMap}
          >
            View on Map
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full"
            onClick={onBack}
          >
            Back to Suggested Places
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetails;
