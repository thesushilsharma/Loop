"use server";

import { eq } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { posts } from "@/drizzle/schema";

export async function getPosts(universityId: string) {
  try {
    // Query the posts table with proper reference
    const result = await db
      .select()
      .from(posts)
      .where(eq(posts.universityId, parseInt(universityId, 10)));

    // Join with users table to get user information
    const postsWithUsers = await Promise.all(
      result.map(async (post) => {
        // Get user information from the database
        const userQuery = await db.query.users.findFirst({
          where: (users, { eq }) => eq(users.authId, post.authId),
          columns: {
            emailId: true,
          },
        });

        // Get vote count for the post
        const voteCount = post.isUpVote ? 1 : 0; // This is a placeholder, implement actual vote counting logic

        return {
          id: post.postId,
          title: post.title,
          content: post.content,
          created_at: post.createdAt,
          updated_at: post.updatedAt,
          vote_count: voteCount,
          users: {
            email: userQuery?.emailId || "anonymous@user.com",
          },
        };
      }),
    );

    return postsWithUsers;
  } catch (error) {
    console.error(
      `Error fetching posts for university ${universityId}:`,
      error,
    );
    throw new Error(
      `Failed to fetch university posts: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
