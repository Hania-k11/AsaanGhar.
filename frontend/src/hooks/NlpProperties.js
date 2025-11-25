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

  if (isLoggedIn) {
    const response = await axios.post(`/api/searchuser/nlp-search/${userId}`, payload);
    return response.data;
  } else {
    const response = await axios.post(`/api/search/nlp-search`, payload);
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
