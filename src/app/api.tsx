import React from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 35.6895,
  lng: 139.7514,
};

const Map = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
  });

  const markers = [
    { lat: 35.6895, lng: 139.7514 },
    { lat: 35.6825, lng: 139.7554 },
    // ... その他のマーカー
  ];

  if (!isLoaded) return <div>Loading...</div>;

  return (
    
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={13}
    >
      {markers.map((marker, index) => (
  <Marker key={index} position={marker} />
))}
      <Marker position={center} />
    </GoogleMap>
  );
};

export default Map;