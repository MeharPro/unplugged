
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Camera, Check } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import useUserName from "@/hooks/use-user-name";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { processImageAndGenerateMusic } from "@/utils/imageToMusic";
import { generateRandomGradient } from "@/utils/gradients";
import ImageMusicPlayer from "@/components/ImageMusicPlayer";

const Capture = () => {
  const navigate = useNavigate();
  const [capturing, setCapturing] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [playingSound, setPlayingSound] = useState(false);
  const [weather, setWeather] = useState<"sunny" | "cloudy" | "rainy" | "windy">("sunny");
  const [userName] = useUserName();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);
  const [isGeneratingMusic, setIsGeneratingMusic] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  // Simulate getting weather information
  useEffect(() => {
    const weathers: Array<"sunny" | "cloudy" | "rainy" | "windy"> = ["sunny", "cloudy", "rainy", "windy"];
    const randomWeather = weathers[Math.floor(Math.random() * weathers.length)];
    setWeather(randomWeather);
  }, []);

  // Initialize camera immediately when component mounts
  useEffect(() => {
    // Start camera immediately when component mounts
    startCamera();

    return () => {
      // Clean up camera stream when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []); // Empty dependency array ensures this only runs once on mount

  const startCamera = async () => {
    try {
      // First, ensure any existing tracks are stopped
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }

      // Set loading state
      setCameraActive(false);

      // Request camera access with a timeout
      const streamPromise = navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });

      // Set a timeout to handle slow camera initialization
      const timeoutPromise = new Promise<MediaStream>((_, reject) => {
        setTimeout(() => reject(new Error('Camera access timeout')), 10000);
      });

      // Race between camera access and timeout
      const stream = await Promise.race([streamPromise, timeoutPromise]);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setCameraActive(true);
        };
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast({
        title: "Camera Error",
        description: "Unable to access your camera. Please check permissions and try again.",
        variant: "destructive"
      });

      // Try to restart camera after a short delay
      setTimeout(() => {
        if (!cameraActive && !captured) {
          startCamera();
        }
      }, 2000);
    }
  };

  const handleCapture = () => {
    setCapturing(true);

    setTimeout(() => {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the current video frame to the canvas
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Convert canvas to data URL
          const data = canvas.toDataURL('image/jpeg');
          setPhotoData(data);

          // Stop camera stream
          const stream = video.srcObject as MediaStream;
          const tracks = stream.getTracks();
          tracks.forEach(track => track.stop());

          setCameraActive(false);
        }
      }

      setCapturing(false);
      setCaptured(true);
    }, 800);
  };

  const handleConfirm = async () => {
    // Save the captured photo
    if (photoData) {
      localStorage.setItem("unplugged_user_photo", photoData);

      // Get user card gradient if exists, otherwise generate one
      const cardGradient = localStorage.getItem("unplugged_card_gradient") ||
        generateRandomGradient();

      // Save the gradient to localStorage if it doesn't exist yet
      if (!localStorage.getItem("unplugged_card_gradient")) {
        localStorage.setItem("unplugged_card_gradient", cardGradient);
      }

      // Generate music from the captured image
      setIsGeneratingMusic(true);
      setGenerationProgress(0);
      setPlayingSound(true); // Start showing the generation screen

      try {
        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setGenerationProgress(prev => {
            // Increase progress but cap at 90% until actual completion
            const newProgress = prev + (Math.random() * 5);
            return newProgress > 90 ? 90 : newProgress;
          });
        }, 300);

        // Generate the music
        const { audioUrl } = await processImageAndGenerateMusic(photoData, 10); // 10 seconds duration

        // Clear the interval and set to 100%
        clearInterval(progressInterval);
        setGenerationProgress(100);

        // Short delay before showing the final result
        setTimeout(() => {
          setGeneratedAudioUrl(audioUrl);

          toast({
            title: "Music created!",
            description: `Your unique soundtrack has been generated based on your photo.`,
          });
        }, 500);
      } catch (error) {
        setGenerationProgress(0);
        console.error("Error generating music:", error);
        toast({
          title: "Music generation failed",
          description: "We couldn't generate music from your image. Using default nature sounds instead.",
          variant: "destructive"
        });
        setPlayingSound(true); // Fall back to default sounds
      } finally {
        setIsGeneratingMusic(false);
      }
    }
  };

  const generateRandomGradient = () => {
    const gradients = [
      "from-blue-400 via-purple-300 to-green-300",
      "from-purple-400 via-pink-200 to-red-300",
      "from-yellow-400 via-orange-200 to-red-300",
      "from-green-400 via-teal-200 to-blue-300",
      "from-blue-500 via-indigo-400 to-purple-500",
      "from-amber-300 via-orange-300 to-rose-300"
    ];

    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  const handleCancel = () => {
    setCaptured(false);
    setPhotoData(null);
    setCameraActive(false); // Reset camera active state
    startCamera(); // Restart camera
  };

  const handleReturnToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <header className="p-4 flex justify-between items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/dashboard")}
          className="text-white"
        >
          <X className="h-6 w-6" />
        </Button>
        <h1 className="text-white font-medium">
          {userName.firstName ? `${userName.firstName}'s Capture` : 'Capture Moment'}
        </h1>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </header>

      {!playingSound ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
          {!captured ? (
            <>
              <div className="w-full max-w-md aspect-square bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center relative">
                {/* Camera view */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Background gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-green-500/20 pointer-events-none"></div>

                {/* Hidden canvas for capturing photos */}
                <canvas ref={canvasRef} className="hidden" />

                {!cameraActive && !capturing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                    <LoadingSpinner className="w-8 h-8" />
                    <p className="ml-2">Activating camera...</p>
                  </div>
                )}

                {/* Camera UI elements */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="h-full w-full border-2 border-white/30 rounded-lg"></div>
                  {capturing && (
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  )}
                </div>
              </div>

              <div className="mt-12">
                <Button
                  size="lg"
                  className="h-16 w-16 rounded-full bg-white text-gray-900"
                  onClick={handleCapture}
                  disabled={capturing || !cameraActive}
                >
                  <Camera className="h-6 w-6" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="w-full max-w-md aspect-square bg-gray-800 rounded-xl overflow-hidden relative">
                {/* Display captured photo */}
                {photoData && (
                  <img
                    src={photoData}
                    alt="Captured"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-300 to-green-400 opacity-30"></div>
              </div>

              <div className="mt-10 flex space-x-6">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full bg-white/10 backdrop-blur-sm text-white border-white/20"
                  onClick={handleCancel}
                >
                  <X className="h-5 w-5 mr-1" />
                  Retake
                </Button>

                <Button
                  size="lg"
                  className="rounded-full bg-white text-gray-900"
                  onClick={handleConfirm}
                  disabled={isGeneratingMusic}
                >
                  {isGeneratingMusic ? (
                    <>
                      <div className="animate-spin h-4 w-4 mr-2 border-2 border-gray-900 border-t-transparent rounded-full"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Check className="h-5 w-5 mr-1" />
                      Use Photo
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-br from-gray-900 to-black">
          <ImageMusicPlayer
            generatedAudioUrl={generatedAudioUrl}
            weather={weather}
            isGenerating={isGeneratingMusic && !generatedAudioUrl}
            generationProgress={generationProgress}
          />
        </div>
      )}
    </div>
  );
};

export default Capture;
