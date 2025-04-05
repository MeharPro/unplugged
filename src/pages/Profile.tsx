
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Share2, Edit2, MapPin, Home } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import useUserName from "@/hooks/use-user-name";

const Profile = () => {
  const navigate = useNavigate();
  const [userName, updateUserName] = useUserName();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editName, setEditName] = useState({...userName});
  const [cardGradient, setCardGradient] = useState("from-blue-400 via-purple-300 to-green-300");
  const [homeAddress, setHomeAddress] = useState(localStorage.getItem("unplugged_home_address") || "");
  
  const [stats] = useState({
    sunnyDays: 12,
    rainyDays: 3,
    cloudyDays: 5,
    windyDays: 2,
    totalHours: 34,
    streak: 4
  });
  
  useEffect(() => {
    // Load card gradient from localStorage
    const savedGradient = localStorage.getItem("unplugged_card_gradient");
    if (savedGradient) {
      setCardGradient(savedGradient);
    }
  }, []);

  // Card style from user's saved preferences or behavior
  const cardStyle = {
    gradient: cardGradient,
    titleColor: "text-white",
    subtitleColor: "text-white/80",
    pattern: "radial-gradient(circle, rgba(255,255,255,0.2) 2px, transparent 2px) 0 0/20px 20px"
  };

  const handleShareCard = () => {
    // Simulate sharing functionality
    toast({
      title: "Card Shared!",
      description: "Your Unplugged ID card has been saved to your photos for sharing.",
    });
  };

  const handleSaveName = () => {
    if (editName.firstName.trim() === '' || editName.lastName.trim() === '') {
      toast({
        title: "Name Required",
        description: "Both first and last name are required.",
        variant: "destructive"
      });
      return;
    }
    
    updateUserName(editName.firstName, editName.lastName);
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your name has been updated successfully.",
    });
  };
  
  const handleSaveAddress = () => {
    localStorage.setItem("unplugged_home_address", homeAddress);
    setIsEditingAddress(false);
    toast({
      title: "Home Address Saved",
      description: "Your home address has been saved successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      <header className="p-4 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/dashboard")}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">
          {userName.firstName ? `${userName.firstName}'s Profile` : 'Your Profile'}
        </h1>
      </header>
      
      <div className="container mx-auto px-4 py-6 space-y-8">
        <div className="max-w-md mx-auto">
          {isEditing ? (
            <Card className="p-4 mb-6">
              <h2 className="text-lg font-medium mb-4">Edit Profile</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="editFirstName" className="block text-sm font-medium mb-1">First Name</label>
                  <Input
                    id="editFirstName"
                    value={editName.firstName}
                    onChange={(e) => setEditName({...editName, firstName: e.target.value})}
                    placeholder="Enter your first name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="editLastName" className="block text-sm font-medium mb-1">Last Name</label>
                  <Input
                    id="editLastName"
                    value={editName.lastName}
                    onChange={(e) => setEditName({...editName, lastName: e.target.value})}
                    placeholder="Enter your last name"
                    required
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleSaveName}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            userName.firstName && (
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">
                  {userName.firstName} {userName.lastName}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
            )
          )}
          
          {/* Home Address Section */}
          {isEditingAddress ? (
            <Card className="p-4 mb-6">
              <h2 className="text-lg font-medium mb-4">Set Home Address</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="homeAddress" className="block text-sm font-medium mb-1">Home Address</label>
                  <Input
                    id="homeAddress"
                    value={homeAddress}
                    onChange={(e) => setHomeAddress(e.target.value)}
                    placeholder="Enter your home address"
                    required
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsEditingAddress(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleSaveAddress}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-4 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-medium">Home Address</h2>
                  <p className="text-sm text-gray-500">
                    {homeAddress || "No home address set"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditingAddress(true)}
                >
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          )}
          
          <h2 className="text-lg font-medium mb-3">Your Unplugged ID Card</h2>
          
          <Card className="overflow-hidden shadow-xl mb-4">
            <AspectRatio ratio={16/9}>
              <div 
                className={`w-full h-full bg-gradient-to-br ${cardStyle.gradient} p-6 flex flex-col justify-between`}
                style={{backgroundImage: cardStyle.pattern}}
              >
                <div className="flex justify-between items-start">
                  <div className={`${cardStyle.titleColor} text-sm font-medium flex items-center`}>
                    <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mr-2">
                      <Home className="h-4 w-4 text-white" />
                    </div>
                    Unplugged
                  </div>
                  <div className={`${cardStyle.subtitleColor} text-xs`}>
                    #A7B3FD
                  </div>
                </div>
                <div className="flex flex-col items-start">
                  <h3 className={`${cardStyle.titleColor} font-bold text-xl`}>
                    {userName.firstName ? `${userName.firstName} ${userName.lastName}` : 'Nature Explorer'}
                  </h3>
                  <p className={`${cardStyle.subtitleColor} text-sm flex items-center`}>
                    <span className="h-2 w-2 bg-green-300 rounded-full mr-2 animate-pulse"></span>
                    Outdoor enthusiast
                  </p>
                </div>
              </div>
            </AspectRatio>
          </Card>
          
          <Button 
            onClick={handleShareCard}
            className="w-full"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Your Card
          </Button>
          
          <Separator className="my-8" />
          
          <div className="space-y-6">
            <h2 className="text-lg font-medium">Your Outdoor Stats</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-500">{stats.totalHours}</div>
                <div className="text-gray-500 text-sm">Hours Outside</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-500">{stats.streak}</div>
                <div className="text-gray-500 text-sm">Day Streak</div>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-medium mb-3">Weather Experiences</h3>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                  {stats.sunnyDays} Sunny Days
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                  {stats.rainyDays} Rainy Days
                </Badge>
                <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                  {stats.cloudyDays} Cloudy Days
                </Badge>
                <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-200">
                  {stats.windyDays} Windy Days
                </Badge>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-medium mb-2">Card Evolution</h3>
              <p className="text-sm text-gray-600">
                Your card evolves based on your outdoor activities. More diverse weather experiences and consistent outdoor time create unique patterns and colors!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
