
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Pause, Play, Music, SkipForward, SkipBack, Disc } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const tracks = [
  {
    name: "Forest Ambience",
    artist: "Nature Sounds",
    src: "https://freesound.org/data/previews/531/531967_2462919-lq.mp3",
    color: "from-green-500 to-emerald-700",
    mood: "peaceful"
  },
  {
    name: "Rain Sounds",
    artist: "Ambient Weather",
    src: "https://freesound.org/data/previews/346/346170_5121236-lq.mp3",
    color: "from-blue-500 to-indigo-700",
    mood: "calm"
  },
  {
    name: "Ocean Waves",
    artist: "Sea Recordings",
    src: "https://freesound.org/data/previews/467/467910_9657713-lq.mp3",
    color: "from-cyan-500 to-blue-700",
    mood: "relaxing"
  },
  {
    name: "Meditation Bells",
    artist: "Zen Audio",
    src: "https://freesound.org/data/previews/414/414042_7292238-lq.mp3",
    color: "from-purple-500 to-violet-700",
    mood: "meditative"
  }
];

interface MusicPlayerProps {
  autoplay?: boolean;
  weather?: "sunny" | "cloudy" | "rainy" | "windy";
  standalone?: boolean;
}

const MusicPlayer = ({ autoplay = false, weather = "sunny", standalone = false }: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [memories, setMemories] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<number | null>(null);
  const discRef = useRef<HTMLDivElement | null>(null);

  const currentTrack = tracks[trackIndex];

  // Select track based on weather
  useEffect(() => {
    if (weather === "rainy") setTrackIndex(1);
    else if (weather === "windy") setTrackIndex(2);
    else if (weather === "sunny") setTrackIndex(0);
    else if (weather === "cloudy") setTrackIndex(3);
  }, [weather]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error("Audio playback error:", err);
          setIsPlaying(false);
        });
        
        // Update progress
        if (intervalRef.current) window.clearInterval(intervalRef.current);
        intervalRef.current = window.setInterval(() => {
          if (audioRef.current) {
            const audioDuration = audioRef.current.duration || 1;
            setProgress((audioRef.current.currentTime / audioDuration) * 100);
            
            // Update time displays
            setCurrentTime(formatTime(audioRef.current.currentTime));
            setDuration(formatTime(audioDuration));
          }
        }, 1000);
        
        // Rotate disc animation
        if (discRef.current) {
          discRef.current.style.animationPlayState = 'running';
        }
      } else {
        audioRef.current.pause();
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current);
        }
        
        // Pause disc animation
        if (discRef.current) {
          discRef.current.style.animationPlayState = 'paused';
        }
      }
    }

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, trackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      audioRef.current.volume = volume / 100;
    }
  }, [isMuted, volume]);

  // Auto-play when component mounts if autoplay is true
  useEffect(() => {
    if (autoplay) {
      setIsPlaying(true);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [autoplay]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };
  
  const handleProgressChange = (value: number[]) => {
    if (audioRef.current) {
      const newTime = (value[0] / 100) * (audioRef.current.duration || 0);
      audioRef.current.currentTime = newTime;
      setProgress(value[0]);
    }
  };
  
  const handlePrevTrack = () => {
    setTrackIndex(prev => (prev === 0 ? tracks.length - 1 : prev - 1));
  };
  
  const handleNextTrack = () => {
    setTrackIndex(prev => (prev === tracks.length - 1 ? 0 : prev + 1));
  };
  
  const saveMemory = () => {
    const newMemory = `${currentTrack.name} - ${new Date().toLocaleString()}`;
    setMemories(prev => [...prev, newMemory]);
  };

  return (
    <div className={`w-full ${standalone ? 'p-6 max-w-md mx-auto' : ''}`}>
      <audio
        ref={audioRef}
        src={currentTrack.src}
        loop
        onEnded={() => setIsPlaying(false)}
      />
      
      <div className={`w-full backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 ${standalone ? 'shadow-xl' : ''}`}>
        <div className={`bg-gradient-to-r ${currentTrack.color} p-6`}>
          <div className="flex items-center space-x-4">
            <div 
              ref={discRef}
              className="w-16 h-16 rounded-full bg-black/30 flex items-center justify-center animate-spin"
              style={{ 
                animationDuration: '3s', 
                animationIterationCount: 'infinite', 
                animationTimingFunction: 'linear',
                animationPlayState: isPlaying ? 'running' : 'paused'
              }}
            >
              <div className="w-6 h-6 rounded-full bg-white/90"></div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-white font-medium">{currentTrack.name}</h3>
              <p className="text-white/70 text-sm">{currentTrack.artist}</p>
              <p className="text-white/50 text-xs mt-1">Mood: {currentTrack.mood}</p>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-white/80 hover:text-white hover:bg-white/10"
              onClick={toggleMute}
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4 space-y-1">
            <Slider
              value={[progress]}
              max={100}
              step={0.1}
              onValueChange={handleProgressChange}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-white/70">
              <span>{currentTime}</span>
              <span>{duration}</span>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex justify-center items-center space-x-4 mt-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-white/80 hover:text-white hover:bg-white/10"
              onClick={handlePrevTrack}
            >
              <SkipBack className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white/20 text-white hover:bg-white/30 h-12 w-12 flex items-center justify-center"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-white/80 hover:text-white hover:bg-white/10"
              onClick={handleNextTrack}
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Volume slider */}
          <div className="mt-4 flex items-center space-x-2">
            <Volume2 className="h-4 w-4 text-white/70" />
            <Slider
              value={[volume]}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              className="cursor-pointer"
            />
          </div>
          
          {/* Memory button */}
          <div className="mt-4 flex justify-center">
            <Button
              variant="outline"
              size="sm"
              className="text-white border-white/20 bg-white/10 hover:bg-white/20 text-xs"
              onClick={saveMemory}
            >
              Save as Memory
            </Button>
          </div>
        </div>
        
        {/* Memories section (optional display) */}
        {memories.length > 0 && standalone && (
          <div className="bg-black/10 p-4">
            <h4 className="text-sm font-medium text-white/90 mb-2">Your Memories</h4>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {memories.map((memory, i) => (
                <div key={i} className="text-xs text-white/70 flex items-center">
                  <Disc className="h-3 w-3 mr-2" />
                  {memory}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicPlayer;
