
import { WeatherData, DrawingParams, ArtStyle } from "@/types/weather";
import { generateDrawingParams, generateArtStyle } from "./weatherMappings";

// Create artistic elements based on weather data
export const generateArt = (
  ctx: CanvasRenderingContext2D, 
  canvasWidth: number, 
  canvasHeight: number, 
  weatherData: WeatherData
): void => {
  // Generate drawing parameters and art style from weather data
  const params = generateDrawingParams(weatherData);
  const artStyle = generateArtStyle(weatherData);
  
  // Clear canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  
  // Apply background
  applyBackground(ctx, canvasWidth, canvasHeight, params);
  
  // Select technique based on art style genre
  switch(artStyle.genre) {
    case "Impressionism":
      drawImpressionistArt(ctx, canvasWidth, canvasHeight, params, weatherData);
      break;
    case "Abstract Expressionism":
      drawAbstractExpressionistArt(ctx, canvasWidth, canvasHeight, params, weatherData);
      break;
    case "Watercolor":
      drawWatercolorArt(ctx, canvasWidth, canvasHeight, params, weatherData);
      break;
    case "Geometric Abstract":
      drawGeometricArt(ctx, canvasWidth, canvasHeight, params, weatherData);
      break;
    case "Minimalism":
      drawMinimalistArt(ctx, canvasWidth, canvasHeight, params, weatherData);
      break;
    case "Pointillism":
      drawPointillismArt(ctx, canvasWidth, canvasHeight, params, weatherData);
      break;
    case "Glitch Art":
      drawGlitchArt(ctx, canvasWidth, canvasHeight, params, weatherData);
      break;
    case "Line Art":
      drawLineArt(ctx, canvasWidth, canvasHeight, params, weatherData);
      break;
    default:
      drawAbstractArt(ctx, canvasWidth, canvasHeight, params, weatherData);
  }
  
  // Add atmospheric effects
  applyAtmosphericEffects(ctx, canvasWidth, canvasHeight, params);
  
  // Add weather elements (rain, snow, etc.)
  if (weatherData.description.includes("Rain") || weatherData.description.includes("Shower")) {
    drawRainElements(ctx, canvasWidth, canvasHeight, params, weatherData);
  } else if (weatherData.description.includes("Snow")) {
    drawSnowElements(ctx, canvasWidth, canvasHeight, params, weatherData);
  } else if (weatherData.description.includes("Fog") || weatherData.description.includes("Mist")) {
    drawFogElements(ctx, canvasWidth, canvasHeight, params, weatherData);
  }
};

// Apply background gradient
const applyBackground = (
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  params: DrawingParams
): void => {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, params.backgroundGradient[0]);
  gradient.addColorStop(1, params.backgroundGradient[1]);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
};

// Apply atmospheric effects (like fog, cloud diffusion)
const applyAtmosphericEffects = (
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  params: DrawingParams
): void => {
  // Apply an overlay for atmospheric effects
  ctx.fillStyle = `rgba(255, 255, 255, ${0.1 * (params.blur / 5)})`;
  ctx.fillRect(0, 0, width, height);
};

