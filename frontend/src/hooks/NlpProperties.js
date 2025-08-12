import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchNlpProperties = async ({ queryKey }) => {
  const [_key, { query, page, limit, filter, priceRange, sort }] = queryKey;
  const { data } = await axios.post(
    `/api/cohere/search?page=${page}&limit=${limit}`,
    {
      query,
      filter,     // "all", "sale", "rent"
      priceRange, // [min, max]
      sort, 
    page,
    limit,      // e.g., "featured", "price-low", etc.
    }
  );
  return data;
};

export function useNlpProperties({
  query,
  page = 1,
  limit = 6,
  filter = 'all',
  priceRange = [0, 150000000],
  sort = 'featured',
}) {
  return useQuery({
    queryKey: ['nlpProperties', { query, page, limit, filter, priceRange, sort }],
    queryFn: fetchNlpProperties,
    enabled: !!query?.trim(),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
