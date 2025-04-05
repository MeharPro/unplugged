import { Location } from "@/types/map-search";

// Define types for place data
export interface Place {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  distance?: string; // Human-readable distance
  distanceMeters?: number; // Raw distance in meters
  type: string;
  image?: string;
  sunExposure?: "Low" | "Medium" | "High";
}

// Categories for different place types
export const placeCategories = {
  parks: ["park", "garden", "nature reserve", "national park", "state park", "playground"],
  trails: ["trail", "hiking", "path", "walking trail", "nature trail", "mountain", "forest"],
  cafes: ["cafe", "coffee", "restaurant", "outdoor seating", "patio"],
  beaches: ["beach", "shore", "coast", "bay", "lake", "waterfront"],
  viewpoints: ["viewpoint", "lookout", "observation", "vista", "scenic view"],
};

// Function to calculate distance between two points
export function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance; // Distance in meters
}

// Format distance for display
export function formatDistance(meters: number, measurementSystem: string = "metric"): string {
  if (measurementSystem === "imperial") {
    // Convert to miles
    const miles = meters / 1609.34;
    if (miles < 0.1) {
      return "nearby";
    } else if (miles < 1) {
      return `${(miles * 5280).toFixed(0)} ft away`;
    } else {
      return `${miles.toFixed(1)} mi away`;
    }
  } else {
    // Metric system
    if (meters < 100) {
      return "nearby";
    } else if (meters < 1000) {
      return `${meters.toFixed(0)} m away`;
    } else {
      return `${(meters / 1000).toFixed(1)} km away`;
    }
  }
}

// Fetch places from Mapbox API
export async function fetchPlaces(
  category: string,
  userLocation: Location,
  limit: number = 5
): Promise<Place[]> {
  try {
    // Get search terms for the category
    const searchTerms = placeCategories[category as keyof typeof placeCategories] || [category];
    const searchQuery = searchTerms.join(" OR ");
    
    // Build the search parameters
    const params = new URLSearchParams({
      q: searchQuery,
      access_token: import.meta.env.VITE_MAPBOX_API_KEY,
      limit: limit.toString(),
      language: 'en',
      types: 'poi',
      proximity: `${userLocation.longitude},${userLocation.latitude}`,
    });

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

    // Get measurement system preference
    const measurementSystem = localStorage.getItem("unplugged_measurement_system") || "metric";

    // Transform and filter the features
    const places: Place[] = data.features
      .filter((feature: any) => {
        const props = feature.properties;
        // Ensure we're getting POIs
        return props.feature_type === 'poi';
      })
      .map((feature: any) => {
        const coordinates = feature.geometry.coordinates as [number, number];
        const distanceMeters = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          coordinates[1],
          coordinates[0]
        );
        
        // Determine sun exposure based on feature properties or randomly assign
        const sunExposure = getSunExposure(feature.properties.category);
        
        return {
          id: feature.properties.mapbox_id,
          name: feature.properties.name,
          address: feature.properties.full_address || feature.properties.place_formatted || "",
          coordinates: coordinates,
          distance: formatDistance(distanceMeters, measurementSystem),
          distanceMeters: distanceMeters,
          type: category,
          sunExposure: sunExposure,
          // We'll use placeholder images for now
          image: getPlaceholderImage(category)
        };
      })
      .sort((a, b) => (a.distanceMeters || 0) - (b.distanceMeters || 0));

    return places;
  } catch (error) {
    console.error("Error fetching places:", error);
    return [];
  }
}

// Get a placeholder image based on place type
function getPlaceholderImage(category: string): string {
  const images: Record<string, string[]> = {
    parks: [
      "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=500&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=500&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?w=500&auto=format&fit=crop&q=60"
    ],
    trails: [
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=500&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1510077143771-1b6a7efe2be5?w=500&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1501554728187-ce583db33af7?w=500&auto=format&fit=crop&q=60"
    ],
    cafes: [
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=500&auto=format&fit=crop&q=60"
    ],
    beaches: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=500&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1520454974749-611b7248ffdb?w=500&auto=format&fit=crop&q=60"
    ],
    viewpoints: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=500&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500&auto=format&fit=crop&q=60"
    ]
  };

  const categoryImages = images[category] || images.parks;
  const randomIndex = Math.floor(Math.random() * categoryImages.length);
  return categoryImages[randomIndex];
}

// Determine sun exposure based on place category or properties
function getSunExposure(category?: string): "Low" | "Medium" | "High" {
  if (!category) {
    // Random assignment if no category
    const random = Math.random();
    if (random < 0.33) return "Low";
    if (random < 0.66) return "Medium";
    return "High";
  }
  
  const lowSunCategories = ["forest", "woods", "cave"];
  const highSunCategories = ["beach", "plaza", "viewpoint", "lookout"];
  
  const categoryLower = category.toLowerCase();
  
  if (lowSunCategories.some(c => categoryLower.includes(c))) {
    return "Low";
  }
  
  if (highSunCategories.some(c => categoryLower.includes(c))) {
    return "High";
  }
  
  return "Medium";
}
