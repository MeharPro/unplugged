
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { Leaf, ArrowRight } from "lucide-react";

const Survey = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [outdoorFrequency, setOutdoorFrequency] = useState("");
  const [measurementSystem, setMeasurementSystem] = useState("metric");
  const [outdoorActivities, setOutdoorActivities] = useState<string[]>([]);
  const [outdoorBarriers, setOutdoorBarriers] = useState<string[]>([]);

  const handleContinue = () => {
    if (step === 1) {
      if (firstName.trim() !== "" && lastName.trim() !== "") {
        // Store the user's name in localStorage
        localStorage.setItem("unplugged_user_first_name", firstName);
        localStorage.setItem("unplugged_user_last_name", lastName);
        setStep(2);
      }
    } else if (step === 2) {
      if (ageGroup) {
        localStorage.setItem("unplugged_age_group", ageGroup);
        setStep(3);
      }
    } else if (step === 3) {
      if (outdoorFrequency) {
        localStorage.setItem("unplugged_outdoor_frequency", outdoorFrequency);
        setStep(4);
      }
    } else if (step === 4) {
      localStorage.setItem("unplugged_outdoor_activities", JSON.stringify(outdoorActivities));
      setStep(5);
    } else if (step === 5) {
      // Store the barriers and preferences
      localStorage.setItem("unplugged_outdoor_barriers", JSON.stringify(outdoorBarriers));
      localStorage.setItem("unplugged_measurement_system", measurementSystem);
      
      // Navigate to generate ID
      navigate("/generate-id");
    }
  };

  const toggleActivity = (activity: string) => {
    setOutdoorActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
  };

  const toggleBarrier = (barrier: string) => {
    setOutdoorBarriers((prev) =>
      prev.includes(barrier)
        ? prev.filter((b) => b !== barrier)
        : [...prev, barrier]
    );
  };

  const fadeVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-green-50">
      <div className="w-full max-w-md">
        <Card className="p-6 backdrop-blur-sm bg-white/80 border-none shadow-lg">
          {step === 1 && (
            <motion.div 
              className="space-y-6"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={fadeVariants}
            >
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Unplugged</h1>
                <p className="text-gray-600 text-sm">
                  Let's get to know you a little better
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">What's your first name?</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                    className="border-green-100 focus:border-green-300"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">What's your last name?</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                    className="border-green-100 focus:border-green-300"
                  />
                </div>
              </div>

              <Button 
                onClick={handleContinue}
                disabled={firstName.trim() === "" || lastName.trim() === ""}
                className="w-full"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}
          
          {step === 2 && (
            <motion.div 
              className="space-y-6"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={fadeVariants}
            >
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Hi, {firstName}!
                </h1>
                <p className="text-gray-600 text-sm">
                  Let's personalize your experience a bit more
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="age-group">Which age group do you belong to?</Label>
                <Select onValueChange={setAgeGroup} value={ageGroup}>
                  <SelectTrigger id="age-group" className="border-green-100 focus:border-green-300">
                    <SelectValue placeholder="Select your age group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-18">Under 18</SelectItem>
                    <SelectItem value="18-24">18-24</SelectItem>
                    <SelectItem value="25-34">25-34</SelectItem>
                    <SelectItem value="35-44">35-44</SelectItem>
                    <SelectItem value="45-54">45-54</SelectItem>
                    <SelectItem value="55+">55+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button 
                  onClick={handleContinue}
                  disabled={!ageGroup}
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
          
          {step === 3 && (
            <motion.div 
              className="space-y-6"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={fadeVariants}
            >
              <div className="text-center">
                <h1 className="text-xl font-bold text-gray-800 mb-2">Outdoor Habits</h1>
                <p className="text-gray-600 text-sm">
                  Tell us about your current connection with nature
                </p>
              </div>

              <div className="space-y-3">
                <Label>How often do you typically spend time outside each week?</Label>
                <RadioGroup value={outdoorFrequency} onValueChange={setOutdoorFrequency}>
                  <div className="flex items-center space-x-2 rounded-md p-2 hover:bg-gray-50">
                    <RadioGroupItem value="rarely" id="rarely" />
                    <Label htmlFor="rarely" className="cursor-pointer w-full">Rarely</Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md p-2 hover:bg-gray-50">
                    <RadioGroupItem value="1-2-times" id="1-2-times" />
                    <Label htmlFor="1-2-times" className="cursor-pointer w-full">1-2 times a week</Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md p-2 hover:bg-gray-50">
                    <RadioGroupItem value="3-5-times" id="3-5-times" />
                    <Label htmlFor="3-5-times" className="cursor-pointer w-full">3-5 times a week</Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md p-2 hover:bg-gray-50">
                    <RadioGroupItem value="daily" id="daily" />
                    <Label htmlFor="daily" className="cursor-pointer w-full">Daily</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                >
                  Back
                </Button>
                <Button 
                  onClick={handleContinue}
                  disabled={!outdoorFrequency}
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
          
          {step === 4 && (
            <motion.div 
              className="space-y-6"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={fadeVariants}
            >
              <div className="text-center">
                <h1 className="text-xl font-bold text-gray-800 mb-2">Outdoor Activities</h1>
                <p className="text-gray-600 text-sm">
                  What kinds of outdoor activities do you enjoy?
                </p>
              </div>

              <div className="space-y-3">
                <Label>Select all that apply:</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "Relaxing in parks",
                    "Hiking trails",
                    "Outdoor cafes",
                    "Working outdoors",
                    "Nature photography",
                    "Urban exploring",
                    "Wildlife watching",
                    "Gardening",
                    "Water activities"
                  ].map((activity) => (
                    <div 
                      key={activity}
                      className={`flex items-center space-x-2 rounded-md p-3 cursor-pointer border transition-colors ${
                        outdoorActivities.includes(activity)
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-green-200"
                      }`}
                      onClick={() => toggleActivity(activity)}
                    >
                      <Checkbox 
                        checked={outdoorActivities.includes(activity)} 
                        onCheckedChange={() => toggleActivity(activity)}
                        id={`activity-${activity}`}
                        className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                      />
                      <Label htmlFor={`activity-${activity}`} className="cursor-pointer w-full">
                        {activity}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setStep(3)}
                >
                  Back
                </Button>
                <Button 
                  onClick={handleContinue}
                  disabled={outdoorActivities.length === 0}
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
          
          {step === 5 && (
            <motion.div 
              className="space-y-6"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={fadeVariants}
            >
              <div className="text-center">
                <h1 className="text-xl font-bold text-gray-800 mb-2">Final Steps</h1>
                <p className="text-gray-600 text-sm">
                  Just a few more questions to personalize your experience
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <Label>What usually stops you from going outside?</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      "Weather conditions",
                      "Lack of time",
                      "Don't know where to go",
                      "Lack of motivation",
                      "Safety concerns",
                      "Health limitations"
                    ].map((barrier) => (
                      <div 
                        key={barrier}
                        className={`flex items-center space-x-2 rounded-md p-2 cursor-pointer border transition-colors ${
                          outdoorBarriers.includes(barrier)
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-200"
                        }`}
                        onClick={() => toggleBarrier(barrier)}
                      >
                        <Checkbox 
                          checked={outdoorBarriers.includes(barrier)} 
                          onCheckedChange={() => toggleBarrier(barrier)}
                          id={`barrier-${barrier}`}
                          className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                        />
                        <Label htmlFor={`barrier-${barrier}`} className="cursor-pointer w-full">
                          {barrier}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label>Preferred measurement system</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div 
                      className={`flex justify-center items-center py-3 rounded-md cursor-pointer border transition-colors ${
                        measurementSystem === "metric"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-green-200"
                      }`}
                      onClick={() => setMeasurementSystem("metric")}
                    >
                      <span className="font-medium">Metric (km, °C)</span>
                    </div>
                    <div 
                      className={`flex justify-center items-center py-3 rounded-md cursor-pointer border transition-colors ${
                        measurementSystem === "imperial"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-green-200"
                      }`}
                      onClick={() => setMeasurementSystem("imperial")}
                    >
                      <span className="font-medium">Imperial (mi, °F)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setStep(4)}
                >
                  Back
                </Button>
                <Button 
                  onClick={handleContinue}
                  className="bg-green-500 hover:bg-green-600"
                >
                  Finish
                  <Leaf className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Survey;
