"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import {
  createSuggestionComment,
  deleteSuggestionComment,
  getSuggestionComments,
  updateSuggestionComment,
  voteSuggestionComment,
} from "@/app/actions/suggestionComments";
import type { SuggestionComment } from "@/lib/types/suggestions";

// Hook for managing comments on a suggestion post
export function useSuggestionComments(postId: number) {
  const [comments, setComments] = useState<SuggestionComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Fetch comments
  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSuggestionComments(postId);
      // Transform data to match SuggestionComment type
      const transformedData = data.map((comment) => ({
        ...comment,
        user: comment.user === null ? undefined : comment.user,
      }));
      setComments(transformedData);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError("Failed to load comments");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  // Create a new comment
  const handleCreateComment = useCallback(
    async (formData: FormData) => {
      try {
        const result = await createSuggestionComment(formData);
        if (result.error) {
          return { error: result.error };
        }
        // Refresh comments
        startTransition(() => {
          fetchComments();
          router.refresh();
        });
        return { success: true };
      } catch (err) {
        console.error("Error creating comment:", err);
        return { error: "Failed to create comment" };
      }
    },
    [fetchComments, router],
  );

  // Update a comment
  const handleUpdateComment = useCallback(
    async (formData: FormData) => {
      try {
        const result = await updateSuggestionComment(formData);
        if (result.error) {
          return { error: result.error };
        }
        // Refresh comments
        startTransition(() => {
          fetchComments();
          router.refresh();
        });
        return { success: true };
      } catch (err) {
        console.error("Error updating comment:", err);
        return { error: "Failed to update comment" };
      }
    },
    [fetchComments, router],
  );

  // Delete a comment
  const handleDeleteComment = useCallback(
    async (formData: FormData) => {
      try {
        const result = await deleteSuggestionComment(formData);
        if (result.error) {
          return { error: result.error };
        }
        // Refresh comments
        startTransition(() => {
          fetchComments();
          router.refresh();
        });
        return { success: true };
      } catch (err) {
        console.error("Error deleting comment:", err);
        return { error: "Failed to delete comment" };
      }
    },
    [fetchComments, router],
  );

  // Vote on a comment
  const handleVoteComment = useCallback(
    async (formData: FormData) => {
      try {
        const result = await voteSuggestionComment(formData);
        if (result.error) {
          return { error: result.error };
        }
        // Refresh comments
        startTransition(() => {
          fetchComments();
          router.refresh();
        });
        return { success: true };
      } catch (err) {
        console.error("Error voting on comment:", err);
        return { error: "Failed to vote on comment" };
      }
    },
    [fetchComments, router],
  );

  // Load comments on mount
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return {
    comments,
    loading,
    error,
    isPending,
    createComment: handleCreateComment,
    updateComment: handleUpdateComment,
    deleteComment: handleDeleteComment,
    voteComment: handleVoteComment,
    refreshComments: fetchComments,
  };
}
