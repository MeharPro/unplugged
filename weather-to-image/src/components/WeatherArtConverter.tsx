
import React, { useState, useCallback } from 'react';
import { WeatherData } from '@/types/weather';
import { generateArtStyle } from '@/utils/weatherMappings';
import WeatherInputForm from './WeatherInputForm';
import ArtCanvas from './ArtCanvas';
import StyleDescription from './StyleDescription';
import ColorPalette from './ColorPalette';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Download, Share2 } from 'lucide-react';

const WeatherArtConverter: React.FC = () => {
  // Default weather data
  const [weatherData, setWeatherData] = useState<WeatherData>({
    temperature: 20,
    precipitationProbability: 0.3,
    precipitationIntensity: 2,
    windSpeed: 15,
    windDirection: 180,
    cloudCover: 40,
    humidity: 60,
    uvIndex: 5,
    description: "Scattered Clouds"
  });
  
  const [shouldGenerateArt, setShouldGenerateArt] = useState<boolean>(false);
  const [artStyle, setArtStyle] = useState(null);
  const [isArtGenerated, setIsArtGenerated] = useState<boolean>(false);
  
  const handleUpdateWeatherData = (data: Partial<WeatherData>) => {
    setWeatherData(prev => ({ ...prev, ...data }));
  };
  
  const handleGenerateArt = () => {
    setIsArtGenerated(false);
    setShouldGenerateArt(true);
    
    // Generate art style description
    const style = generateArtStyle(weatherData);
    setArtStyle(style);
    
    toast.success("Generating new artwork based on your weather data", {
      description: `Creating ${style.genre} style with ${style.mood} mood`,
    });
  };
  
  const handleGenerationComplete = useCallback(() => {
    setShouldGenerateArt(false);
    setIsArtGenerated(true);
  }, []);
  
  const handleDownload = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `weather-art-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast.success("Artwork downloaded successfully");
    }
  };
  
  const handleShare = () => {
    if (navigator.share && canvas) {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], "weather-art.png", { type: "image/png" });
            try {
              await navigator.share({
                title: 'Weather Art',
                text: 'Check out this weather-inspired artwork!',
                files: [file]
              });
              toast.success("Shared successfully");
            } catch (err) {
              toast.error("Could not share the artwork");
              console.error("Share error:", err);
            }
          }
        });
      }
    } else {
      toast.error("Sharing is not supported on this browser");
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-weather-rainy to-weather-thunder bg-clip-text text-transparent">
        Weather Art Converter
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <WeatherInputForm 
            weatherData={weatherData}
            onUpdateWeatherData={handleUpdateWeatherData}
            onGenerateArt={handleGenerateArt}
          />
          
          {artStyle && (
            <div className="mt-6">
              <StyleDescription artStyle={artStyle} />
            </div>
          )}
          
          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium mb-2">Color Palette</h3>
                  <ColorPalette temperature={weatherData.temperature} />
                </div>
                
                {isArtGenerated && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={handleDownload} title="Download artwork">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleShare} title="Share artwork">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <ArtCanvas 
            weatherData={weatherData}
            shouldGenerate={shouldGenerateArt}
            onGenerationComplete={handleGenerationComplete}
          />
          
          <div className="mt-4 text-center text-sm text-gray-500">
            <p>Each artwork is uniquely generated based on the weather parameters.</p>
            <p className="mt-1">Adjust values and click "Generate" to create a new artwork.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherArtConverter;
