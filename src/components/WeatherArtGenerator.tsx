import React, { useRef, useEffect, useState } from 'react';
import { generateArt } from '../../weather-to-image/src/utils/artGeneration';
import { WeatherData } from '../../weather-to-image/src/types/weather';
import { generateWeatherArtDataUrl } from '@/utils/weather';
import { enhanceArtParams, getEnhancedColorPalette } from '@/utils/artEnhancer';

interface WeatherArtGeneratorProps {
  weatherData: WeatherData;
  onImageGenerated: (imageUrl: string) => void;
  width?: number;
  height?: number;
}

const WeatherArtGenerator: React.FC<WeatherArtGeneratorProps> = ({
  weatherData,
  onImageGenerated,
  width = 800,
  height = 400
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerated, setIsGenerated] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || isGenerated) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Enhance weather data for more vibrant art
      const enhancedWeatherData = { ...weatherData, ...enhanceArtParams(weatherData) };

      // Override the color palette with our vibrant colors
      const customColorPalette = getEnhancedColorPalette(weatherData);

      // Apply a custom background before generating art
      applyVibrantBackground(ctx, width, height, customColorPalette);

      // Generate art based on enhanced weather data
      generateArt(ctx, width, height, enhancedWeatherData);

      // Convert canvas to data URL and pass it to parent
      const imageUrl = generateWeatherArtDataUrl(ctx, width, height);
      onImageGenerated(imageUrl);

      setIsGenerated(true);
    }
  }, [weatherData, width, height, onImageGenerated, isGenerated]);

  // Helper function to apply a vibrant background gradient
  const applyVibrantBackground = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    colors: string[]
  ) => {
    // Create a vibrant gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);

    // Use the first and last colors from our palette for the gradient
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(0.5, colors[Math.floor(colors.length / 2)]);
    gradient.addColorStop(1, colors[colors.length - 1]);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ display: 'none' }} // Hide the canvas
    />
  );
};

export default WeatherArtGenerator;
