
import React from 'react';
import { ArtStyle } from '@/types/weather';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface StyleDescriptionProps {
  artStyle: ArtStyle | null;
}

const StyleDescription: React.FC<StyleDescriptionProps> = ({ artStyle }) => {
  if (!artStyle) {
    return null;
  }
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Artwork Style</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-weather-cloudy text-white font-medium">
            {artStyle.genre}
          </Badge>
          <Badge variant="outline">
            {artStyle.mood}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Color Palette:</h4>
          <p className="text-sm text-muted-foreground">{artStyle.colorDescription}</p>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Technique:</h4>
          <p className="text-sm text-muted-foreground">{artStyle.technique}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StyleDescription;
