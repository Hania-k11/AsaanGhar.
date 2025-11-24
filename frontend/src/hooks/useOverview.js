// hooks/useOverview.js
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from "../context/AuthContext";

const fetchOverviewStats = async (userId) => {
  if (!userId) throw new Error('User ID is required');
  
  const { data } = await axios.get(`/api/property/overview/${userId}`);
  return data;
};

export const useOverview = () => {
  const { user, isLoggedIn } = useAuth();
  const userId = user?.user_id;

  return useQuery({
    queryKey: ['overview', userId],
    queryFn: () => fetchOverviewStats(userId),
    enabled: isLoggedIn && !!userId,
    staleTime: 30_000, // 30 seconds
    refetchOnWindowFocus: true,
    refetchInterval: 60_000, // Refetch every minute
  });
};

export default useOverview;