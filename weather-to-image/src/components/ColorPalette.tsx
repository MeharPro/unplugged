
import React from 'react';
import { getColorPaletteByTemperature } from '@/utils/weatherMappings';

interface ColorPaletteProps {
  temperature: number;
  className?: string;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ temperature, className = "" }) => {
  const colors = getColorPaletteByTemperature(temperature);
  
  return (
    <div className={`flex gap-2 ${className}`}>
      {colors.map((color, index) => (
        <div
          key={index}
          className="w-8 h-8 rounded-full shadow-sm"
          style={{ backgroundColor: color }}
          title={`Color ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default ColorPalette;
