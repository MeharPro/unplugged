
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Sun, 
  Moon, 
  Volume2, 
  Bell, 
  Smartphone,
  Map,
  RefreshCw,
  Home,
  MapPin
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import useUserName from "@/hooks/use-user-name";

const Settings = () => {
  const navigate = useNavigate();
  const [userName] = useUserName();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [soundVolume, setSoundVolume] = useState([70]);
  const [locationPerms, setLocationPerms] = useState(true);
  const [autoWeather, setAutoWeather] = useState(true);
  const [homeAddress, setHomeAddress] = useState(
    localStorage.getItem("unplugged_home_address") || ""
  );
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleReset = () => {
    toast({
      title: "Settings Reset",
      description: "All settings have been restored to defaults",
    });
    
    setNotifications(true);
    setDarkMode(false);
    setSoundVolume([70]);
    setLocationPerms(true);
    setAutoWeather(true);
    setHomeAddress("");
    localStorage.removeItem("unplugged_home_address");
  };
  
  const handleSaveHomeAddress = () => {
    localStorage.setItem("unplugged_home_address", homeAddress);
    toast({
      title: "Home Address Saved",
      description: "Your home address has been updated successfully.",
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2"
            onClick={handleBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        
        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                    {userName.firstName ? userName.firstName.charAt(0) : "U"}
                  </div>
                  <div>
                    <p className="font-medium">
                      {userName.firstName ? `${userName.firstName} ${userName.lastName}` : "User"}
                    </p>
                    <p className="text-sm text-gray-500">Free Account</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate("/profile")}>
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Home Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4 mb-3">
                <div className="p-2 rounded-full bg-gray-100">
                  <Home className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Home Address</p>
                  <p className="text-sm text-gray-500">Set your home location to track outdoor time away from home</p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-3">
                <Input 
                  value={homeAddress}
                  onChange={(e) => setHomeAddress(e.target.value)}
                  placeholder="Enter your home address"
                  className="flex-1"
                />
                <Button onClick={handleSaveHomeAddress}>
                  <MapPin className="h-4 w-4 mr-2" />
                  Save Address
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-gray-100">
                    {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="font-medium">Dark Mode</p>
                    <p className="text-sm text-gray-500">Switch between light and dark themes</p>
                  </div>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Sound & Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-gray-100">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Notifications</p>
                    <p className="text-sm text-gray-500">Remind you to take outdoor breaks</p>
                  </div>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
              
              <Separator />
              
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-2 rounded-full bg-gray-100">
                    <Volume2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Sound Volume</p>
                    <p className="text-sm text-gray-500">Adjust volume for nature sounds</p>
                  </div>
                </div>
                
                <div className="px-2">
                  <Slider
                    value={soundVolume}
                    max={100}
                    step={1}
                    onValueChange={setSoundVolume}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">0%</span>
                    <span className="text-xs text-gray-500">{soundVolume[0]}%</span>
                    <span className="text-xs text-gray-500">100%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Location & Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-gray-100">
                    <Map className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Location Access</p>
                    <p className="text-sm text-gray-500">Allow app to access your location</p>
                  </div>
                </div>
                <Switch checked={locationPerms} onCheckedChange={setLocationPerms} />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-gray-100">
                    <RefreshCw className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Auto-update Weather</p>
                    <p className="text-sm text-gray-500">Update weather data automatically</p>
                  </div>
                </div>
                <Switch checked={autoWeather} onCheckedChange={setAutoWeather} />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleReset}
          >
            Reset to Defaults
          </Button>
          
          <Button 
            className="flex-1 bg-blue-500 hover:bg-blue-600"
            onClick={() => navigate("/dashboard")}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
