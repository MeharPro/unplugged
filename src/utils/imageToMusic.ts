import axios from 'axios';

// --- Configuration ---
const API_KEY = import.meta.env.VITE_SEGMIND_API_KEY || ""; // Get API key from environment variables
const SEGMIND_API_URL = "https://api.segmind.com/v1/meta-musicgen-medium";
const DEFAULT_DURATION = 10; // Default song duration in seconds
const DEFAULT_SEED = 42; // Default seed for reproducibility

// --- Interfaces ---
interface ColorAnalysisResult {
  [colorName: string]: number; // e.g., { 'grey': 0.3, 'green': 0.6, 'blue': 0.1 }
}

interface MusicPromptParams {
  mood: string[];
  genre: string[];
  instruments: string[];
}

/**
 * Classifies an RGB color into a named color category.
 * @param r - Red component (0-255)
 * @param g - Green component (0-255)
 * @param b - Blue component (0-255)
 * @returns String name of the color category
 */
function classifyColor(r: number, g: number, b: number): string {
  // Simple color classification based on RGB values
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  // Check for grayscale first (when R, G, B are close in value)
  if (delta < 30 && max < 200 && min > 30) {
    return 'grey';
  }

  // Check for white/very light colors
  if (min > 200) {
    return 'white';
  }

  // Check for black/very dark colors
  if (max < 30) {
    return 'black';
  }

  // For colored pixels, determine the dominant color
  if (max === r) {
    if (g > 150 && b < 100) return 'yellow';
    if (g > 100) return 'orange';
    return 'red';
  } else if (max === g) {
    if (r > 150) return 'yellow';
    return 'green';
  } else { // max === b
    if (r > 150) return 'purple';
    if (g > 150) return 'cyan';
    return 'blue';
  }
}

/**
 * Analyzes the image data to determine dominant color ratios.
 * @param imageData - ImageData object from canvas
 * @returns Object with color names as keys and their ratios (0-1) as values.
 */
function analyzeImageColors(imageData: ImageData): ColorAnalysisResult {
  const { data } = imageData;
  // We don't need width and height since we're counting pixels directly
  const colorCounts: { [key: string]: number } = {};
  let totalPixelsProcessed = 0;

  // Iterate through pixel data (RGBA)
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // We ignore alpha channel data[i + 3] for color classification

    const colorName = classifyColor(r, g, b);
    colorCounts[colorName] = (colorCounts[colorName] || 0) + 1;
    totalPixelsProcessed++;
  }

  if (totalPixelsProcessed === 0) {
    console.warn("No pixels processed during color analysis.");
    return {}; // Return empty if no pixels were processed
  }

  // Convert counts to ratios
  const result: ColorAnalysisResult = {};
  for (const color in colorCounts) {
    result[color] = colorCounts[color] / totalPixelsProcessed;
  }

  return result;
}

/**
 * Maps color analysis results to musical characteristics.
 * @param colorAnalysis - The result from analyzeImageColors
 * @returns An object containing arrays for mood, genre, and instruments.
 */
function mapColorsToMusicPrompt(colorAnalysis: ColorAnalysisResult): MusicPromptParams {
  const params: MusicPromptParams = { mood: [], genre: [], instruments: [] };

  // --- Mood Mapping ---
  if (colorAnalysis['red'] > 0.2) params.mood.push('energetic', 'passionate');
  if (colorAnalysis['blue'] > 0.2) params.mood.push('calm', 'relaxed', 'melancholic');
  if (colorAnalysis['green'] > 0.2) params.mood.push('peaceful', 'natural', 'refreshing');
  if (colorAnalysis['yellow'] > 0.1) params.mood.push('happy', 'cheerful', 'bright');
  if (colorAnalysis['purple'] > 0.1) params.mood.push('mysterious', 'magical', 'dreamy');
  if (colorAnalysis['orange'] > 0.1) params.mood.push('warm', 'lively', 'playful');
  if (colorAnalysis['black'] > 0.2) params.mood.push('dark', 'intense', 'powerful');
  if (colorAnalysis['white'] > 0.3) params.mood.push('pure', 'light', 'airy');
  if (colorAnalysis['grey'] > 0.3) params.mood.push('neutral', 'balanced', 'subtle');

  // If no moods were added, add some defaults
  if (params.mood.length === 0) {
    params.mood.push('balanced', 'pleasant');
  }

  // --- Genre Mapping ---
  if (colorAnalysis['red'] > 0.15) params.genre.push('rock', 'pop');
  if (colorAnalysis['blue'] > 0.15) params.genre.push('ambient', 'jazz');
  if (colorAnalysis['green'] > 0.15) params.genre.push('folk', 'acoustic');
  if (colorAnalysis['yellow'] > 0.1) params.genre.push('pop', 'electronic');
  if (colorAnalysis['purple'] > 0.1) params.genre.push('electronic', 'ambient');
  if (colorAnalysis['orange'] > 0.1) params.genre.push('latin', 'funk');
  if (colorAnalysis['black'] > 0.2) params.genre.push('electronic', 'cinematic');
  if (colorAnalysis['white'] > 0.3) params.genre.push('classical', 'ambient');
  if (colorAnalysis['grey'] > 0.3) params.genre.push('lofi', 'ambient');

  // If no genres were added, add some defaults
  if (params.genre.length === 0) {
    params.genre.push('ambient', 'instrumental');
  }

  // --- Instruments Mapping ---
  if (colorAnalysis['blue'] > 0.1) params.instruments.push('piano', 'strings');
  if (colorAnalysis['green'] > 0.1) params.instruments.push('acoustic guitar', 'flute');
  if (colorAnalysis['red'] > 0.05) params.instruments.push('electric guitar', 'drums');
  if (colorAnalysis['yellow'] > 0.05) params.instruments.push('synthesizer', 'brass');
  if (colorAnalysis['grey'] > 0.1) params.instruments.push('synth pad', 'bass');
  if (colorAnalysis['orange'] > 0.05) params.instruments.push('saxophone');

  // If no instruments were added, add some defaults
  if (params.instruments.length === 0) {
    params.instruments.push('piano', 'strings', 'synthesizer');
  }

  // --- Refine and Deduplicate ---
  params.mood = [...new Set(params.mood)]; // Remove duplicates
  params.genre = [...new Set(params.genre)];
  params.instruments = [...new Set(params.instruments)];

  return params;
}

