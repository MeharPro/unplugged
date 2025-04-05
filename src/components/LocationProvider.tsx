import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from '@/components/ui/use-toast';

interface LocationContextType {
  userLocation: { latitude: number; longitude: number } | null;
  isLoading: boolean;
  error: string | null;
  requestLocation: () => void;
}

const LocationContext = createContext<LocationContextType>({
  userLocation: null,
  isLoading: false,
  error: null,
  requestLocation: () => {}
});

export const useLocation = () => useContext(LocationContext);

interface LocationProviderProps {
  children: React.ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      toast({
        title: 'Location Not Available',
        description: 'Geolocation is not supported by your browser.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Location obtained:', position.coords);
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setIsLoading(false);
        
        // Save to localStorage for persistence
        localStorage.setItem('unplugged_user_location', JSON.stringify({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: Date.now()
        }));
      },
      (error) => {
        console.error('Error getting location:', error);
        setError(`Unable to retrieve your location: ${error.message}`);
        setIsLoading(false);
        
        toast({
          title: 'Location Access Denied',
          description: 'Please enable location services to get personalized recommendations.',
          variant: 'destructive'
        });
      },
      geoOptions
    );
  };

  // Request location immediately on component mount
  useEffect(() => {
    // Check if we have a recent location in localStorage (less than 30 minutes old)
    const savedLocation = localStorage.getItem('unplugged_user_location');
    if (savedLocation) {
      try {
        const parsedLocation = JSON.parse(savedLocation);
        const timestamp = parsedLocation.timestamp || 0;
        const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000;
        
        if (timestamp > thirtyMinutesAgo) {
          // Use the saved location if it's recent
          setUserLocation({
            latitude: parsedLocation.latitude,
            longitude: parsedLocation.longitude
          });
          console.log('Using saved location:', parsedLocation);
          return;
        }
      } catch (e) {
        console.error('Error parsing saved location:', e);
      }
    }
    
    // If no recent location is found, request a new one
    requestLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ userLocation, isLoading, error, requestLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export default LocationProvider;
