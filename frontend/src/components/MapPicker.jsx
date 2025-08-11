//src/components/MapPicker.jsx

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const MapPicker = ({ lat, lon, onPositionChange }) => {
  const [markerPosition, setMarkerPosition] = useState({ lat, lng: lon });

  useEffect(() => {
    // Sync internal marker position when external props change
    if (lat && lon) {
      setMarkerPosition({ lat, lng: lon });
    }
  }, [lat, lon]);

  const CenterUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
      if (center && Array.isArray(center) && center.length === 2) {
        map.setView(center);
      }
    }, [center, map]);
    return null;
  };

  if (!lat || !lon) {
    return <p className="mt-2 text-gray-500">Select an address to preview on the map.</p>;
  }

  return (
    <MapContainer
      center={[lat, lon]}
      zoom={15}
      className="h-[400px] z-10 w-full mt-3 rounded shadow"
    >
      <CenterUpdater center={[lat, lon]} />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker
        position={markerPosition}
        draggable={true}
        eventHandlers={{
          dragend: (e) => {
            const latLng = e.target.getLatLng();
            setMarkerPosition(latLng);
            onPositionChange(latLng);
          }
        }}
        icon={markerIcon}
      />
    </MapContainer>
  );
};

export default MapPicker;
