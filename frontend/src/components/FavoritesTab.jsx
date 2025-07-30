// src/components/FavoritesTab.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HeartOff, MapPin } from "lucide-react";

const FavoritesTab = () => {
  const [favorites, setFavorites] = useState([]); // Start with empty array
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulate fetching favorites from a backend
  const fetchFavorites = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay
      const data = [
        {
          id: 1,
          title: "Modern Studio in Islamabad",
          location: "F-11, Islamabad",
          image: "https://source.unsplash.com/400x300/?studio",
          price: "PKR 55,000/month",
        },
        {
          id: 2,
          title: "Beachfront Villa in Karachi",
          location: "Clifton, Karachi",
          image: "https://source.unsplash.com/400x300/?villa",
          price: "PKR 8 Crore",
        },
        {
          id: 3,
          title: "Spacious House in Lahore",
          location: "Defence, Lahore",
          image: "https://source.unsplash.com/400x300/?lahore-house",
          price: "PKR 2.2 Crore",
        },
      ];
      setFavorites(data);
    } catch (err) {
      setError("Failed to load favorites.");
      console.error("Error fetching favorites:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (id) => {
    if (window.confirm("Are you sure you want to remove this from favorites?")) {
      // Simulate API call to remove favorite
      // try {
      //   await axios.delete(`/api/favorites/${id}`);
      //   setFavorites(prev => prev.filter(fav => fav.id !== id));
      // } catch (err) {
      //   console.error("Failed to remove favorite:", err);
      //   // Show error to user
      // }

      // For demonstration, immediately remove from UI
      setFavorites(prev => prev.filter(fav => fav.id !== id));
      alert(`Favorite ${id} removed! (Simulated)`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-gray-700">Loading favorites...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-gray-500">No favorite properties yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Added lg:grid-cols-3 */}
      {favorites.map((fav, i) => (
        <motion.div
          key={fav.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-white rounded-xl shadow-md overflow-hidden border"
        >
          <img src={fav.image} alt={fav.title} className="h-48 w-full object-cover" />
          <div className="p-4 space-y-2">
            <h3 className="text-lg font-semibold">{fav.title}</h3>
            <p className="flex items-center text-sm text-gray-500">
              <MapPin size={14} className="text-emerald-500 mr-1" /> {fav.location}
            </p>
            <p className="text-emerald-600 font-bold">{fav.price}</p>
            <button
              onClick={() => handleRemoveFavorite(fav.id)}
              className="mt-3 flex items-center gap-2 text-sm bg-red-50 text-red-600 px-3 py-1 rounded-lg hover:bg-red-100"
              aria-label={`Remove ${fav.title} from favorites`}
            >
              <HeartOff size={14} /> Remove
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default FavoritesTab;