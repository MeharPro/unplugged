import React, { useState, useEffect } from 'react';
import { Location, WeatherData, SearchResult } from './types';
import Map from './components/Map';
import SearchBar from './components/SearchBar';
import ResultsList from './components/ResultsList';

function App() {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [markers, setMarkers] = useState<Array<{ coordinates: [number, number]; title: string }>>([]);
  const [error, setError] = useState<string>('');
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setUserLocation(location);
          fetchWeather(location.latitude, location.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Please enable location services to get personalized recommendations.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  }, []);

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}&units=metric`
      );
      if (!response.ok) {
        throw new Error('Weather data fetch failed');
      }
      const data = await response.json();
      if (!data.main || !data.weather || !data.weather[0]) {
        throw new Error('Invalid weather data format');
      }
      const weatherData = {
        temp: data.main.temp,
        description: data.weather[0].description,
        main: data.weather[0].main
      };
      setWeather(weatherData);
      return weatherData;
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError('Failed to fetch weather data. Some recommendations might be limited.');
      return null;
    }
  };

  const getWeatherBasedQuery = (weather: WeatherData) => {
    // Weather-based POI recommendations
    if (weather.temp > 25) {
      return 'beach OR water park OR swimming pool';
    } else if (weather.temp > 20 && weather.main === 'Clear') {
      return 'park OR outdoor cafe OR garden';
    } else if (weather.main === 'Rain') {
      return 'museum OR cinema OR indoor shopping mall';
    } else if (weather.temp < 10) {
      return 'cafe OR restaurant OR indoor activity';
    } else if (weather.main === 'Snow') {
      return 'ski resort OR winter sports';
    }
    return 'restaurant OR cafe'; // default fallback
  };

  const searchPlaces = async (query: string, lat?: number, lon?: number) => {
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
      // Refresh weather data
      const currentWeather = await fetchWeather(userLocation.latitude, userLocation.longitude);
      
      if (currentWeather) {
        const searchQuery = getWeatherBasedQuery(currentWeather);
        await searchPlaces(searchQuery, userLocation.latitude, userLocation.longitude);
      } else {
        // Fallback if weather data isn't available
        await searchPlaces('popular attractions', userLocation.latitude, userLocation.longitude);
      }
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Explore Places</h1>
        
        {weather && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
            Current weather: {weather.temp}°C, {weather.description}
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <SearchBar onSearch={handleSearch} onExplore={handleExplore} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <ResultsList
              results={searchResults}
              onResultSelect={handleResultSelect}
            />
          </div>
          <div>
            <Map location={userLocation} markers={markers} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;