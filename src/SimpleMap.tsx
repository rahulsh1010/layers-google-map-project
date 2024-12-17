// src/components/SimpleMap.tsx
import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const SimpleMap: React.FC = () => {

  // Default center of the map (latitude, longitude) - San Francisco
  const defaultCenter = { lat: 37.7749, lng: -122.4194 };

  // Map container style - full screen (or adjust as needed)
  const containerStyle = {
    width: '100%',
    height: '100vh',
  };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={12}
      >
        {/* You can add markers or other elements here */}
      </GoogleMap>
    </LoadScript>
  );
};

export default SimpleMap;
