// src/components/AddressAutocomplete.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const DEBOUNCE_DELAY = 400; // ms

const AddressAutocomplete = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);
  const debounceTimer = useRef(null);
  const locationIqToken = import.meta.env.VITE_LOCATIONIQ_TOKEN;

  const fetchSuggestions = async (value) => {
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      let results = [];
      if (locationIqToken) {
        // Prefer LocationIQ direct API when token is available (supports CORS)
       const url = `https://us1.locationiq.com/v1/autocomplete?key=${locationIqToken}&q=${encodeURIComponent(value)}&limit=8&countrycodes=PK&viewbox=66.9000,24.7500,67.2000,25.0500&bounded=1`;
;
        const res = await axios.get(url);
        results = Array.isArray(res.data) ? res.data : [];
      } else {
        // Fallback to Nominatim if no token configured
       const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=6&countrycodes=PK&viewbox=66.9000,24.7500,67.2000,25.0500&bounded=1&q=${encodeURIComponent(value)}`;

        const res = await axios.get(url, {
          headers: { 'Accept-Language': 'en' },
        });
        // Normalize to a LocationIQ-like shape
        results = (Array.isArray(res.data) ? res.data : []).map((r) => ({
          display_name: r.display_name,
          lat: r.lat,
          lon: r.lon,
        }));
      }
      setSuggestions(results.length ? results : [{ noResults: true }]);
    } catch (error) {
      console.error('Autocomplete error:', error);
      setSuggestions([{ noResults: true }]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(value);
    }, DEBOUNCE_DELAY);
  };

  const handleSelect = (suggestion) => {
    if (suggestion.noResults) return;
    setQuery(suggestion.display_name);
    setSuggestions([]);
    onSelect({
      lat: parseFloat(suggestion.lat),
      lon: parseFloat(suggestion.lon),
      displayName: suggestion.display_name,
    });
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Add your building name, street, block etc"
        className="w-full p-2 border border-gray-300 rounded"
      />
      {suggestions.length > 0 && (
        <ul
  className="absolute z-[450] w-full mt-1 bg-white border border-gray-300 rounded shadow"
  style={{ maxHeight: '300px', overflowY: 'auto' }}
>
          {suggestions.map((s, i) =>
            s.noResults ? (
              <li key={i} className="p-2 text-gray-500 italic">
                No results
              </li>
            ) : (
              <li
                key={i}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelect(s)}
              >
                {s.display_name}
              </li>
            )
          )}
        </ul>
      )}
      {loading && (
        <div className="z-10 absolute top-full mt-1 text-sm text-gray-500">Please wait, suggestion are appearing in a second…</div>
      )}
    </div>
  );
};

export default AddressAutocomplete;