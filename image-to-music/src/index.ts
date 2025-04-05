import axios from 'axios';
import sharp from 'sharp';
import * as fs from 'fs/promises';
import * as path from 'path';

// --- Configuration ---
const API_KEY = "SG_df75a8c5a2d6074c"; // Replace with your actual API key if needed
const SEGMIND_API_URL = "https://api.segmind.com/v1/meta-musicgen-medium";
const OUTPUT_DIR = path.join(__dirname, '../output'); // Directory to save generated music
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

// --- Helper Functions (to be implemented) ---

/**
 * Fetches image data from a URL or reads from a local file path.
 * @param imageSource - URL string or local file path string
 * @returns Buffer containing the image data
 */
async function getImageData(imageSource: string): Promise<Buffer> {
    // Implementation needed
    console.log(`Getting image data from: ${imageSource}`);
    // Placeholder implementation
    if (imageSource.startsWith('http://') || imageSource.startsWith('https://')) {
        const response = await axios.get(imageSource, { responseType: 'arraybuffer' });
        return Buffer.from(response.data);
    } else {
        return await fs.readFile(imageSource);
    }
}

/**
 * Analyzes the image buffer to determine dominant color ratios.
 * @param imageBuffer - Buffer containing the image data
 * @returns Object with color names as keys and their ratios (0-1) as values.
 */
async function analyzeImageColors(imageBuffer: Buffer): Promise<ColorAnalysisResult> {
    // Implementation needed using sharp
    console.log('Analyzing image colors...');
    // Placeholder implementation - Replace with actual Sharp logic
    // Resize for performance; analyze a smaller sample
    const { data, info } = await sharp(imageBuffer)
        .resize(100, 100, { fit: 'inside' }) // Resize to max 100x100
        .ensureAlpha() // Ensure 4 channels (RGBA) for consistent processing
        .raw()
        .toBuffer({ resolveWithObject: true });

    const pixelCount = info.width * info.height;
    const colorCounts: { [key: string]: number } = {};
    let totalPixelsProcessed = 0;

    // Iterate through pixel data (RGBA)
    for (let i = 0; i < data.length; i += info.channels) {
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


    const colorAnalysis: ColorAnalysisResult = {};
    for (const colorName in colorCounts) {
        colorAnalysis[colorName] = colorCounts[colorName] / totalPixelsProcessed; // Use actual processed count
    }

    console.log('Color analysis complete.');
    return colorAnalysis;
}


// --- Color Classification Helpers ---

/**
 * Converts RGB color value to HSL. Conversion formula
 * adapted from https://stackoverflow.com/a/9493060/1063035
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSL representation
 */
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h, s, l];
}

/**
 * Classifies an RGB color into a named category based on HSL values.
 */
function classifyColor(r: number, g: number, b: number): string {
    const [h, s, l] = rgbToHsl(r, g, b);

    // Check for greyscale (low saturation) or near black/white (low/high lightness)
    if (s < 0.1 || l < 0.1) return 'black';
    if (l > 0.9) return 'white';
    if (s < 0.2 && l < 0.8) return 'grey'; // Adjust thresholds as needed

    const hueDegrees = h * 360;

    // Classify based on hue
    if (hueDegrees >= 330 || hueDegrees < 15) return 'red';
    if (hueDegrees >= 15 && hueDegrees < 45) return 'orange';
    if (hueDegrees >= 45 && hueDegrees < 75) return 'yellow';
    if (hueDegrees >= 75 && hueDegrees < 150) return 'green';
    if (hueDegrees >= 150 && hueDegrees < 210) return 'cyan';
    if (hueDegrees >= 210 && hueDegrees < 270) return 'blue';
    if (hueDegrees >= 270 && hueDegrees < 330) return 'magenta'; // Or purple/violet

    return 'unknown'; // Fallback
}


/**
 * Maps color analysis results to musical characteristics.
 * @param colorAnalysis - The result from analyzeImageColors
 * @returns An object containing arrays for mood, genre, and instruments.
 */
