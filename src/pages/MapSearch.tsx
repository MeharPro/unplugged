import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Location, SearchResult } from "@/types/map-search";
import SearchBar from "@/components/map-search/SearchBar";
import ResultsList from "@/components/map-search/ResultsList";
import Map from "@/components/map-search/Map";
import { motion } from "framer-motion";

const MapSearch = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("search") || "";

  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [markers, setMarkers] = useState<Array<{ coordinates: [number, number]; title: string }>>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Get user location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Unable to get your location. Some features may be limited.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser. Some features may be limited.");
    }
  }, []);

  // If there's an initial search query, perform search when component mounts and location is available
  useEffect(() => {
    if (initialQuery && userLocation) {
      searchPlaces(initialQuery, userLocation.latitude, userLocation.longitude);
    }
  }, [initialQuery, userLocation]);

  const searchPlaces = async (query: string, lat?: number, lon?: number) => {
    setIsLoading(true);
    try {
      // Special handling for specific search terms
      let searchQuery = query.toLowerCase();
      let types = 'poi';

      // Handle specific POI types
      if (searchQuery.includes('lookout') || searchQuery.includes('viewpoint')) {
        searchQuery = 'scenic overlook OR observation deck OR viewpoint';
        types = 'poi';
      } else if (searchQuery.includes('beach')) {
        searchQuery = 'beach';
        types = 'poi';
      }

      // Build the search parameters
      const params = new URLSearchParams({
        q: searchQuery,
        access_token: import.meta.env.VITE_MAPBOX_API_KEY,
        limit: '10',
        language: 'en',
        types: types,
      });

      // Add proximity if we have user location
      if (lat && lon) {
        params.append('proximity', `${lon},${lat}`);
      }

      const response = await fetch(
        `https://api.mapbox.com/search/searchbox/v1/forward?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error('Places search failed');
      }

      const data = await response.json();

      if (!data.features) {
        throw new Error('Invalid search response format');
      }

      // Transform and filter the features
      const results: SearchResult[] = data.features
        .filter((feature: any) => {
          const props = feature.properties;
          // Ensure we're getting POIs and filter out irrelevant results
          return props.feature_type === 'poi';
        })
        .map((feature: any) => ({
          id: feature.properties.mapbox_id,
          name: feature.properties.name,
          address: feature.properties.full_address || feature.properties.place_formatted,
          coordinates: feature.geometry.coordinates
        }));

      setSearchResults(results);
      setMarkers(results.map(r => ({
        coordinates: r.coordinates,
        title: r.name
      })));
      setError(''); // Clear any previous errors
    } catch (err) {
      console.error('Error searching places:', err);
      setError('Failed to search places. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    if (userLocation) {
      searchPlaces(query, userLocation.latitude, userLocation.longitude);
    } else {
      searchPlaces(query);
    }
  };

  const handleExplore = async () => {
    if (!userLocation) {
      setError('Location is required for exploration. Please enable location services.');
      return;
    }

    try {
      // For simplicity, just search for popular attractions
      await searchPlaces('popular attractions', userLocation.latitude, userLocation.longitude);
    } catch (err) {
      console.error('Error exploring places:', err);
      setError('Failed to get recommendations. Please try again.');
    }
  };

  const handleResultSelect = (result: SearchResult) => {
    setMarkers([{
      coordinates: result.coordinates,
      title: result.name
    }]);
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      <div className="container mx-auto px-4 pb-24 max-w-6xl">
        {/* Header */}
        <motion.div
          className="py-6 flex items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="mr-3"
            onClick={handleBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Explore Places</h1>
            <p className="text-sm text-gray-600">
              Discover parks, trails, and outdoor spaces
            </p>
          </div>
        </motion.div>

        {error && (
          <motion.div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        <motion.div
          variants={item}
          initial="hidden"
          animate="show"
        >
          <SearchBar
            onSearch={handleSearch}
            onExplore={handleExplore}
            initialQuery={initialQuery}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <motion.div
            className="space-y-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>
            ) : (
              <ResultsList
                results={searchResults}
                onResultSelect={handleResultSelect}
              />
            )}
          </motion.div>
          <motion.div
            variants={item}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.2 }}
          >
            <Map location={userLocation} markers={markers} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MapSearch;
