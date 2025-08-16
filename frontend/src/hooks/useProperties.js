import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from "../context/AuthContext";

const fetchProperties = async ({ queryKey }) => {
  const [_key, { userId, filter, searchTerm, priceRange, sortBy, currentPage, limit }] = queryKey;

  const params = {
    type: filter,
    search: searchTerm,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    sort: sortBy,
    page: currentPage,
    limit,
  };

  console.log("Query params sent to API:", params); // Debug query params
  const { data } = await axios.get(`/api/property/getallnew/${userId}`, { params });
  console.log("Fetched properties:", data);
  console.log("Fetched properties array:", data.data);
  return data;
  
};

export default function useProperties({ filter, searchTerm, priceRange, sortBy, currentPage, limit }) {
  const { userDetails } = useAuth(); // ✅ Inside hook, valid
  const userId = userDetails?.user_id;

  return useQuery({
    queryKey: ['properties', { userId, filter, searchTerm, priceRange, sortBy, currentPage, limit }],
    queryFn: fetchProperties,
    enabled: !!userId, // ❌ Only fetch if userId exists
    keepPreviousData: true,
    staleTime: 1000 * 60 * 1,
    refetchOnWindowFocus: false,
  });
}
