"use client";

import { getPosts } from "@/app/actions/posts.actions";
import { keepPreviousData, useQuery } from "@tanstack/react-query";


/**
 * Custom hook for fetching university discussions using TanStack Query
 * @param universityId - The ID of the university to fetch discussions for
 */
export function useDiscussions(universityId: string) {
  return useQuery({
    queryKey: ["discussions", universityId],
    queryFn: () => getPosts(universityId),
    staleTime: 60000, // Cache for 60 seconds
    refetchInterval: 300000, // Auto-refetch every 5 minutes
    refetchOnWindowFocus: true, // Refetch when user focuses on the page
    retry: 2, // Retry twice on failure
    placeholderData: keepPreviousData,
  });
}