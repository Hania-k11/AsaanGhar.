import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const DEBOUNCE_DELAY = 400;

const ALLOWED_AREAS = ["Gulshan", "Johar", "DHA", "PECHS", "Scheme 33"];

function isAllowed(displayName) {
  return ALLOWED_AREAS.some(area =>
    displayName.toLowerCase().includes(area.toLowerCase())
  );
}


const AddressAutocomplete = ({ value, onSelect }) => {
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastSelected, setLastSelected] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const containerRef = useRef(null);
  const debounceTimer = useRef(null);
  const locationIqToken = import.meta.env.VITE_LOCATIONIQ_TOKEN;
  const errorRef = useRef(null); 

  useEffect(() => {
    setQuery(value || ""); // sync with parent
  }, [value]);

  useEffect(() => {
    
    if (errorMsg && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [errorMsg]);

  const fetchSuggestions = async (input) => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      let results = [];
      if (locationIqToken) {
     const res = await axios.get("/api/locationiq/autocomplete", {
        params: { q: input },
      });
      console.log("📡 LocationIQ (via backend) raw response:", res.data);
      results = Array.isArray(res.data) ? res.data : [];

      } else {
        const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=6&countrycodes=PK&viewbox=66.9000,24.7500,67.2000,25.0500&bounded=1&q=${encodeURIComponent(
          input
        )}`;
        const res = await axios.get(url, {
          headers: { "Accept-Language": "en" },
        });
        results = (Array.isArray(res.data) ? res.data : []).map((r) => ({
          display_name: r.display_name,
          lat: r.lat,
          lon: r.lon,
        }));
      }
      setSuggestions(results.length ? results : [{ noResults: true }]);
    } catch (error) {
      console.error("Autocomplete error:", error);
      setSuggestions([{ noResults: true }]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setLastSelected(null);

    if (!val.trim()) {
      setSuggestions([]);
      setErrorMsg("");
      onSelect(null); 
      return;
    }

    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(val);
    }, DEBOUNCE_DELAY);
  };

  const handleSelect = (suggestion) => {
  if (suggestion.noResults) return;

 
  if (!isAllowed(suggestion.display_name)) {
    
    setQuery(""); 
    setSuggestions([]);
    setErrorMsg("Sorry, we only deal in Gulshan, Johar, DHA, PECHS, and Scheme 33. Please search within these locations.");
    onSelect(null); 
    return;
  }

  // ✅ Otherwise accept normally
  setQuery(suggestion.display_name);
  setSuggestions([]);
  setLastSelected(suggestion);
  setErrorMsg("");
  onSelect({
    lat: parseFloat(suggestion.lat),
    lon: parseFloat(suggestion.lon),
    displayName: suggestion.display_name,
  });
};


  const handleBlur = () => {
    if (!lastSelected || query !== lastSelected.display_name) {
      setQuery("");
      setErrorMsg(
        "Please select an address from autocomplete/suggestion list."
      );
      onSelect(null); 
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Add your building name, street, block etc"
        className="w-full p-2 border border-gray-300 rounded"
      />
      {suggestions.length > 0 && (
        <ul
          className="absolute z-[450] w-full mt-1 bg-white border border-gray-300 rounded shadow"
          style={{ maxHeight: "300px", overflowY: "auto" }}
        >
          {suggestions.map((s, i) =>
            s.noResults ? (
              <li key={i} className="p-2 text-gray-500 italic">
                No results
                <div className="mt-1 text-yellow-600 bg-yellow-50 p-2 rounded border border-yellow-200 text-sm">
                  Can't find your exact location? Try typing the{" "}
                  <strong>nearest landmark</strong>, your{" "}
                  <strong>building name</strong>, or a{" "}
                  <strong>main road nearby</strong>.
                </div>
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
        <div className="z-[450] absolute top-full mt-1 text-sm text-gray-500">
          Please wait, suggestions are appearing in a second…
        </div>
      )}
      {errorMsg && (
        <div className="mt-1 text-sm text-red-500">{errorMsg}</div>
      )}
    </div>
  );
};


export default AddressAutocomplete;
