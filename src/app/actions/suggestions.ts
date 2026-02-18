"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/drizzle/db";
import { posts, postVotes, users } from "@/drizzle/schema";
import {
  createSuggestionSchema,
  deleteSuggestionSchema,
  updateSuggestionSchema,
  voteSuggestionSchema,
} from "@/lib/schemas/suggestions";

// Create a new suggestion post
export async function createSuggestion(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user?.id) {
    return { error: "You must be logged in to create a suggestion" };
  }

  // Parse form data
  const rawData = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    universityId: formData.get("universityId") as string,
  };

  // Validate with Zod schema
  const validationResult = createSuggestionSchema.safeParse(rawData);
  if (!validationResult.success) {
    const errorMessage =
      validationResult.error.issues[0]?.message || "Invalid data";
    return { error: errorMessage };
  }

  const { title, content, universityId } = validationResult.data;

  try {
    // Insert the new post
    await db.insert(posts).values({
      authId: user.id,
      universityId,
      title,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Revalidate the suggestions page
    revalidatePath("/account/suggest");
    return { success: true };
  } catch (error) {
    console.error("Error creating suggestion:", error);
    return { error: "Failed to create suggestion" };
  }
}

// Get all suggestion posts
export async function getSuggestions(universityId?: number) {
  try {
    const baseQuery = db
      .select({
        postId: posts.postId,
        authId: posts.authId,
        universityId: posts.universityId,
        title: posts.title,
        content: posts.content,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        user: {
          name: users.name,
          emailId: users.emailId,
        },
      })
      .from(posts)
      .leftJoin(users, eq(posts.authId, users.authId));

    // Filter by university if provided
    const query = universityId
      ? baseQuery.where(eq(posts.universityId, universityId))
      : baseQuery;

    const result = await query.orderBy(desc(posts.createdAt));

    // Get post IDs to fetch vote counts
    const postIds = result.map((post) => post.postId);

    const upvotesResult = await db
      .select({ postId: postVotes.postId, count: sql<number>`COUNT(*)` })
      .from(postVotes)
      .where(
        and(inArray(postVotes.postId, postIds), eq(postVotes.isUpvote, true)),
      )
      .groupBy(postVotes.postId);

    const downvotesResult = await db
      .select({ postId: postVotes.postId, count: sql<number>`COUNT(*)` })
      .from(postVotes)
      .where(
        and(inArray(postVotes.postId, postIds), eq(postVotes.isUpvote, false)),
      )
      .groupBy(postVotes.postId);

    const upvotesMap = new Map<number, number>();
    const downvotesMap = new Map<number, number>();

    for (const row of upvotesResult) {
      upvotesMap.set(row.postId, Number(row.count) || 0);
    }
    for (const row of downvotesResult) {
      downvotesMap.set(row.postId, Number(row.count) || 0);
    }

    // Add vote counts to posts
    const suggestionsWithVotes = result.map((post) => {
      const upvotes = upvotesMap.get(post.postId) || 0;
      const downvotes = downvotesMap.get(post.postId) || 0;
      return {
        ...post,
        upvotes,
        downvotes,
        totalVotes: upvotes - downvotes,
      };
    });

    return suggestionsWithVotes;
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return [];
  }
}

// Get a single suggestion post by ID
export async function getSuggestionById(postId: number) {
  try {
    const result = await db
      .select({
        postId: posts.postId,
        authId: posts.authId,
        universityId: posts.universityId,
        title: posts.title,
        content: posts.content,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        user: {
          name: users.name,
          emailId: users.emailId,
        },
      })
      .from(posts)
      .leftJoin(users, eq(posts.authId, users.authId))
      .where(eq(posts.postId, postId));

    if (result.length === 0) {
      return null;
    }

    const upv = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(postVotes)
      .where(and(eq(postVotes.postId, postId), eq(postVotes.isUpvote, true)));
    const dnv = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(postVotes)
      .where(and(eq(postVotes.postId, postId), eq(postVotes.isUpvote, false)));
    const upvotes = Number(upv[0]?.count || 0);
    const downvotes = Number(dnv[0]?.count || 0);

    // Add vote counts to post
    const suggestionWithVotes = {
      ...result[0],
      upvotes,
      downvotes,
      totalVotes: upvotes - downvotes,
    };

    return suggestionWithVotes;
  } catch (error) {
    console.error("Error fetching suggestion:", error);
    return null;
  }
}

// Update a suggestion post
export async function updateSuggestion(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user?.id) {
    return { error: "You must be logged in to update a suggestion" };
  }

  // Parse form data
  const rawData = {
    postId: formData.get("postId") as string,
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    universityId: formData.get("universityId") as string,
  };

  // Validate with Zod schema
  const validationResult = updateSuggestionSchema.safeParse(rawData);
  if (!validationResult.success) {
    const errorMessage =
      validationResult.error.issues[0]?.message || "Invalid data";
    return { error: errorMessage };
  }

  const { postId, title, content, universityId } = validationResult.data;

  try {
    // Check if the post exists and belongs to the user
    const post = await db
      .select()
      .from(posts)
      .where(and(eq(posts.postId, postId), eq(posts.authId, user.id)));

    if (post.length === 0) {
      return {
        error: "Suggestion not found or you do not have permission to edit it",
      };
    }

    // Update the post
    const updateData: Partial<typeof posts.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (universityId) updateData.universityId = universityId;

    await db.update(posts).set(updateData).where(eq(posts.postId, postId));

    // Revalidate paths
    revalidatePath("/account/suggest");
    revalidatePath(`/account/suggest/${postId}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating suggestion:", error);
    return { error: "Failed to update suggestion" };
  }
}

// Delete a suggestion post
export async function deleteSuggestion(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user?.id) {
    return { error: "You must be logged in to delete a suggestion" };
  }

  // Parse form data
  const rawData = {
    postId: formData.get("postId") as string,
  };

  // Validate with Zod schema
  const validationResult = deleteSuggestionSchema.safeParse(rawData);
  if (!validationResult.success) {
    const errorMessage =
      validationResult.error.issues[0]?.message || "Invalid data";
    return { error: errorMessage };
  }

  const { postId } = validationResult.data;

  try {
    // Check if the post exists and belongs to the user
    const post = await db
      .select()
      .from(posts)
      .where(and(eq(posts.postId, postId), eq(posts.authId, user.id)));

    if (post.length === 0) {
      return {
        error:
          "Suggestion not found or you do not have permission to delete it",
      };
    }

    // Delete the post
    await db.delete(posts).where(eq(posts.postId, postId));

    // Revalidate paths
    revalidatePath("/account/suggest");
    return { success: true };
  } catch (error) {
    console.error("Error deleting suggestion:", error);
    return { error: "Failed to delete suggestion" };
  }
}

// Vote on a suggestion post
export async function voteSuggestion(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user?.id) {
    return { error: "You must be logged in to vote" };
  }

  // Parse form data
  const rawData = {
    postId: formData.get("postId") as string,
    isUpvote: formData.get("isUpvote") === "true",
  };

  // Validate with Zod schema
  const validationResult = voteSuggestionSchema.safeParse(rawData);
  if (!validationResult.success) {
    const errorMessage =
      validationResult.error.issues[0]?.message || "Invalid data";
    return { error: errorMessage };
  }

  const { postId, isUpvote } = validationResult.data;

  try {
    // Check if the post exists
    const post = await db.select().from(posts).where(eq(posts.postId, postId));

    if (post.length === 0) {
      return { error: "Suggestion not found" };
    }

    // Check if the user has already voted on this post
    const existingVote = await db
      .select()
      .from(postVotes)
      .where(and(eq(postVotes.authId, user.id), eq(postVotes.postId, postId)));

    // If the user has already voted, update their vote
    if (existingVote.length > 0) {
      await db
        .update(postVotes)
        .set({ isUpvote })
        .where(
          and(eq(postVotes.authId, user.id), eq(postVotes.postId, postId)),
        );
    } else {
      await db.insert(postVotes).values({ authId: user.id, postId, isUpvote });
    }

    // Revalidate paths
    revalidatePath("/account/suggest");
    revalidatePath(`/account/suggest/${postId}`);
    return { success: true };
  } catch (error) {
    console.error("Error voting on suggestion:", error);
    return { error: "Failed to vote on suggestion" };
  }
}
