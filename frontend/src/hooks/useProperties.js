import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from "../context/AuthContext";


const fetchProperties = async ({ queryKey }) => {
  const [_key, { isLoggedIn, userId, filter, searchTerm, priceRange, sortBy, currentPage, limit }] = queryKey;

  const params = {
    type: filter,
    search: searchTerm,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    sort: sortBy,
    page: currentPage,
    limit,
    ...(isLoggedIn && userId ? { user_id: userId } : {}),
  };

  console.log("Query params sent to API:", params);

  if (isLoggedIn && userId) {
    // Logged-in user endpoint
    const { data } = await axios.get(`/api/property/getallnew/${userId}`, { params });
    console.log("Fetched properties (logged-in):", data);
    return data;
  } else {
    // Guest user endpoint (or logged-in users using fallback)
    const { data } = await axios.get(`/api/property/getall`, { params });
    console.log("Fetched properties (guest):", data);
    return data;
  }
};

export default function useProperties({ filter, searchTerm, priceRange, sortBy, currentPage, limit }) {
  const { user, isLoggedIn } = useAuth();
  const userId = user?.user_id;

  return useQuery({
    queryKey: ['properties', { isLoggedIn, userId, filter, searchTerm, priceRange, sortBy, currentPage, limit }],
    queryFn: fetchProperties,
    enabled: !!searchTerm || true, // Always allow fetch even if guest
    keepPreviousData: true,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
}


