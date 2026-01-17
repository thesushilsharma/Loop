"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getReviews } from "@/app/actions/reviews.actions";

/**
 * Custom hook for fetching university reviews using TanStack Query
 * @param universityId - The ID of the university to fetch reviews for
 */
export function useReviews(universityId: string) {
  return useQuery({
    queryKey: ["reviews", universityId],
    queryFn: () => getReviews(universityId),
    staleTime: 60000, // Cache for 60 seconds
    refetchInterval: 300000, // Auto-refetch every 5 minutes
    refetchOnWindowFocus: true, // Refetch when user focuses on the page
    retry: 2, // Retry twice on failure
    placeholderData: keepPreviousData,
  });
}
