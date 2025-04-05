
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Leaf, Sun, CloudRain, Cloud, Wind, ArrowRight, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

interface ActivitySuggestionsProps {
  weather: "sunny" | "cloudy" | "rainy" | "windy";
}

const OutdoorActivitySuggestions = ({ weather }: ActivitySuggestionsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get activities based on current weather
  const getActivities = () => {
    switch (weather) {
      case "sunny":
        return {
          title: "Perfect for Sun Lovers",
          activities: [
            "Have a picnic in the park",
            "Enjoy a hike on local trails",
            "Go for a bike ride along the waterfront",
            "Try outdoor yoga or meditation",
            "Start a small garden project"
          ],
          icon: <Sun className="h-5 w-5 text-yellow-500" />,
          color: "bg-amber-50 border-amber-100"
        };
      case "cloudy":
        return {
          title: "Great for Cloudy Days",
          activities: [
            "Take a refreshing walk in the woods",
            "Explore a local nature preserve",
            "Bird watching (better visibility without glare)",
            "Photograph nature without harsh shadows",
            "Collect interesting leaves or stones"
          ],
          icon: <Cloud className="h-5 w-5 text-blue-400" />,
          color: "bg-blue-50 border-blue-100"
        };
      case "rainy":
        return {
          title: "Rain-Friendly Nature Options",
          activities: [
            "Listen to rain sounds from a covered porch",
            "Visit an indoor botanical garden",
            "Observe how plants and animals react to rain",
            "Watch for rainbows when the sun peeks through",
            "Set up a rain collection system for plants"
          ],
          icon: <CloudRain className="h-5 w-5 text-indigo-400" />,
          color: "bg-indigo-50 border-indigo-100"
        };
      case "windy":
        return {
          title: "Wind-Friendly Activities",
          activities: [
            "Fly a kite in an open field",
            "Visit a hilltop for panoramic views",
            "Listen to wind chimes in your garden",
            "Observe trees and grasses dancing in the breeze",
            "Try wind surfing if near water"
          ],
          icon: <Wind className="h-5 w-5 text-cyan-500" />,
          color: "bg-cyan-50 border-cyan-100"
        };
    }
  };

  const activityData = getActivities();
  
  // Rotating mood-boosting tips
  const moodTips = [
    "Spending just 20 minutes in nature can lower stress hormones.",
    "Natural light helps regulate your body's sleep-wake cycle.",
    "The color green has been shown to improve creativity and mood.",
    "Forest bathing (Shinrin-yoku) can boost your immune system.",
    "Being near water can induce a meditative state of calm.",
    "Gardening can reduce symptoms of depression and anxiety.",
    "Seeing birds and hearing birdsong improves mental wellbeing."
  ];
  
  // Select a random mood tip
  const randomTip = moodTips[Math.floor(Math.random() * moodTips.length)];

  // When user saves an activity
  const saveActivity = (activity: string) => {
    toast({
      title: "Activity Saved!",
      description: `Added "${activity}" to your nature goals.`,
    });
    
    // In a real app, we would save this to user preferences
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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-4">
      {/* Weather-specific activity card */}
      <Card className={`p-4 ${activityData.color} border`}>
        <div className="flex items-center mb-3">
          {activityData.icon}
          <h3 className="ml-2 font-medium">{activityData.title}</h3>
        </div>
        
        <motion.ul 
          className="space-y-2 ml-2"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {activityData.activities.map((activity, index) => (
            <motion.li 
              key={index} 
              className="flex items-center justify-between"
              variants={item}
            >
              <div className="flex items-center flex-1 pr-2">
                <span className="w-2 h-2 rounded-full bg-green-400 mr-2 flex-shrink-0"></span>
                <span className="text-gray-700">{activity}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 flex-shrink-0"
                onClick={() => saveActivity(activity)}
              >
                <Leaf className="h-4 w-4 text-green-500" />
              </Button>
            </motion.li>
          ))}
        </motion.ul>
      </Card>
      
      {/* All weather activities sections */}
      <div className="space-y-4">
        <Card className="p-4 bg-green-50 border border-green-100">
          <div className="flex items-center mb-3">
            <Leaf className="h-5 w-5 text-green-500" />
            <h3 className="ml-2 font-medium">All Season Activities</h3>
          </div>
          <motion.ul
            className="space-y-2 ml-2"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {[
              "Find local nature soundscapes",
              "Practice mindful nature photography",
              "Start a nature journal",
              "Identify local trees and plants",
              "Try forest bathing (Shinrin-yoku)"
            ].map((activity, index) => (
              <motion.li
                key={index}
                className="flex items-center justify-between"
                variants={item}
              >
                <div className="flex items-center flex-1 pr-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 mr-2 flex-shrink-0"></span>
                  <span className="text-gray-700">{activity}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 flex-shrink-0"
                  onClick={() => saveActivity(activity)}
                >
                  <Leaf className="h-4 w-4 text-green-500" />
                </Button>
              </motion.li>
            ))}
          </motion.ul>
        </Card>
      </div>
      
      <motion.div 
        className="bg-green-50 p-4 rounded-lg border border-green-100"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center">
          <div className="p-2 rounded-full bg-green-100 mr-3 flex-shrink-0">
            <BookOpen className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <h3 className="font-medium text-green-800">Mood Boosting Tip</h3>
            <p className="text-green-700 text-sm">{randomTip}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OutdoorActivitySuggestions;
