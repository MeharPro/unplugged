import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Location } from '../types';

interface MapProps {
  location: Location | null;
  markers: Array<{ coordinates: [number, number]; title: string }>;
}

const Map: React.FC<MapProps> = ({ location, markers }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !location) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [location.longitude, location.latitude],
      zoom: 12
    });

    return () => {
      map.current?.remove();
    };
  }, [location]);

  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    const markerElements = document.getElementsByClassName('mapboxgl-marker');
    while (markerElements[0]) {
      markerElements[0].remove();
    }

    // Add new markers
    markers.forEach(marker => {
      new mapboxgl.Marker()
        .setLngLat(marker.coordinates)
        .setPopup(new mapboxgl.Popup().setHTML(marker.title))
        .addTo(map.current!);
    });
  }, [markers]);

  return (
    <div ref={mapContainer} className="w-full h-[500px] rounded-lg shadow-lg" />
  );
};

export default Map;