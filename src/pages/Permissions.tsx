
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Bell, Camera } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Permissions = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleContinue = () => {
    setLoading(true);
    // In a real app, we would ask for actual permissions here
    setTimeout(() => {
      navigate("/survey");
    }, 800);
  };

  const permissions = [
    {
      name: "Location",
      description: "Used for weather information and local suggestions",
      icon: MapPin,
    },
    {
      name: "Notifications",
      description: "For activity reminders and outdoor suggestions",
      icon: Bell,
    },
    {
      name: "Camera & Photos",
      description: "To capture and save your outdoor moments",
      icon: Camera,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-green-50">
      <div className="w-full max-w-md">
        <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-8 pb-8">
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">We Need Your Permission</h1>
                <p className="text-gray-500">
                  To provide you with the best experience, we need access to:
                </p>
              </div>

              <div className="space-y-4">
                {permissions.map((permission, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <permission.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{permission.name}</h3>
                      <p className="text-sm text-gray-500">{permission.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="text-sm text-gray-500">
                <p>You can change these permissions later in your device settings.</p>
              </div>

              <div className="pt-2">
                <Button 
                  onClick={handleContinue} 
                  disabled={loading}
                  className="w-full"
                >
                  Allow & Continue
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Permissions;
