// src/hooks/useAdmin.js
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchProperties = async ({ queryKey }) => {
  const [_key, { page, limit, sort_by, sort_order, status, search }] = queryKey;

  const res = await axios.get("/api/admin/properties", {
    params: { 
      page, 
      limit, 
      sort_by, 
      sort_order, 
      status: status || 'all',
      search: search || ''
    },
    withCredentials: true,
  });

  return res.data;
};

export const useAdmin = ({ page, limit, sort_by, sort_order, status, search = '', enabled = true }) => {
  return useQuery({
    queryKey: ["properties", { page, limit, sort_by, sort_order, status, search }],
    queryFn: fetchProperties,
    enabled, // Only run query when enabled is true
    keepPreviousData: true, // smooth pagination
    staleTime: 60 * 1000, // 1 min cache
  });
};