// Drawing techniques for different art styles
const drawImpressionistArt = (
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  params: DrawingParams,
  weatherData: WeatherData
): void => {
  // Impressionist style with small brush strokes of unmixed colors
  for (let i = 0; i < params.density * 3; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const color = params.colorPalette[Math.floor(Math.random() * params.colorPalette.length)];
    const size = 5 + Math.random() * 15;
    
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.3 + Math.random() * 0.4;
    
    // Draw small brush strokes
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  
  ctx.globalAlpha = 1;
};

const drawAbstractExpressionistArt = (
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  params: DrawingParams,
  weatherData: WeatherData
): void => {
  // Abstract expressionism with bold, gestural brushstrokes
  for (let i = 0; i < 20; i++) {
    const startX = Math.random() * width;
    const startY = Math.random() * height;
    const color = params.colorPalette[Math.floor(Math.random() * params.colorPalette.length)];
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 3 + Math.random() * params.strokeWidth * 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalAlpha = 0.4 + Math.random() * 0.4;
    
    // Create sweeping, gestural brushstrokes
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    
    // Create a curved path influenced by wind direction
    const angleInfluence = (params.directionality / 180) * Math.PI;
    const curveIntensity = params.distortion * 3;
    
    // Generate control points for the curve
    const control1X = startX + Math.cos(angleInfluence) * curveIntensity + (Math.random() * 100 - 50);
    const control1Y = startY + Math.sin(angleInfluence) * curveIntensity + (Math.random() * 100 - 50);
    const control2X = startX + Math.cos(angleInfluence) * curveIntensity * 2 + (Math.random() * 100 - 50);
    const control2Y = startY + Math.sin(angleInfluence) * curveIntensity * 2 + (Math.random() * 100 - 50);
    const endX = startX + Math.cos(angleInfluence) * curveIntensity * 3 + (Math.random() * 100 - 50);
    const endY = startY + Math.sin(angleInfluence) * curveIntensity * 3 + (Math.random() * 100 - 50);
    
    ctx.bezierCurveTo(control1X, control1Y, control2X, control2Y, endX, endY);
    ctx.stroke();
  }
  
  ctx.globalAlpha = 1;
};

const drawWatercolorArt = (
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  params: DrawingParams,
  weatherData: WeatherData
): void => {
  // Watercolor style with transparent, fluid blobs
  for (let i = 0; i < 10; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const color = params.colorPalette[Math.floor(Math.random() * params.colorPalette.length)];
    const size = 30 + Math.random() * 100;
    
    // Apply watercolor effect with layered, soft-edged shapes
    ctx.globalAlpha = 0.1 + Math.random() * 0.2;
    
    // Create blob shape
    ctx.fillStyle = color;
    ctx.beginPath();
    
    // Randomize the blob shape
    const points = 8 + Math.floor(Math.random() * 8);
    const angleStep = (Math.PI * 2) / points;
    
    for (let j = 0; j < points; j++) {
      const angle = j * angleStep;
      const radius = size * (0.5 + Math.random() * 0.5);
      const pointX = x + Math.cos(angle) * radius;
      const pointY = y + Math.sin(angle) * radius;
      
      if (j === 0) {
        ctx.moveTo(pointX, pointY);
      } else {
        // Use quadratic curves for smooth blob edges
        const prevAngle = (j - 1) * angleStep;
        const controlX = x + Math.cos((prevAngle + angle) / 2) * radius * 1.5;
        const controlY = y + Math.sin((prevAngle + angle) / 2) * radius * 1.5;
        ctx.quadraticCurveTo(controlX, controlY, pointX, pointY);
      }
    }
    
    ctx.closePath();
    ctx.fill();
  }
  
  ctx.globalAlpha = 1;
};

const drawGeometricArt = (
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  params: DrawingParams,
  weatherData: WeatherData
): void => {
  // Geometric abstract with clean, hard-edged shapes
  const gridSize = 4 + Math.floor(Math.random() * 4);
  const cellWidth = width / gridSize;
  const cellHeight = height / gridSize;
  
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      if (Math.random() > 0.3) { // 70% chance to draw a shape
        const color = params.colorPalette[Math.floor(Math.random() * params.colorPalette.length)];
        const shapeType = Math.floor(Math.random() * 3); // 0: rectangle, 1: circle, 2: triangle
        
        const posX = x * cellWidth;
        const posY = y * cellHeight;
        const size = Math.min(cellWidth, cellHeight) * (0.5 + Math.random() * 0.5);
        
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.7 + Math.random() * 0.3;
        
        switch(shapeType) {
          case 0: // Rectangle
            ctx.fillRect(
              posX + (cellWidth - size) / 2, 
              posY + (cellHeight - size) / 2, 
              size, 
              size
            );
            break;
          case 1: // Circle
            ctx.beginPath();
            ctx.arc(
              posX + cellWidth / 2,
              posY + cellHeight / 2,
              size / 2,
              0,
              Math.PI * 2
            );
            ctx.fill();
            break;
          case 2: // Triangle
            ctx.beginPath();
            ctx.moveTo(posX + cellWidth / 2, posY + (cellHeight - size) / 2);
            ctx.lineTo(posX + (cellWidth - size) / 2, posY + (cellHeight + size) / 2);
            ctx.lineTo(posX + (cellWidth + size) / 2, posY + (cellHeight + size) / 2);
            ctx.closePath();
            ctx.fill();
            break;
        }
      }
    }
  }
  
  ctx.globalAlpha = 1;
};

const drawMinimalistArt = (
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  params: DrawingParams,
  weatherData: WeatherData
): void => {
  // Minimalist style with simple elements and lots of negative space
  const color = params.colorPalette[Math.floor(Math.random() * params.colorPalette.length)];
  
  // Draw 1-3 simple elements
  const elementsCount = 1 + Math.floor(Math.random() * 3);
  
  for (let i = 0; i < elementsCount; i++) {
    const x = width * (0.2 + Math.random() * 0.6);
    const y = height * (0.2 + Math.random() * 0.6);
    const size = Math.min(width, height) * (0.05 + Math.random() * 0.2);
    
    ctx.fillStyle = color;
    
    // Choose between a circle, line, or rectangle
    const elementType = Math.floor(Math.random() * 3);
    
    switch(elementType) {
      case 0: // Circle
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 1: // Horizontal line
        ctx.fillRect(x - size * 2, y, size * 4, size / 10);
        break;
      case 2: // Rectangle
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
        break;
    }
  }
};

