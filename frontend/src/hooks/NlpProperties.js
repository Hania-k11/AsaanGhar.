import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const fetchNlpProperties = async ({ queryKey }) => {
  const [
    _key,
    userKey,
    query,
    page,
    limit,
    filter,
    minPrice,
    maxPrice,
    sort
  ] = queryKey;

  const isLoggedIn = userKey !== 'guest';
  const userId = isLoggedIn ? userKey : null;

  const payload = {
    query,
    filter,
    priceRange: [minPrice, maxPrice],
    sort,
    page,
    limit,
  };

  try {
    if (isLoggedIn) {
      const response = await axios.post(`/api/searchuser/nlp-search/${userId}`, payload);
      return response.data;
    } else {
      const response = await axios.post(`/api/search/nlp-search`, payload);
      return response.data;
    }
  } catch (error) {
    // Check if this is a non-real-estate query error
    if (error.response?.data?.isNotRealEstate) {
      // Throw a custom error object with the message
      const customError = new Error(error.response.data.message || 'Please search in the real estate domain only');
      customError.isNotRealEstate = true;
      throw customError;
    }
    // Re-throw other errors
    throw error;
  }
};

export function useNlpProperties({
  query,
  page = 1,
  limit = 6,
  filter = 'all',
  priceRange = [0, 150000000],
  sort = 'featured',
  enabled = true,
}) {
  const { user, isLoggedIn } = useAuth();
  const userKey = isLoggedIn ? user?.user_id : 'guest';

  return useQuery({
    queryKey: [
      'nlpProperties',
      userKey,
      query,
      page,
      limit,
      filter,
      priceRange[0],
      priceRange[1],
      sort,
    ],
    queryFn: fetchNlpProperties,
    enabled: enabled && !!query?.trim(),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
