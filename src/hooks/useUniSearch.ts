"use client"
import { fetchUniversities } from "@/app/actions/search"
import { useQuery } from "@tanstack/react-query"
import { useQueryState } from "nuqs"


export function useUniSearchFilterQuery() {
  const [query] = useQueryState("query")
  const [sortBy] = useQueryState("sortBy")

  return useQuery({
    queryKey: ["search", query, sortBy],
    queryFn: () => {
      const formData = new FormData()
      if (query) formData.append("query", query)
      if (sortBy) formData.append("sortBy", sortBy)
      return fetchUniversities(formData)
    },
    staleTime: 120000, // Cache for 120 seconds
    refetchInterval: 45000, // Auto-refetch every 45 seconds
    refetchOnWindowFocus: true, // Refetch when user focuses on the page
    retry: 1, // Retry once on failure
  })
}