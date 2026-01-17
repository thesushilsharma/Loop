"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import {
  createSuggestion,
  deleteSuggestion,
  getSuggestionById,
  getSuggestions,
  updateSuggestion,
  voteSuggestion,
} from "@/app/actions/suggestions";
import type { SuggestionPost } from "@/lib/types/suggestions";

// Hook for managing suggestion posts
export function useSuggestions(universityId?: number) {
  const [suggestions, setSuggestions] = useState<SuggestionPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Fetch suggestions
  const fetchSuggestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSuggestions(universityId);
      // Transform data to match SuggestionPost type with isUpVote property
      const transformedData = data.map((post) => ({
        ...post,
        isUpVote: false, // Default value for isUpVote
        user: post.user || undefined, // Convert null to undefined
      }));
      setSuggestions(transformedData);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setError("Failed to load suggestions");
    } finally {
      setLoading(false);
    }
  }, [universityId]);

  // Create a new suggestion
  const handleCreateSuggestion = useCallback(
    async (formData: FormData) => {
      try {
        const result = await createSuggestion(formData);
        if (result.error) {
          return { error: result.error };
        }
        // Refresh suggestions
        startTransition(() => {
          fetchSuggestions();
          router.refresh();
        });
        return { success: true };
      } catch (err) {
        console.error("Error creating suggestion:", err);
        return { error: "Failed to create suggestion" };
      }
    },
    [fetchSuggestions, router],
  );

  // Update a suggestion
  const handleUpdateSuggestion = useCallback(
    async (formData: FormData) => {
      try {
        const result = await updateSuggestion(formData);
        if (result.error) {
          return { error: result.error };
        }
        // Refresh suggestions
        startTransition(() => {
          fetchSuggestions();
          router.refresh();
        });
        return { success: true };
      } catch (err) {
        console.error("Error updating suggestion:", err);
        return { error: "Failed to update suggestion" };
      }
    },
    [fetchSuggestions, router],
  );

  // Delete a suggestion
  const handleDeleteSuggestion = useCallback(
    async (formData: FormData) => {
      try {
        const result = await deleteSuggestion(formData);
        if (result.error) {
          return { error: result.error };
        }
        // Refresh suggestions
        startTransition(() => {
          fetchSuggestions();
          router.refresh();
        });
        return { success: true };
      } catch (err) {
        console.error("Error deleting suggestion:", err);
        return { error: "Failed to delete suggestion" };
      }
    },
    [fetchSuggestions, router],
  );

  // Vote on a suggestion
  const handleVoteSuggestion = useCallback(
    async (formData: FormData) => {
      try {
        const result = await voteSuggestion(formData);
        if (result.error) {
          return { error: result.error };
        }
        // Refresh suggestions
        startTransition(() => {
          fetchSuggestions();
          router.refresh();
        });
        return { success: true };
      } catch (err) {
        console.error("Error voting on suggestion:", err);
        return { error: "Failed to vote on suggestion" };
      }
    },
    [fetchSuggestions, router],
  );

  // Load suggestions on mount
  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  return {
    suggestions,
    loading,
    error,
    isPending,
    createSuggestion: handleCreateSuggestion,
    updateSuggestion: handleUpdateSuggestion,
    deleteSuggestion: handleDeleteSuggestion,
    voteSuggestion: handleVoteSuggestion,
    refreshSuggestions: fetchSuggestions,
  };
}

// Hook for managing a single suggestion post
export function useSuggestion(postId: number) {
  const [suggestion, setSuggestion] = useState<SuggestionPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Fetch suggestion
  const fetchSuggestion = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSuggestionById(postId);
      if (data) {
        // Transform data to match SuggestionPost type with isUpVote property
        const transformedData = {
          ...data,
          isUpVote: false, // Default value for isUpVote
          user: data.user || undefined, // Convert null to undefined
        };
        setSuggestion(transformedData);
      } else {
        setSuggestion(null);
      }
    } catch (err) {
      console.error("Error fetching suggestion:", err);
      setError("Failed to load suggestion");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  // Update a suggestion
  const handleUpdateSuggestion = useCallback(
    async (formData: FormData) => {
      try {
        const result = await updateSuggestion(formData);
        if (result.error) {
          return { error: result.error };
        }
        // Refresh suggestion
        startTransition(() => {
          fetchSuggestion();
          router.refresh();
        });
        return { success: true };
      } catch (err) {
        console.error("Error updating suggestion:", err);
        return { error: "Failed to update suggestion" };
      }
    },
    [fetchSuggestion, router],
  );

  // Delete a suggestion
  const handleDeleteSuggestion = useCallback(
    async (formData: FormData) => {
      try {
        const result = await deleteSuggestion(formData);
        if (result.error) {
          return { error: result.error };
        }
        // Navigate back to suggestions list
        router.push("/account/suggest");
        return { success: true };
      } catch (err) {
        console.error("Error deleting suggestion:", err);
        return { error: "Failed to delete suggestion" };
      }
    },
    [router],
  );

  // Vote on a suggestion
  const handleVoteSuggestion = useCallback(
    async (formData: FormData) => {
      try {
        const result = await voteSuggestion(formData);
        if (result.error) {
          return { error: result.error };
        }
        // Refresh suggestion
        startTransition(() => {
          fetchSuggestion();
          router.refresh();
        });
        return { success: true };
      } catch (err) {
        console.error("Error voting on suggestion:", err);
        return { error: "Failed to vote on suggestion" };
      }
    },
    [fetchSuggestion, router],
  );

  // Load suggestion on mount
  useEffect(() => {
    fetchSuggestion();
  }, [fetchSuggestion]);

  return {
    suggestion,
    loading,
    error,
    isPending,
    updateSuggestion: handleUpdateSuggestion,
    deleteSuggestion: handleDeleteSuggestion,
    voteSuggestion: handleVoteSuggestion,
    refreshSuggestion: fetchSuggestion,
  };
}
