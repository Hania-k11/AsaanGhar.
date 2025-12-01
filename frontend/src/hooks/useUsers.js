import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useUsers = ({ page, limit, sort_by, sort_order, verification_status, search, enabled = true }) => {
  const result = useQuery({
    queryKey: ['admin-users', page, limit, sort_by, sort_order, verification_status, search],
    queryFn: async () => {
      const params = {
        page,
        limit,
        sort_by,
        sort_order,
        verification_status,
        search,
      };

      const response = await axios.get('/api/admin/users', {
        params,
        withCredentials: true,
      });

      return response.data;
    },
    enabled,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
  });

  return result;
};