const drawPointillismArt = (
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  params: DrawingParams,
  weatherData: WeatherData
): void => {
  // Pointillism style with many small dots
  const dotDensity = params.density * 8;
  
  for (let i = 0; i < dotDensity; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const color = params.colorPalette[Math.floor(Math.random() * params.colorPalette.length)];
    const size = 1 + Math.random() * params.strokeWidth;
    
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.6 + Math.random() * 0.4;
    
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  
  ctx.globalAlpha = 1;
};

const drawGlitchArt = (
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  params: DrawingParams,
  weatherData: WeatherData
): void => {
  // Glitch art with digital distortion effects
  const stripeCount = 5 + Math.floor(Math.random() * 10);
  const stripeHeight = height / stripeCount;
  
  // Draw glitched horizontal bands
  for (let i = 0; i < stripeCount; i++) {
    const y = i * stripeHeight;
    const color = params.colorPalette[Math.floor(Math.random() * params.colorPalette.length)];
    const glitchOffset = Math.random() * params.distortion * 2;
    
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.3 + Math.random() * 0.4;
    
    // Sometimes displace the stripe horizontally
    if (Math.random() > 0.7) {
      ctx.fillRect(glitchOffset, y, width - glitchOffset, stripeHeight * (0.5 + Math.random() * 0.5));
    } else {
      ctx.fillRect(0, y, width, stripeHeight);
    }
  }
  
  // Add pixel noise
  for (let i = 0; i < 500; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = 1 + Math.random() * 3;
    
    ctx.fillStyle = params.colorPalette[Math.floor(Math.random() * params.colorPalette.length)];
    ctx.globalAlpha = Math.random();
    ctx.fillRect(x, y, size, size);
  }
  
  ctx.globalAlpha = 1;
};

const drawLineArt = (
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  params: DrawingParams,
  weatherData: WeatherData
): void => {
  // Line art style with focus on linear elements
  const lineCount = 20 + Math.floor(params.density);
  const baseAngle = (params.directionality / 180) * Math.PI;
  
  ctx.lineWidth = params.strokeWidth;
  ctx.lineCap = "round";
  
  for (let i = 0; i < lineCount; i++) {
    const color = params.colorPalette[Math.floor(Math.random() * params.colorPalette.length)];
    const angleVariation = (Math.random() - 0.5) * Math.PI / 4; // ±45° variation
    const angle = baseAngle + angleVariation;
    
    // Starting point of the line
    const startX = Math.random() * width;
    const startY = Math.random() * height;
    
    // Calculate end point based on angle and a random length
    const length = 50 + Math.random() * 200;
    const endX = startX + Math.cos(angle) * length;
    const endY = startY + Math.sin(angle) * length;
    
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.5 + Math.random() * 0.5;
    
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }
  
  ctx.globalAlpha = 1;
};

const drawAbstractArt = (
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  params: DrawingParams,
  weatherData: WeatherData
): void => {
  // Generic abstract art combining various techniques
  // Draw background shapes
  for (let i = 0; i < 5; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = 50 + Math.random() * 150;
    const color = params.colorPalette[Math.floor(Math.random() * params.colorPalette.length)];
    
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.2 + Math.random() * 0.3;
    
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Draw line elements
  ctx.lineWidth = params.strokeWidth;
  ctx.lineCap = "round";
  
  for (let i = 0; i < 15; i++) {
    const startX = Math.random() * width;
    const startY = Math.random() * height;
    const endX = startX + (Math.random() * 200 - 100);
    const endY = startY + (Math.random() * 200 - 100);
    const color = params.colorPalette[Math.floor(Math.random() * params.colorPalette.length)];
    
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.6 + Math.random() * 0.4;
    
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }
  
  ctx.globalAlpha = 1;
};

// Weather element drawings
const drawRainElements = (
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  params: DrawingParams,
  weatherData: WeatherData
): void => {
  const raindropsCount = params.particleCount;
  const rainColor = "rgba(200, 200, 255, 0.5)";
  
  ctx.strokeStyle = rainColor;
  ctx.lineWidth = 1;
  
  for (let i = 0; i < raindropsCount; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const length = params.particleSize * 10;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - params.distortion / 10, y + length);
    ctx.stroke();
  }
};

const drawSnowElements = (
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  params: DrawingParams,
  weatherData: WeatherData
): void => {
  const snowflakesCount = params.particleCount;
  const snowColor = "rgba(255, 255, 255, 0.8)";
  
  ctx.fillStyle = snowColor;
  
  for (let i = 0; i < snowflakesCount; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = params.particleSize;
    
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
};

const drawFogElements = (
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  params: DrawingParams,
  weatherData: WeatherData
): void => {
  // Add layered fog effect
  for (let i = 0; i < 3; i++) {
    const y = height * (i / 3);
    const fogHeight = height / 3;
    
    const gradient = ctx.createLinearGradient(0, y, 0, y + fogHeight);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${0.05 + i * 0.05})`);
    gradient.addColorStop(0.5, `rgba(255, 255, 255, ${0.15 + i * 0.05})`);
    gradient.addColorStop(1, `rgba(255, 255, 255, ${0.05 + i * 0.05})`);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, y, width, fogHeight);
  }
};
