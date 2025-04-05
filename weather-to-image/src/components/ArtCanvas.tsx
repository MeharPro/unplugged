
import React, { useRef, useEffect } from 'react';
import { WeatherData } from '@/types/weather';
import { generateArt } from '@/utils/artGeneration';
import { Card } from '@/components/ui/card';

interface ArtCanvasProps {
  weatherData: WeatherData;
  shouldGenerate: boolean;
  onGenerationComplete: () => void;
}

const ArtCanvas: React.FC<ArtCanvasProps> = ({ 
  weatherData, 
  shouldGenerate,
  onGenerationComplete
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (shouldGenerate && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Set canvas dimensions
        const width = canvas.width;
        const height = canvas.height;
        
        // Generate art based on weather data
        generateArt(ctx, width, height, weatherData);
        
        // Signal that generation is complete
        onGenerationComplete();
      }
    }
  }, [weatherData, shouldGenerate, onGenerationComplete]);
  
  return (
    <Card className="p-4 w-full overflow-hidden flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={600} 
        className="max-w-full h-auto rounded-md shadow-inner"
      />
    </Card>
  );
};

export default ArtCanvas;
