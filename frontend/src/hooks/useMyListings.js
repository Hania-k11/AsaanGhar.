// hooks/useMyListings.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from "../context/AuthContext";

// Fetch user's own properties
const fetchMyProperties = async ({ queryKey }) => {
  const [_key, { userId, filter, searchTerm, priceRange, sortBy, currentPage, limit, advancedFilters }] = queryKey;

  if (!userId) {
    throw new Error('User ID is required');
  }

  const params = {
    type: filter,
    search: searchTerm,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    sort: sortBy,
    page: currentPage,
    limit,
    // Add advanced filters
    ...advancedFilters,
    listingType: advancedFilters.listingType || filter
  };

  console.log("Fetching my properties with params:", params);

  const { data } = await axios.get(`/api/property/getmyproperties/${userId}`, { params });
  console.log("Fetched my properties:", data);
  return data;
};

// Update property status
const updatePropertyStatus = async ({ propertyId, status }) => {
  const { data } = await axios.put(`/api/property/${propertyId}/status`, { status });
  return data;
};

// Update property details
const updatePropertyDetails = async ({ propertyId, updates }) => {
  const { data } = await axios.put(`/api/property/${propertyId}`, updates);
  return data;
};

// Delete property
const deleteProperty = async (propertyId) => {
  const { data } = await axios.delete(`/api/property/${propertyId}`);
  return data;
};

// Get property statistics
const fetchPropertyStats = async (userId) => {
  if (!userId) return null;
  const { data } = await axios.get(`/api/property/stats/${userId}`);
  return data;
};

export const useMyProperties = ({ 
  filter = 'all', 
  searchTerm = '', 
  priceRange = [0, 9999999999], 
  sortBy = 'newest', 
  currentPage = 1, 
  limit = 12,
  advancedFilters = {}
}) => {
  const { user, isLoggedIn } = useAuth();
  const userId = user?.user_id;
  console.log("useMyProperties is enabled:", isLoggedIn && !!userId);

  return useQuery({
    queryKey: ['myProperties', { 
      userId, 
      filter, 
      searchTerm, 
      priceRange, 
      sortBy, 
      currentPage, 
      limit, 
      advancedFilters 
    }],
    queryFn: fetchMyProperties,
    enabled: isLoggedIn && !!userId,
    keepPreviousData: true,
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: false,
  });
};

// new mutation function
const updatePropertyListingType = async ({ propertyId, listingType }) => {
  const listingTypeId = listingType === 'sale' ? 2 : 1;
  const { data } = await axios.put(`/api/property/${propertyId}/listing-type`, { listing_type_id: listingTypeId });
  return data;
};

//  new hook export
export const useUpdatePropertyListingType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePropertyListingType,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['myProperties']);
      queryClient.invalidateQueries(['propertyStats']);
      
      queryClient.setQueriesData(['myProperties'], (oldData) => {
        if (!oldData?.data) return oldData;
        
        return {
          ...oldData,
          data: oldData.data.map(property => 
            property.property_id === variables.propertyId 
              ? { ...property, listing_type_id: variables.listingType === 'sale' ? 2 : 1, listing_type_name: variables.listingType }
              : property
          )
        };
      });
    },
    onError: (error) => {
      console.error('Error updating property listing type:', error);
    }
  });
};


export const usePropertyStats = () => {
  const { user, isLoggedIn } = useAuth();
  const userId = user?.user_id;

  return useQuery({
    queryKey: ['propertyStats', userId],
    queryFn: () => fetchPropertyStats(userId),
    enabled: isLoggedIn && !!userId,
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
  });
};

export const useUpdatePropertyStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePropertyStatus,
    onSuccess: (data, variables) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries(['myProperties']);
      queryClient.invalidateQueries(['propertyStats']);
      
      // Optionally update the cache directly for immediate UI update
      queryClient.setQueriesData(['myProperties'], (oldData) => {
        if (!oldData?.data) return oldData;
        
        return {
          ...oldData,
          data: oldData.data.map(property => 
            property.property_id === variables.propertyId 
              ? { ...property, status: variables.status }
              : property
          )
        };
      });
    },
    onError: (error) => {
      console.error('Error updating property status:', error);
    }
  });
};


export const useUpdatePropertyDetails = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePropertyDetails,
    onSuccess: (updatedPropertyData) => {
      // 1. Immediately update the cache with the new data
      queryClient.setQueriesData(['myProperties'], (oldData) => {
        if (!oldData?.data) return oldData;
        
        // Find the updated property and replace it
        return {
          ...oldData,
          data: oldData.data.map(property => 
            property.property_id === updatedPropertyData.property_id
              ? updatedPropertyData
              : property
          )
        };
      });

      // 2. Invalidate to trigger a fresh fetch in the background
      queryClient.invalidateQueries(['myProperties']);
      queryClient.invalidateQueries(['propertyStats']);
    },
    onError: (error) => {
      console.error('Error updating property details:', error);
    }
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProperty,
    onSuccess: (data, propertyId) => {
      // Remove from cache immediately for instant UI feedback
      queryClient.setQueriesData(['myProperties'], (oldData) => {
        if (!oldData?.data) return oldData;
        
        return {
          ...oldData,
          data: oldData.data.filter(property => property.property_id !== propertyId),
          pagination: {
            ...oldData.pagination,
            total: Math.max(0, (oldData.pagination?.total || 0) - 1)
          }
        };
      });

      // Invalidate to ensure fresh data
      queryClient.invalidateQueries(['myProperties']);
      queryClient.invalidateQueries(['propertyStats']);
    },
    onError: (error) => {
      console.error('Error deleting property:', error);
    }
  });
};