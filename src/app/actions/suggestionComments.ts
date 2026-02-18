"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/drizzle/db";
import { comments, commentVotes, users } from "@/drizzle/schema";
import {
  createSuggestionCommentSchema,
  deleteSuggestionCommentSchema,
  updateSuggestionCommentSchema,
  voteSuggestionCommentSchema,
} from "@/lib/schemas/suggestions";

// Comment votes now modeled in Drizzle schema

// Create a new comment on a suggestion post
export async function createSuggestionComment(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user?.id) {
    return { error: "You must be logged in to comment" };
  }

  // Parse form data
  const rawData = {
    postId: formData.get("postId") as string,
    content: formData.get("content") as string,
  };

  // Validate with Zod schema
  const parsed = createSuggestionCommentSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message || "Invalid data",
    };
  }

  const { postId, content } = parsed.data;

  try {
    // Insert the new comment
    await db.insert(comments).values({
      authId: user.id,
      postId,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Revalidate paths
    revalidatePath(`/account/suggest/${postId}`);
    return { success: true };
  } catch (error) {
    console.error("Error creating comment:", error);
    return { error: "Failed to create comment" };
  }
}

// Get comments for a suggestion post
export async function getSuggestionComments(postId: number) {
  try {
    const result = await db
      .select({
        commentId: comments.commentId,
        authId: comments.authId,
        postId: comments.postId,
        content: comments.content,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
        user: {
          name: users.name,
          emailId: users.emailId,
        },
      })
      .from(comments)
      .leftJoin(users, eq(comments.authId, users.authId))
      .where(eq(comments.postId, postId))
      .orderBy(desc(comments.createdAt));

    // Get comment IDs to fetch vote counts
    const commentIds = result.map((comment) => comment.commentId);

    if (commentIds.length === 0) {
      return [];
    }

    const upvotesResult = await db
      .select({
        commentId: commentVotes.commentId,
        count: sql<number>`COUNT(*)`,
      })
      .from(commentVotes)
      .where(
        and(
          inArray(commentVotes.commentId, commentIds),
          eq(commentVotes.isUpvote, true),
        ),
      )
      .groupBy(commentVotes.commentId);

    const downvotesResult = await db
      .select({
        commentId: commentVotes.commentId,
        count: sql<number>`COUNT(*)`,
      })
      .from(commentVotes)
      .where(
        and(
          inArray(commentVotes.commentId, commentIds),
          eq(commentVotes.isUpvote, false),
        ),
      )
      .groupBy(commentVotes.commentId);

    const upvotesMap = new Map<number, number>();
    const downvotesMap = new Map<number, number>();
    for (const row of upvotesResult)
      upvotesMap.set(row.commentId, Number(row.count) || 0);
    for (const row of downvotesResult)
      downvotesMap.set(row.commentId, Number(row.count) || 0);

    // Add vote counts to comments
    const commentsWithVotes = result.map((comment) => {
      const upvotes = upvotesMap.get(comment.commentId) || 0;
      const downvotes = downvotesMap.get(comment.commentId) || 0;
      return {
        ...comment,
        upvotes,
        downvotes,
        votes: upvotes - downvotes,
      };
    });

    return commentsWithVotes;
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}

// Update a comment
export async function updateSuggestionComment(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user?.id) {
    return { error: "You must be logged in to update a comment" };
  }

  // Parse form data
  const rawData = {
    commentId: formData.get("commentId") as string,
    content: formData.get("content") as string,
  };

  // Validate with Zod schema
  const validationResult = updateSuggestionCommentSchema.safeParse(rawData);
  if (!validationResult.success) {
    return {
      error: validationResult.error.issues[0]?.message || "Invalid data",
    };
  }

  const { commentId, content } = validationResult.data;

  try {
    // Check if the comment exists and belongs to the user
    const comment = await db
      .select({ postId: comments.postId })
      .from(comments)
      .where(
        and(eq(comments.commentId, commentId), eq(comments.authId, user.id)),
      );

    if (comment.length === 0) {
      return {
        error: "Comment not found or you do not have permission to edit it",
      };
    }

    const postId = comment[0].postId;

    // Update the comment
    await db
      .update(comments)
      .set({
        content,
        updatedAt: new Date(),
      })
      .where(eq(comments.commentId, commentId));

    // Revalidate paths
    revalidatePath(`/account/suggest/${postId}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating comment:", error);
    return { error: "Failed to update comment" };
  }
}

// Delete a comment
export async function deleteSuggestionComment(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user?.id) {
    return { error: "You must be logged in to delete a comment" };
  }

  // Parse form data
  const rawData = {
    commentId: formData.get("commentId") as string,
  };

  // Validate with Zod schema
  const validationResult = deleteSuggestionCommentSchema.safeParse(rawData);
  if (!validationResult.success) {
    return {
      error: validationResult.error.issues[0]?.message || "Invalid data",
    };
  }

  const { commentId } = validationResult.data;

  try {
    // Check if the comment exists and belongs to the user
    const comment = await db
      .select({ postId: comments.postId })
      .from(comments)
      .where(
        and(eq(comments.commentId, commentId), eq(comments.authId, user.id)),
      );

    if (comment.length === 0) {
      return {
        error: "Comment not found or you do not have permission to delete it",
      };
    }

    const postId = comment[0].postId;

    // Delete the comment
    await db.delete(comments).where(eq(comments.commentId, commentId));

    // Revalidate paths
    revalidatePath(`/account/suggest/${postId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting comment:", error);
    return { error: "Failed to delete comment" };
  }
}

// Vote on a comment
export async function voteSuggestionComment(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user?.id) {
    return { error: "You must be logged in to vote" };
  }

  // Parse form data
  const rawData = {
    commentId: formData.get("commentId") as string,
    isUpvote: formData.get("isUpvote") === "true",
  };

  // Validate with Zod schema
  const validationResult = voteSuggestionCommentSchema.safeParse(rawData);
  if (!validationResult.success) {
    return {
      error: validationResult.error.issues[0]?.message || "Invalid data",
    };
  }

  const { commentId, isUpvote } = validationResult.data;

  try {
    // Check if the comment exists
    const comment = await db
      .select({ postId: comments.postId })
      .from(comments)
      .where(eq(comments.commentId, commentId));

    if (comment.length === 0) {
      return { error: "Comment not found" };
    }

    const postId = comment[0].postId;

    // Check if the user has already voted on this comment
    const existingVote = await db
      .select()
      .from(commentVotes)
      .where(
        and(
          eq(commentVotes.authId, user.id),
          eq(commentVotes.commentId, commentId),
        ),
      );

    // If the user has already voted, update their vote
    if (existingVote.length > 0) {
      await db
        .update(commentVotes)
        .set({ isUpvote })
        .where(
          and(
            eq(commentVotes.authId, user.id),
            eq(commentVotes.commentId, commentId),
          ),
        );
    } else {
      await db
        .insert(commentVotes)
        .values({ authId: user.id, commentId, isUpvote });
    }

    // Revalidate paths
    revalidatePath(`/account/suggest/${postId}`);
    return { success: true };
  } catch (error) {
    console.error("Error voting on comment:", error);
    return { error: "Failed to vote on comment" };
  }
}
