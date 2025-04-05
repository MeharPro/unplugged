
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleStart = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/permissions");
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-green-50">
      <div className="w-full max-w-md">
        <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-8 pb-8">
            <div className="space-y-6 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome to Unplugged</h1>
                <p className="text-gray-500">
                  Reconnect with the outdoors, rediscover nature, and find balance in your daily life.
                </p>
              </div>
              
              <div className="relative h-40 w-full overflow-hidden rounded-lg bg-gradient-to-br from-green-300 via-blue-200 to-purple-200">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-white/70">
                    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
                    <path d="M22 19h-2"/>
                    <path d="M13 5.5V7"/>
                    <path d="M8 8l1.5 1.5"/>
                    <path d="M5 13h1.5"/>
                    <rect width="8" height="5" x="7" y="19" rx="1"/>
                  </svg>
                </div>
              </div>
              
              <Button 
                onClick={handleStart} 
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Welcome;
