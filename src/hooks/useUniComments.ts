import { useQuery } from "@tanstack/react-query";
import { getUniversityComments } from "@/server/dbComments";

// Fetch comments hook
export function useComments(universityId: number) {
  return useQuery({
    queryKey: ["comments", universityId],
    queryFn: () => getUniversityComments(universityId),
    enabled: !!universityId, // Only fetch if universityId is provided
  });
}


