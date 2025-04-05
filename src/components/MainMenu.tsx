
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { 
  Settings, 
  Menu, 
  Music, 
  Home, 
  LogOut,
  Leaf, 
  Bookmark,
  User,
  Volume2,
  MapPin
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import useUserName from "@/hooks/use-user-name";
import { motion } from "framer-motion";

interface MainMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  weather: "sunny" | "cloudy" | "rainy" | "windy";
}

const MainMenu = ({ open, onOpenChange, weather }: MainMenuProps) => {
  const navigate = useNavigate();
  const [userName] = useUserName();
  const measurementSystem = localStorage.getItem("unplugged_measurement_system") || "metric";
  const homeAddress = localStorage.getItem("unplugged_home_address");
  
  const handleNavigation = (path: string) => {
    navigate(path);
    onOpenChange(false);
  };

  const handleSoundPlay = () => {
    // Integrated sound functionality
    const soundEvent = new CustomEvent('play-nature-sound', { detail: { weather } });
    window.dispatchEvent(soundEvent);
    onOpenChange(false);
  };
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[300px] sm:w-[360px] bg-gradient-to-b from-blue-50 to-green-50">
        <SheetHeader className="text-left">
          <SheetTitle className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-semibold text-xs mr-3">
              {userName.firstName ? userName.firstName.charAt(0) : "U"}
            </div>
            {userName.firstName ? `${userName.firstName}'s Unplugged` : 'Unplugged'}
          </SheetTitle>
          <SheetDescription>
            Reconnect with nature and the world around you
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 flex flex-col gap-4">
          <Button 
            variant="ghost" 
            className="justify-start"
            onClick={() => handleNavigation("/dashboard")}
          >
            <Home className="h-5 w-5 mr-3" />
            Dashboard
          </Button>
          
          <Button 
            variant="ghost" 
            className="justify-start"
            onClick={() => handleNavigation("/profile")}
          >
            <User className="h-5 w-5 mr-3" />
            My Profile
          </Button>
          
          <Separator />
          
          <h3 className="text-sm font-medium text-gray-500 px-3">Features</h3>
          
          <Button 
            variant="ghost" 
            className="justify-start bg-white/50 backdrop-blur-sm"
            onClick={handleSoundPlay}
          >
            <Volume2 className="h-5 w-5 mr-3 text-blue-500" />
            Nature Sounds
          </Button>
          
          <Button 
            variant="ghost" 
            className="justify-start bg-white/50 backdrop-blur-sm"
            onClick={() => handleNavigation("/place-map-view?name=Saved%20Places&type=collection")}
          >
            <Bookmark className="h-5 w-5 mr-3 text-amber-500" />
            Saved Places
          </Button>
          
          <Button 
            variant="ghost" 
            className="justify-start bg-white/50 backdrop-blur-sm"
          >
            <Leaf className="h-5 w-5 mr-3 text-green-500" />
            Touch Grass Goals
          </Button>
          
          {homeAddress && (
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 flex items-center">
              <MapPin className="h-5 w-5 mr-3 text-rose-500" />
              <div className="flex-1 text-sm">
                <div className="font-medium">Home Set</div>
                <div className="text-xs truncate text-gray-500">{homeAddress}</div>
              </div>
            </div>
          )}
          
          <Separator />
          
          <motion.div 
            className="bg-blue-50 rounded-lg p-3 mt-2 mb-2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="font-medium text-sm text-blue-700 mb-2">Your Preferences</h4>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Measurement system:</span>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-7 text-xs" 
                onClick={() => {
                  const newSystem = measurementSystem === "metric" ? "imperial" : "metric";
                  localStorage.setItem("unplugged_measurement_system", newSystem);
                  window.location.reload();
                }}
              >
                {measurementSystem === "metric" ? "Metric (km, °C)" : "Imperial (mi, °F)"}
              </Button>
            </div>
          </motion.div>
          
          <Button 
            variant="ghost" 
            className="justify-start"
            onClick={() => handleNavigation("/settings")}
          >
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </Button>
          
          <Button 
            variant="ghost" 
            className="justify-start text-gray-500"
            onClick={() => handleNavigation("/")}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MainMenu;
