// src/hooks/useAdmin.js
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchProperties = async ({ queryKey }) => {
  const [_key, { page, limit, sort_by, sort_order, status }] = queryKey;

  const res = await axios.get("/api/admin/properties", {
    params: { 
      page, 
      limit, 
      sort_by, 
      sort_order, 
      status: status || 'all'
    },
    withCredentials: true,
  });

  return res.data;
};

export const useAdmin = ({ page, limit, sort_by, sort_order, status, enabled = true }) => {
  return useQuery({
    queryKey: ["properties", { page, limit, sort_by, sort_order, status }],
    queryFn: fetchProperties,
    enabled, // Only run query when enabled is true
    keepPreviousData: true, // smooth pagination
    staleTime: 60 * 1000, // 1 min cache
  });
};
