// hooks/useMyListings.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from "../context/AuthContext";

// --- API calls --------------------------------------------------------------

const fetchMyProperties = async ({ queryKey }) => {
  const [_key, { userId, filter, searchTerm, priceRange, sortBy, currentPage, limit, advancedFilters }] = queryKey;
  if (!userId) throw new Error('User ID is required');

  const params = {
    type: filter,
    search: searchTerm,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    sort: sortBy,
    page: currentPage,
    limit,
    ...advancedFilters,
    listingType: advancedFilters.listingType || filter,
  };

  const { data } = await axios.get(`/api/property/getmyproperties/${userId}`, { params });
  return data;
};

const updatePropertyStatus = async ({ propertyId, status }) => {
  const { data } = await axios.put(`/api/property/${propertyId}/status`, { status });
  return data; // { success: true, message: ... }
};

const updatePropertyDetails = async ({ propertyId, updates }) => {
  const { data } = await axios.put(`/api/property/${propertyId}`, updates);
  return data; // { success: true, message: ... }
};

const deleteProperty = async (propertyId) => {
  const { data } = await axios.delete(`/api/property/${propertyId}`);
  return data; // { success: true, message: ... }
};

const fetchPropertyStats = async (userId) => {
  if (!userId) return null;
  const { data } = await axios.get(`/api/property/stats/${userId}`);
  return data;
};

const updatePropertyListingType = async ({ propertyId, listingType }) => {
  const listing_type_id = listingType === 'sale' ? 2 : 1;
  const { data } = await axios.put(`/api/property/${propertyId}/listing-type`, { listing_type_id });
  return data; // { success: true, message: ... }
};

// --- Hooks ------------------------------------------------------------------

export const useMyProperties = ({
  filter = 'all',
  searchTerm = '',
  priceRange = [0, 9999999999],
  sortBy = 'newest',
  currentPage = 1,
  limit = 12,
  advancedFilters = {},
}) => {
  const { user, isLoggedIn } = useAuth();
  const userId = user?.user_id;

  return useQuery({
    queryKey: ['myProperties', {
      userId, filter, searchTerm, priceRange, sortBy, currentPage, limit, advancedFilters
    }],
    queryFn: fetchMyProperties,
    enabled: isLoggedIn && !!userId,
    keepPreviousData: true,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
};

export const usePropertyStats = () => {
  const { user, isLoggedIn } = useAuth();
  const userId = user?.user_id;

  return useQuery({
    queryKey: ['propertyStats', userId],
    queryFn: () => fetchPropertyStats(userId),
    enabled: isLoggedIn && !!userId,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
};

export const useUpdatePropertyListingType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePropertyListingType,
    onSuccess: (_resp, variables) => {
      const { propertyId, listingType } = variables;
      const listing_type_id = listingType === 'sale' ? 2 : 1;

      // Update ALL cached pages/filters (v4/v5 safe)
      queryClient.getQueriesData({ queryKey: ['myProperties'] }).forEach(([key, old]) => {
        if (!old?.data) return;
        const next = {
          ...old,
          data: old.data.map(p => p.property_id === propertyId
            ? { ...p, listing_type_id, listing_type_name: listingType }
            : p),
        };
        queryClient.setQueryData(key, next);
      });

      queryClient.invalidateQueries({ queryKey: ['myProperties'] });
      queryClient.invalidateQueries({ queryKey: ['propertyStats'] });
    },
    onError: (err) => {
      console.error('Error updating property listing type:', err);
    },
  });
};

export const useUpdatePropertyStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePropertyStatus,
    onSuccess: (_resp, variables) => {
      const { propertyId, status } = variables;

      queryClient.getQueriesData({ queryKey: ['myProperties'] }).forEach(([key, old]) => {
        if (!old?.data) return;
        const next = {
          ...old,
          data: old.data.map(p => p.property_id === propertyId ? { ...p, status } : p),
        };
        queryClient.setQueryData(key, next);
      });

      queryClient.invalidateQueries({ queryKey: ['myProperties'] });
      queryClient.invalidateQueries({ queryKey: ['propertyStats'] });
    },
    onError: (err) => {
      console.error('Error updating property status:', err);
    },
  });
};

export const useUpdatePropertyDetails = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePropertyDetails,
    onSuccess: (_resp, variables) => {
      const { propertyId, updates } = variables;

      // Merge the fields we just sent into every cached page
      queryClient.getQueriesData({ queryKey: ['myProperties'] }).forEach(([key, old]) => {
        if (!old?.data) return;
        const next = {
          ...old,
          data: old.data.map(p => p.property_id === propertyId ? { ...p, ...updates } : p),
        };
        queryClient.setQueryData(key, next);
      });

      queryClient.invalidateQueries({ queryKey: ['myProperties'] });
      queryClient.invalidateQueries({ queryKey: ['propertyStats'] });
    },
    onError: (err) => {
      console.error('Error updating property details:', err);
    },
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProperty, // variables = propertyId
    onSuccess: (_resp, propertyId) => {
      // Optimistically remove from ALL cached pages/filters
      queryClient.getQueriesData({ queryKey: ['myProperties'] }).forEach(([key, old]) => {
        if (!old?.data) return;
        const filtered = old.data.filter(p => p.property_id !== propertyId);
        const next = {
          ...old,
          data: filtered,
          pagination: old.pagination
            ? { ...old.pagination, total: Math.max(0, (old.pagination.total || 0) - 1) }
            : old.pagination,
        };
        queryClient.setQueryData(key, next);
      });

      queryClient.invalidateQueries({ queryKey: ['myProperties'] });
      queryClient.invalidateQueries({ queryKey: ['propertyStats'] });
    },
    onError: (err) => {
      console.error('Error deleting property:', err);
    },
  });
};
