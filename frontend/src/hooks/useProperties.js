import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchProperties = async ({ queryKey }) => {
  const [_key, { filter, searchTerm, priceRange, sortBy, currentPage, limit }] = queryKey;

  const params = {
    type: filter,
    search: searchTerm,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    sort: sortBy,
    page: currentPage,
    limit,
  };

  const { data } = await axios.get('/api/properties/getall', { params });
  return data;
};

export default function useProperties({ filter, searchTerm, priceRange, sortBy, currentPage, limit }) {
  return useQuery({
    queryKey: ['properties', { filter, searchTerm, priceRange, sortBy, currentPage, limit }],
    queryFn: fetchProperties,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 1, // 1 minute
    refetchOnWindowFocus: false,
  });
}
