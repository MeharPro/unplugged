
import React from 'react';
import { WeatherData, WeatherDescription } from '@/types/weather';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WeatherInputFormProps {
  weatherData: WeatherData;
  onUpdateWeatherData: (data: Partial<WeatherData>) => void;
  onGenerateArt: () => void;
}

const weatherDescriptions: WeatherDescription[] = [
  "Clear",
  "Few Clouds",
  "Scattered Clouds",
  "Broken Clouds",
  "Shower Rain",
  "Rain",
  "Thunderstorm",
  "Snow",
  "Mist",
  "Fog"
];

const WeatherInputForm: React.FC<WeatherInputFormProps> = ({ 
  weatherData, 
  onUpdateWeatherData,
  onGenerateArt
}) => {
  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof WeatherData) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      onUpdateWeatherData({ [field]: value });
    }
  };

  const handleSliderChange = (value: number[], field: keyof WeatherData) => {
    onUpdateWeatherData({ [field]: value[0] });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Weather Data Input</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Temperature */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="temperature">Temperature (°C)</Label>
              <span className="text-sm font-medium">{weatherData.temperature}°C</span>
            </div>
            <Slider 
              id="temperature" 
              min={-30} 
              max={50} 
              step={1} 
              value={[weatherData.temperature]} 
              onValueChange={(value) => handleSliderChange(value, 'temperature')}
              className="py-2"
            />
          </div>

          {/* Precipitation Probability */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="precipitationProbability">Precipitation Probability (%)</Label>
              <span className="text-sm font-medium">{weatherData.precipitationProbability * 100}%</span>
            </div>
            <Slider 
              id="precipitationProbability" 
              min={0} 
              max={1} 
              step={0.01} 
              value={[weatherData.precipitationProbability]} 
              onValueChange={(value) => handleSliderChange(value, 'precipitationProbability')}
              className="py-2"
            />
          </div>

          {/* Precipitation Intensity */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="precipitationIntensity">Precipitation Intensity (mm/hr)</Label>
              <span className="text-sm font-medium">{weatherData.precipitationIntensity} mm/hr</span>
            </div>
            <Slider 
              id="precipitationIntensity" 
              min={0} 
              max={50} 
              step={0.5} 
              value={[weatherData.precipitationIntensity]} 
              onValueChange={(value) => handleSliderChange(value, 'precipitationIntensity')}
              className="py-2"
            />
          </div>

          {/* Wind Speed */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="windSpeed">Wind Speed (km/h)</Label>
              <span className="text-sm font-medium">{weatherData.windSpeed} km/h</span>
            </div>
            <Slider 
              id="windSpeed" 
              min={0} 
              max={150} 
              step={1} 
              value={[weatherData.windSpeed]} 
              onValueChange={(value) => handleSliderChange(value, 'windSpeed')}
              className="py-2"
            />
          </div>

          {/* Wind Direction */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="windDirection">Wind Direction (degrees)</Label>
              <span className="text-sm font-medium">{weatherData.windDirection}°</span>
            </div>
            <Slider 
              id="windDirection" 
              min={0} 
              max={360} 
              step={1} 
              value={[weatherData.windDirection]} 
              onValueChange={(value) => handleSliderChange(value, 'windDirection')}
              className="py-2"
            />
          </div>

          {/* Cloud Cover */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="cloudCover">Cloud Cover (%)</Label>
              <span className="text-sm font-medium">{weatherData.cloudCover}%</span>
            </div>
            <Slider 
              id="cloudCover" 
              min={0} 
              max={100} 
              step={1} 
              value={[weatherData.cloudCover]} 
              onValueChange={(value) => handleSliderChange(value, 'cloudCover')}
              className="py-2"
            />
          </div>

          {/* Humidity */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="humidity">Humidity (%)</Label>
              <span className="text-sm font-medium">{weatherData.humidity}%</span>
            </div>
            <Slider 
              id="humidity" 
              min={0} 
              max={100} 
              step={1} 
              value={[weatherData.humidity]} 
              onValueChange={(value) => handleSliderChange(value, 'humidity')}
              className="py-2"
            />
          </div>

          {/* UV Index */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="uvIndex">UV Index</Label>
              <span className="text-sm font-medium">{weatherData.uvIndex}</span>
            </div>
            <Slider 
              id="uvIndex" 
              min={0} 
              max={12} 
              step={1} 
              value={[weatherData.uvIndex]} 
              onValueChange={(value) => handleSliderChange(value, 'uvIndex')}
              className="py-2"
            />
          </div>

          {/* Weather Description */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Weather Description</Label>
            <Select 
              value={weatherData.description} 
              onValueChange={(value: WeatherDescription) => onUpdateWeatherData({ description: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select weather condition" />
              </SelectTrigger>
              <SelectContent>
                {weatherDescriptions.map((desc) => (
                  <SelectItem key={desc} value={desc}>{desc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={onGenerateArt}
          className="w-full mt-6 bg-gradient-to-r from-weather-rainy to-weather-thunder hover:from-weather-thunder hover:to-weather-rainy text-white font-medium py-2 px-4 rounded-md transition-all duration-300 ease-in-out hover:shadow-lg"
        >
          Generate Weather Art
        </Button>
      </CardContent>
    </Card>
  );
};

export default WeatherInputForm;
