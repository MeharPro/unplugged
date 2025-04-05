
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { motion } from "framer-motion";
import useUserName from "@/hooks/use-user-name";

const GenerateID = () => {
  const navigate = useNavigate();
  const [generating, setGenerating] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);
  const [cardGradient, setCardGradient] = useState("");
  const [userName] = useUserName();
  
  useEffect(() => {
    // Simulate ID generation
    const timer1 = setTimeout(() => {
      setGenerating(false);
      setShowExplanation(true);
    }, 3000);

    // Navigate to dashboard after showing explanation
    const timer2 = setTimeout(() => {
      navigate("/dashboard");
    }, 8000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [navigate]);

  // Generate random gradient colors for the ID card
  useEffect(() => {
    const colors = [
      "from-blue-400 via-teal-200 to-green-300",
      "from-purple-400 via-pink-200 to-red-300",
      "from-yellow-400 via-orange-200 to-red-300",
      "from-green-400 via-teal-200 to-blue-300",
      "from-indigo-500 via-purple-300 to-pink-400",
      "from-emerald-400 via-teal-300 to-cyan-400",
      "from-amber-400 via-yellow-300 to-orange-400",
      "from-rose-400 via-fuchsia-300 to-indigo-400"
    ];
    
    const randomGradient = colors[Math.floor(Math.random() * colors.length)];
    setCardGradient(randomGradient);
    
    // Save the gradient to localStorage
    localStorage.setItem("unplugged_card_gradient", randomGradient);
    
    // Also save measurement system preference if not already set
    if (!localStorage.getItem("unplugged_measurement_system")) {
      localStorage.setItem("unplugged_measurement_system", "metric");
    }
  }, []);
  
  const uniqueCode = Math.random().toString(36).substring(2, 8).toUpperCase();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-green-50">
      <div className="w-full max-w-md text-center">
        {generating ? (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Creating your unique Unplugged ID...
            </h1>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-8">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
            >
              <Card className="overflow-hidden shadow-xl">
                <AspectRatio ratio={16/9}>
                  <div className={`w-full h-full bg-gradient-to-br ${cardGradient} p-6 flex flex-col justify-between`}>
                    <div className="flex justify-between items-start">
                      <div className="text-white text-sm font-medium flex items-center">
                        <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                            <path d="M2 10s3-3 3-8"></path>
                            <path d="M8 12s3-2 3-6"></path>
                            <path d="M14 14s3-1 3-4"></path>
                            <path d="M20 16s3 0 3-2"></path>
                          </svg>
                        </div>
                        Unplugged
                      </div>
                      <div className="text-white/80 text-xs bg-white/20 backdrop-blur-sm py-1 px-2 rounded-full">
                        #{uniqueCode}
                      </div>
                    </div>
                    <div className="flex flex-col items-start">
                      <h3 className="text-white font-bold text-xl">
                        {userName.firstName} {userName.lastName}
                      </h3>
                      <p className="text-white/80 text-sm flex items-center">
                        <span className="h-2 w-2 bg-green-300 rounded-full mr-2 animate-pulse"></span>
                        Just beginning your journey
                      </p>
                    </div>
                  </div>
                </AspectRatio>
              </Card>
            </motion.div>

            {showExplanation && (
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <h2 className="text-xl font-bold text-gray-900">
                  This is your Unplugged Card!
                </h2>
                <p className="text-gray-600">
                  It represents your journey with Unplugged. The more you connect with nature, the more your card will evolve with unique patterns and colors!
                </p>
                <Button 
                  onClick={() => navigate("/dashboard")}
                  className="px-8 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-md"
                >
                  Continue to App
                </Button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateID;