/**
 * Builds a text prompt for the music generation API based on the music parameters.
 * @param params - The music parameters (mood, genre, instruments)
 * @returns A formatted text prompt string
 */
function buildApiPrompt(params: MusicPromptParams): string {
  // Select a subset of parameters to avoid overly complex prompts
  const selectedMoods = params.mood.slice(0, 3);
  const selectedGenres = params.genre.slice(0, 2);
  const selectedInstruments = params.instruments.slice(0, 4);

  let prompt = "";

  // Add moods
  if (selectedMoods.length > 0) {
    prompt += `A ${selectedMoods.join(", ")} piece `;
  }

  // Add genres
  if (selectedGenres.length > 0) {
    prompt += `in the style of ${selectedGenres.join(" and ")} music `;
  }

  // Add instruments
  if (selectedInstruments.length > 0) {
    prompt += `featuring ${selectedInstruments.join(", ")}`;
  }

  return prompt.trim();
}

/**
 * Calls the Segmind API to generate music.
 * @param prompt - The generated text prompt.
 * @param duration - Duration of the music in seconds.
 * @param seed - Seed for generation.
 * @returns Promise resolving to a Blob containing the generated audio data.
 */
async function generateMusic(prompt: string, duration: number = DEFAULT_DURATION, seed: number = DEFAULT_SEED): Promise<Blob> {
  console.log(`Generating music with prompt: "${prompt}", duration: ${duration}s`);

  // Check if API key is available
  if (!API_KEY) {
    console.error("Segmind API key is missing. Please check your environment variables.");
    throw new Error("API key is missing. Music generation is not available.");
  }

  const payload = {
    prompt: prompt,
    duration: duration,
    seed: seed
  };
  const headers = { 'x-api-key': API_KEY };

  try {
    const response = await axios.post(SEGMIND_API_URL, payload, {
      headers: headers,
      responseType: 'arraybuffer' // Expecting binary audio data
    });
    console.log('Music generation successful.');
    return new Blob([response.data], { type: 'audio/mpeg' });
  } catch (error) {
    console.error("Error calling Segmind API:", error);
    throw new Error("Failed to generate music from Segmind API.");
  }
}

/**
 * Processes an image data URL and generates music based on its colors.
 * @param imageDataUrl - The data URL of the image to process
 * @param duration - Duration of the music in seconds
 * @returns Promise resolving to an object with the audio blob and URL
 */
export async function processImageAndGenerateMusic(
  imageDataUrl: string,
  duration: number = DEFAULT_DURATION
): Promise<{ audioBlob: Blob, audioUrl: string }> {
  try {
    // Create an image element to load the data URL
    const img = new Image();
    img.src = imageDataUrl;

    // Wait for the image to load
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Failed to load image"));
    });

    // Create a canvas to get image data
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error("Could not get canvas context");
    }

    // Set canvas dimensions to match image
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw the image to the canvas
    ctx.drawImage(img, 0, 0);

    // Get image data for analysis
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Analyze colors
    const colorAnalysis = analyzeImageColors(imageData);
    console.log("Color Analysis:", colorAnalysis);

    // Map colors to music parameters
    const musicParams = mapColorsToMusicPrompt(colorAnalysis);
    console.log("Derived Music Params:", musicParams);

    // Build API prompt
    const apiPrompt = buildApiPrompt(musicParams);
    console.log("API Prompt:", apiPrompt);

    // Generate music
    const audioBlob = await generateMusic(apiPrompt, duration);

    // Create a URL for the audio blob
    const audioUrl = URL.createObjectURL(audioBlob);

    return { audioBlob, audioUrl };
  } catch (error) {
    console.error("Error in image-to-music process:", error);
    throw error;
  }
}
