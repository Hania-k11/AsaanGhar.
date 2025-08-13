import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const MapPicker = ({ lat, lon, onPositionChange }) => {
  const defaultLat = 24.8607; // Karachi
  const defaultLon = 67.0011;

  const [markerPosition, setMarkerPosition] = useState({
    lat: lat || defaultLat,
    lng: lon || defaultLon
  });

  useEffect(() => {
    if (lat && lon) {
      setMarkerPosition({ lat, lng: lon });
    }
  }, [lat, lon]);

  // Reverse Geocode function to get address from lat/lon
  const reverseGeocode = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await res.json();
      if (data?.display_name) {
        // Pass lat, lon and address back to parent
        onPositionChange({ lat, lng: lon, address: data.display_name });
      } else {
        onPositionChange({ lat, lng: lon, address: '' });
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      onPositionChange({ lat, lng: lon, address: '' });
    }
  };

  const CenterUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(center);
    }, [center, map]);
    return null;
  };

  return (
    <MapContainer
      center={[markerPosition.lat, markerPosition.lng]}
      zoom={15}
      className="h-[400px] z-10 w-full mt-3 rounded shadow"
    >
      <CenterUpdater center={[markerPosition.lat, markerPosition.lng]} />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Show marker only if user has selected a location */}
      {lat && lon && (
        <Marker
          position={markerPosition}
          draggable={true}
          eventHandlers={{
            dragend: (e) => {
              const latLng = e.target.getLatLng();
              setMarkerPosition(latLng);
              // Call reverse geocode here
              reverseGeocode(latLng.lat, latLng.lng);
            }
          }}
          icon={markerIcon}
        />
      )}
    </MapContainer>
  );
};

export default MapPicker;
