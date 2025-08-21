import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const fetchNlpProperties = async ({ queryKey }) => {
  const [_key, { isLoggedIn, userId, query, page, limit, filter, priceRange, sort }] = queryKey;

  if (isLoggedIn) {
    // Logged-in user endpoint
    const response = await axios.post(`/api/cohere/search/${userId}`, {
      // user_id: userId,
      query,
      filter,
      priceRange,
      sort,
      page,
      limit,
    });
    return response.data;
  } else {
    // Guest user endpoint
    const response = await axios.post(`/api/cohereall/search`, {
      query,
      filter,
      priceRange,
      sort,
      page,
      limit,
    });
    return response.data;
  }
};

export function useNlpProperties({
  query,
  page = 1,
  limit = 6,
  filter = 'all',
  priceRange = [0, 150000000],
  sort = 'featured',
}) {
  const { userDetails, isLoggedIn } = useAuth();
  const userId = userDetails?.user_id;

  return useQuery({
    queryKey: ['nlpProperties', { isLoggedIn, userId, query, page, limit, filter, priceRange, sort }],
    queryFn: fetchNlpProperties,
    enabled: !!query?.trim(), // always require a query
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
