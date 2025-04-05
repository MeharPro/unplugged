import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Play, Pause, Music, Heart, Plus, Search, Trees, Waves, CloudRain } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import MusicPlayer from "@/components/MusicPlayer";

const MusicLibrary = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("nature");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  
  const natureSounds = [
    { id: "forest1", title: "Forest Ambience", duration: "10:32", type: "forest", favorite: true },
    { id: "rain1", title: "Rain on Leaves", duration: "8:15", type: "rain", favorite: false },
    { id: "stream1", title: "Flowing Stream", duration: "12:45", type: "water", favorite: true },
    { id: "birds1", title: "Morning Birds", duration: "9:20", type: "forest", favorite: false },
    { id: "waves1", title: "Ocean Waves", duration: "15:10", type: "water", favorite: true },
    { id: "thunder1", title: "Distant Thunder", duration: "7:35", type: "rain", favorite: false },
    { id: "wind1", title: "Mountain Wind", duration: "11:18", type: "wind", favorite: false },
    { id: "campfire1", title: "Crackling Campfire", duration: "14:22", type: "forest", favorite: true },
  ];
  
  const recentlyPlayed = [
    { id: "forest1", title: "Forest Ambience", duration: "10:32", type: "forest", lastPlayed: "Today" },
    { id: "waves1", title: "Ocean Waves", duration: "15:10", type: "water", lastPlayed: "Yesterday" },
    { id: "rain1", title: "Rain on Leaves", duration: "8:15", type: "rain", lastPlayed: "2 days ago" },
  ];
  
  const yourMixes = [
    { id: "mix1", title: "Rainy Day Focus", tracks: 4, duration: "45:20", mood: "Calm" },
    { id: "mix2", title: "Forest Meditation", tracks: 3, duration: "32:15", mood: "Peaceful" },
    { id: "mix3", title: "Ocean Relaxation", tracks: 5, duration: "52:40", mood: "Tranquil" },
  ];
  
  const handleBack = () => {
    navigate("/dashboard");
  };
  
  const handlePlayPause = (id: string) => {
    if (currentlyPlaying === id) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(id);
    }
  };
  
  const toggleFavorite = (id: string) => {
    // In a real app, this would update state properly
    console.log(`Toggle favorite for: ${id}`);
  };
  
  const getSoundIcon = (type: string) => {
    switch (type) {
      case "forest":
        return <Trees className="h-5 w-5 text-green-500" />;
      case "rain":
        return <CloudRain className="h-5 w-5 text-blue-500" />;
      case "water":
        return <Waves className="h-5 w-5 text-cyan-500" />;
      case "wind":
        return <Waves className="h-5 w-5 text-teal-500" />;
      default:
        return <Music className="h-5 w-5 text-purple-500" />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      <div className="container mx-auto px-4 pt-6 pb-24">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-white/60 backdrop-blur-sm"
            onClick={handleBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <h1 className="text-xl font-semibold">Nature Sounds Library</h1>
          
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search sounds..."
            className="pl-10 bg-white/70 backdrop-blur-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Current Player */}
        {currentlyPlaying && (
          <Card className="mb-6 border-none shadow-md overflow-hidden bg-gradient-to-r from-blue-100 to-purple-100">
            <CardContent className="p-4">
              <MusicPlayer weather="sunny" />
            </CardContent>
          </Card>
        )}
        
        {/* Tabs */}
        <Tabs defaultValue="nature" className="mb-6" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="nature">Nature</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="mixes">Your Mixes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="nature" className="mt-0">
            <Card className="border-none shadow-md">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-medium">All Sounds</h2>
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Plus className="h-4 w-4 mr-1" /> Add New
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {natureSounds.map((sound) => (
                    <div 
                      key={sound.id} 
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-white/70 transition-colors"
                    >
                      <div className="flex items-center">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className={`mr-3 ${currentlyPlaying === sound.id ? 'bg-green-100 text-green-600' : ''}`}
                          onClick={() => handlePlayPause(sound.id)}
                        >
                          {currentlyPlaying === sound.id ? 
                            <Pause className="h-5 w-5" /> : 
                            <Play className="h-5 w-5" />
                          }
                        </Button>
                        
                        <div className="flex items-center">
                          <div className="p-2 rounded-full bg-gray-100 mr-3">
                            {getSoundIcon(sound.type)}
                          </div>
                          <div>
                            <h3 className="font-medium">{sound.title}</h3>
                            <p className="text-xs text-gray-500">{sound.duration}</p>
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => toggleFavorite(sound.id)}
                      >
                        <Heart 
                          className={`h-5 w-5 ${sound.favorite ? 'fill-pink-500 text-pink-500' : 'text-gray-400'}`} 
                        />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recent" className="mt-0">
            <Card className="border-none shadow-md">
              <CardContent className="p-4">
                <h2 className="font-medium mb-4">Recently Played</h2>
                
                <div className="space-y-3">
                  {recentlyPlayed.map((sound) => (
                    <div 
                      key={sound.id} 
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-white/70 transition-colors"
                    >
                      <div className="flex items-center">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="mr-3"
                          onClick={() => handlePlayPause(sound.id)}
                        >
                          {currentlyPlaying === sound.id ? 
                            <Pause className="h-5 w-5" /> : 
                            <Play className="h-5 w-5" />
                          }
                        </Button>
                        
                        <div className="flex items-center">
                          <div className="p-2 rounded-full bg-gray-100 mr-3">
                            {getSoundIcon(sound.type)}
                          </div>
                          <div>
                            <h3 className="font-medium">{sound.title}</h3>
                            <p className="text-xs text-gray-500">{sound.lastPlayed}</p>
                          </div>
                        </div>
                      </div>
                      
                      <span className="text-xs text-gray-500">{sound.duration}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="mixes" className="mt-0">
            <Card className="border-none shadow-md">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-medium">Your Sound Mixes</h2>
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Plus className="h-4 w-4 mr-1" /> Create Mix
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {yourMixes.map((mix) => (
                    <Card key={mix.id} className="bg-white/80 hover:bg-white transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">{mix.title}</h3>
                          <Button size="icon" variant="ghost" onClick={() => handlePlayPause(mix.id)}>
                            {currentlyPlaying === mix.id ? 
                              <Pause className="h-5 w-5" /> : 
                              <Play className="h-5 w-5" />
                            }
                          </Button>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>{mix.tracks} tracks</span>
                          <span>{mix.duration}</span>
                          <span>Mood: {mix.mood}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card className="border-none shadow-md overflow-hidden">
          <CardContent className="p-4">
            <h2 className="font-medium mb-4">Collections</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-lg text-center cursor-pointer hover:shadow-md transition-all">
                <Trees className="h-8 w-8 mx-auto text-green-600 mb-2" />
                <h3 className="font-medium">Forests</h3>
                <p className="text-xs text-gray-600">8 sounds</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-lg text-center cursor-pointer hover:shadow-md transition-all">
                <CloudRain className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                <h3 className="font-medium">Rain</h3>
                <p className="text-xs text-gray-600">6 sounds</p>
              </div>
              
              <div className="bg-gradient-to-br from-cyan-100 to-cyan-200 p-4 rounded-lg text-center cursor-pointer hover:shadow-md transition-all">
                <Waves className="h-8 w-8 mx-auto text-cyan-600 mb-2" />
                <h3 className="font-medium">Water</h3>
                <p className="text-xs text-gray-600">10 sounds</p>
              </div>
              
              <div className="bg-gradient-to-br from-amber-100 to-amber-200 p-4 rounded-lg text-center cursor-pointer hover:shadow-md transition-all">
                <Plus className="h-8 w-8 mx-auto text-amber-600 mb-2" />
                <h3 className="font-medium">Explore More</h3>
                <p className="text-xs text-gray-600">All categories</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MusicLibrary;
