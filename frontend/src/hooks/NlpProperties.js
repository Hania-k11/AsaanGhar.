import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Assuming this is your AuthContext

const fetchNlpProperties = async ({ queryKey }) => {
  const [_key, { userId, query, page, limit, filter, priceRange, sort }] = queryKey;

  const response = await axios.post(`/api/cohere/search/${userId}`, {
    user_id: userId, // Included in body for completeness, though endpoint uses :user_id
    query,
    filter, // "all", "sale", "rent"
    priceRange, // [min, max]
    sort, // e.g., "featured", "price-low", etc.
    page,
    limit,
  });

  console.log('Fetched search properties:', response.data);
  return response.data;
};

export function useNlpProperties({
  query,
  page = 1,
  limit = 6,
  filter = 'all',
  priceRange = [0, 150000000],
  sort = 'featured',
}) {
  const { userDetails } = useAuth();
  const userId = userDetails?.user_id;

  console.log('User ID:', userId);

  return useQuery({
    queryKey: ['nlpProperties', { userId, query, page, limit, filter, priceRange, sort }],
    queryFn: fetchNlpProperties,
    enabled: !!userId && !!query?.trim(), // Only fetch if userId and query are valid
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
}