function mapColorsToMusicPrompt(colorAnalysis: ColorAnalysisResult): MusicPromptParams {
    // Implementation needed based on user's mapping logic
    console.log('Mapping colors to music prompt...');
    const params: MusicPromptParams = { mood: [], genre: [], instruments: [] };

    console.log("Mapping based on:", colorAnalysis);

    // --- More Detailed Color to Music Mapping ---
    // Adjust thresholds and mappings based on desired musical output

    // Moods
    if (colorAnalysis['red'] > 0.1) params.mood.push('energetic', 'passionate');
    if (colorAnalysis['orange'] > 0.1) params.mood.push('warm', 'inviting');
    if (colorAnalysis['yellow'] > 0.1) params.mood.push('happy', 'bright');
    if (colorAnalysis['green'] > 0.1) params.mood.push('calm', 'natural', 'peaceful');
    if (colorAnalysis['cyan'] > 0.05) params.mood.push('refreshing', 'cool');
    if (colorAnalysis['blue'] > 0.1) params.mood.push('serene', 'deep', 'thoughtful');
    if (colorAnalysis['magenta'] > 0.05) params.mood.push('mysterious', 'dreamy');
    if (colorAnalysis['grey'] > 0.2) params.mood.push('neutral', 'somber', 'introspective');
    if (colorAnalysis['black'] > 0.3) params.mood.push('dark', 'intense');
    if (colorAnalysis['white'] > 0.3) params.mood.push('light', 'airy', 'minimal');

    // Genres (can be influenced by multiple colors)
    const totalColor = (colorAnalysis['red'] || 0) + (colorAnalysis['orange'] || 0) + (colorAnalysis['yellow'] || 0);
    if (totalColor > 0.3) params.genre.push('pop', 'upbeat electronic');
    if ((colorAnalysis['blue'] || 0) + (colorAnalysis['grey'] || 0) > 0.4) params.genre.push('ambient', 'lo-fi');
    if ((colorAnalysis['green'] || 0) > 0.3) params.genre.push('folk', 'acoustic');
    if ((colorAnalysis['red'] || 0) + (colorAnalysis['black'] || 0) > 0.3) params.genre.push('rock', 'metal');

    // Instruments
    if (colorAnalysis['blue'] > 0.1) params.instruments.push('piano', 'strings');
    if (colorAnalysis['green'] > 0.1) params.instruments.push('acoustic guitar', 'flute');
    if (colorAnalysis['red'] > 0.05) params.instruments.push('electric guitar', 'drums');
    if (colorAnalysis['yellow'] > 0.05) params.instruments.push('synthesizer', 'brass');
    if (colorAnalysis['grey'] > 0.1) params.instruments.push('synth pad', 'bass');
    if (colorAnalysis['orange'] > 0.05) params.instruments.push('saxophone');


    // --- Refine and Deduplicate ---
    params.mood = [...new Set(params.mood)]; // Remove duplicates
    params.genre = [...new Set(params.genre)];
    params.instruments = [...new Set(params.instruments)];

    // --- Add Fallbacks ---
    if (params.mood.length === 0) params.mood.push('neutral');
    if (params.genre.length === 0) params.genre.push('ambient');

    return params;
}

/**
 * Constructs the final prompt string for the Segmind API.
 * @param params - The derived music parameters.
 * @returns A string prompt.
 */
function buildApiPrompt(params: MusicPromptParams): string {
    // Combine mood, genre, instruments into a coherent prompt
    let prompt = "";
    if (params.mood.length > 0) prompt += `${params.mood.join(', ')} `;
    if (params.genre.length > 0) prompt += `${params.genre.join(', ')} music `;
    if (params.instruments.length > 0) prompt += `featuring ${params.instruments.join(', ')}`;

    return prompt.trim() || "instrumental music"; // Fallback prompt
}

/**
 * Calls the Segmind API to generate music.
 * @param prompt - The generated text prompt.
 * @param duration - Duration of the music in seconds.
 * @param seed - Seed for generation.
 * @returns Buffer containing the generated audio data.
 */
async function generateMusic(prompt: string, duration: number = DEFAULT_DURATION, seed: number = DEFAULT_SEED): Promise<Buffer> {
    console.log(`Generating music with prompt: "${prompt}", duration: ${duration}s`);
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
        return Buffer.from(response.data);
    } catch (error) {
        console.error("Error calling Segmind API:");
        if (axios.isAxiosError(error)) {
            // Log more detailed error info if available
            console.error(`Status: ${error.response?.status}`);
            // Attempt to decode error message if it's text
            try {
                const errorText = Buffer.from(error.response?.data).toString('utf-8');
                console.error(`Data: ${errorText}`);
            } catch (e) {
                console.error("Could not decode error response data.");
            }
        } else {
            console.error(error);
        }
        throw new Error("Failed to generate music from Segmind API.");
    }
}

/**
 * Saves the generated music data to a file.
 * @param audioBuffer - Buffer containing the audio data.
 * @param filename - The desired filename (without extension).
 */
async function saveMusic(audioBuffer: Buffer, filename: string = 'generated_music'): Promise<void> {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    // Assuming the API returns MP3 or WAV. Let's default to .mp3 for now.
    // We might need to inspect the response headers or initial bytes to be sure.
    const outputPath = path.join(OUTPUT_DIR, `${filename}.mp3`);
    await fs.writeFile(outputPath, audioBuffer);
    console.log(`Music saved to: ${outputPath}`);
}


// --- Main Execution Logic ---
async function main() {
    // Get image source from command line arguments (or use a default)
    const imageSource = process.argv[2] || 'https://placehold.co/150x150/00ff00/ffffff?text=Green'; // Default: Green placeholder

    if (!imageSource) {
        console.error("Please provide an image URL or local file path as a command line argument.");
        process.exit(1);
    }

    try {
        console.log("Starting music generation process...");
        const imageData = await getImageData(imageSource);
        const colorAnalysis = await analyzeImageColors(imageData);
        console.log("Color Analysis:", colorAnalysis);
        const musicParams = mapColorsToMusicPrompt(colorAnalysis);
        console.log("Derived Music Params:", musicParams);
        const apiPrompt = buildApiPrompt(musicParams);
        const audioData = await generateMusic(apiPrompt);
        await saveMusic(audioData);
        console.log("Music generation process completed successfully.");

    } catch (error) {
        console.error("An error occurred during the process:", error);
        process.exit(1);
    }
}

main();
