import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Music, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MusicPlayer from "@/components/MusicPlayer";
import NatureSoundPlayer from "@/components/NatureSoundPlayer";
import { Progress } from "@/components/ui/progress";

interface ImageMusicPlayerProps {
  generatedAudioUrl: string | null;
  weather: "sunny" | "cloudy" | "rainy" | "windy";
  isGenerating?: boolean;
  generationProgress?: number;
}

const ImageMusicPlayer: React.FC<ImageMusicPlayerProps> = ({
  generatedAudioUrl,
  weather,
  isGenerating = false,
  generationProgress = 0
}) => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(generationProgress);

  return (
    <div className="text-center space-y-6 max-w-md p-6">
      <div className="text-white text-2xl font-medium mb-8">
        {generatedAudioUrl ? 'Your Personalized Music' :
         isGenerating ? 'Generating Your Music' : 'Immerse in Nature Sounds'}
      </div>

      {isGenerating ? (
        <div className="w-full">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-16 h-16 mb-2">
                <div className="absolute inset-0 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Music className="h-6 w-6 text-blue-400" />
                </div>
              </div>

              <h3 className="text-white text-lg font-medium">Creating your music</h3>
              <p className="text-white/70 text-sm text-center mb-2">
                Analyzing colors and generating a unique soundtrack based on your image...
              </p>

              <div className="w-full space-y-2">
                <Progress value={generationProgress} className="h-2 w-full" />
                <p className="text-right text-xs text-white/60">{Math.round(generationProgress)}%</p>
              </div>
            </div>
          </div>
          <p className="text-white/60 text-xs italic">This process typically takes 5-10 seconds to complete.</p>
        </div>
      ) : generatedAudioUrl ? (
        <div className="w-full">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
            <p className="text-white/80 text-sm mb-2">Music generated from your captured image:</p>
            <audio
              src={generatedAudioUrl}
              controls
              autoPlay
              loop
              className="w-full"
            />
          </div>
          <p className="text-white/60 text-xs italic">This unique 10-second composition was created based on the colors and mood of your photo.</p>
        </div>
      ) : isGenerating ? null : (
        <div>
          <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-8">
            {/* Music visualization */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-blue-500/20 to-green-500/30"></div>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* Audio visualizer */}
              <div className="flex justify-center space-x-2 mb-6">
                <div className="w-2 h-16 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-24 bg-green-500 rounded-full animate-pulse delay-150"></div>
                <div className="w-2 h-12 bg-purple-500 rounded-full animate-pulse delay-300"></div>
                <div className="w-2 h-20 bg-yellow-500 rounded-full animate-pulse delay-500"></div>
                <div className="w-2 h-16 bg-pink-500 rounded-full animate-pulse delay-700"></div>
              </div>

              <div className="text-white/80 text-sm font-medium">
                {weather === "sunny" ? "Forest Ambience" :
                weather === "rainy" ? "Rain Sounds" :
                weather === "windy" ? "Ocean Waves" : "Meditation Bells"}
              </div>
            </div>
          </div>

          <div className="w-full bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden mb-6">
            <MusicPlayer autoplay={true} weather={weather} />
          </div>
        </div>
      )}

      <div className="mt-8">
        <Button
          variant="outline"
          size="lg"
          className="rounded-full bg-white/10 backdrop-blur-sm text-white border-white/20"
          onClick={() => navigate("/dashboard")}
        >
          <Music className="h-5 w-5 mr-2" />
          Continue to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default ImageMusicPlayer;
