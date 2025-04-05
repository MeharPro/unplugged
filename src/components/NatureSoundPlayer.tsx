
import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, PlayCircle, PauseCircle, SkipForward, SkipBack } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface NatureSoundPlayerProps {
  weather: "sunny" | "cloudy" | "rainy" | "windy";
  minimized?: boolean;
  onToggleMinimize?: () => void;
}

// Nature sound data
const natureSounds = {
  sunny: [
    { name: "Birds Chirping", url: "https://freesound.org/data/previews/244/244985_4568904-lq.mp3" },
    { name: "Summer Stream", url: "https://freesound.org/data/previews/346/346170_5121236-lq.mp3" },
  ],
  cloudy: [
    { name: "Gentle Wind", url: "https://freesound.org/data/previews/131/131430_2337290-lq.mp3" },
    { name: "Distant Thunder", url: "https://freesound.org/data/previews/219/219367_71257-lq.mp3" },
  ],
  rainy: [
    { name: "Rain on Leaves", url: "https://freesound.org/data/previews/366/366166_5621641-lq.mp3" },
    { name: "Rain on Window", url: "https://freesound.org/data/previews/195/195124_3472928-lq.mp3" },
  ],
  windy: [
    { name: "Wind in Trees", url: "https://freesound.org/data/previews/362/362475_4376884-lq.mp3" },
    { name: "Rustling Leaves", url: "https://freesound.org/data/previews/523/523525_7273149-lq.mp3" },
  ]
};

const NatureSoundPlayer = ({ weather, minimized = false, onToggleMinimize }: NatureSoundPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundIndex, setSoundIndex] = useState(0);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  
  const weatherSounds = natureSounds[weather] || natureSounds.sunny;
  const currentSound = weatherSounds[soundIndex];

  useEffect(() => {
    // Reset to first sound when weather changes
    setSoundIndex(0);
    setIsPlaying(false);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [weather]);

  useEffect(() => {
    const audio = audioRef.current;
    
    if (!audio) return;
    
    // Set up audio event listeners
    const setAudioData = () => {
      setDuration(audio.duration);
    };
    
    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const onEnded = () => {
      // Loop back to beginning
      audio.currentTime = 0;
      audio.play();
    };
    
    // Add events
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', onEnded);
    
    // Apply volume settings
    audio.volume = volume / 100;
    audio.muted = isMuted;
    
    // Handle play/pause
    if (isPlaying) {
      audio.play().catch(error => {
        console.error("Error playing audio:", error);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
    
    return () => {
      // Clean up event listeners
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', onEnded);
    };
  }, [isPlaying, soundIndex, volume, isMuted, weather]);
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };
  
  const handleNextTrack = () => {
    const nextIndex = (soundIndex + 1) % weatherSounds.length;
    setSoundIndex(nextIndex);
    
    // Auto-play when changing tracks
    setIsPlaying(true);
  };
  
  const handlePrevTrack = () => {
    const prevIndex = soundIndex === 0 ? weatherSounds.length - 1 : soundIndex - 1;
    setSoundIndex(prevIndex);
    
    // Auto-play when changing tracks
    setIsPlaying(true);
  };
  
  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  const getWeatherColor = () => {
    switch (weather) {
      case 'sunny': return 'from-yellow-300 to-amber-500';
      case 'cloudy': return 'from-blue-300 to-gray-400';
      case 'rainy': return 'from-blue-400 to-indigo-600';
      case 'windy': return 'from-teal-300 to-cyan-500';
      default: return 'from-green-300 to-emerald-500';
    }
  };

  if (minimized) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`fixed bottom-4 right-4 z-50 bg-gradient-to-r ${getWeatherColor()} p-3 rounded-full shadow-lg cursor-pointer`}
        onClick={onToggleMinimize}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isPlaying ? (
          <Volume2 className="h-6 w-6 text-white" />
        ) : (
          <VolumeX className="h-6 w-6 text-white" />
        )}
        <span className="sr-only">Expand Nature Sounds</span>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="relative w-full"
      >
        <audio
          ref={audioRef}
          src={currentSound.url}
          preload="metadata"
        />
        
        <div className={`rounded-lg overflow-hidden shadow-md bg-gradient-to-r ${getWeatherColor()} p-4`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-medium">Nature Sounds</h3>
            {onToggleMinimize && (
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 p-0 h-8 w-8"
                onClick={onToggleMinimize}
              >
                <span className="sr-only">Minimize</span>
                <svg 
                  className="h-4 w-4"
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </Button>
            )}
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-white/90">{currentSound.name}</div>
            <div className="text-xs text-white/80">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
          
          <div className="mb-4">
            <Slider
              value={[currentTime]}
              min={0}
              max={duration || 100}
              step={0.1}
              onValueChange={(values) => {
                if (audioRef.current) {
                  audioRef.current.currentTime = values[0];
                }
              }}
              className="cursor-pointer"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Button 
                variant="ghost"
                size="sm" 
                className="text-white hover:bg-white/20"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              
              <Slider
                value={[volume]}
                min={0}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                disabled={isMuted}
                className="w-20 cursor-pointer"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20"
                onClick={handlePrevTrack}
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 h-10 w-10 rounded-full bg-white/20"
                onClick={handlePlayPause}
              >
                {isPlaying ? (
                  <PauseCircle className="h-6 w-6" />
                ) : (
                  <PlayCircle className="h-6 w-6" />
                )}
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20"
                onClick={handleNextTrack}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Wave animation */}
          <div className="mt-3 flex items-end justify-center space-x-1 h-6">
            {isPlaying && Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="bg-white/50 w-1 rounded-full"
                animate={{
                  height: [5, 15, 5],
                  transition: {
                    duration: 1 + Math.random() * 0.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: i * 0.1,
                  }
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NatureSoundPlayer;
