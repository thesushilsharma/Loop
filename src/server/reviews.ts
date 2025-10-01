import { db } from "@/drizzle/db";
import { reviews, users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getReviews(universityId: string) {
  try {
    // Query the reviews table with proper reference
    const result = await db
      .select()
      .from(reviews)
      .where(eq(reviews.universityId, parseInt(universityId)));

    // Join with users table to get user information
    const reviewsWithUsers = await Promise.all(
      result.map(async (review) => {
        // Get user information from the database
        const userQuery = await db.query.users.findFirst({
          where: (users, { eq }) => eq(users.authId, review.authId),
          columns: {
            emailId: true,
          },
        });

        return {
          id: review.reviewId,
          rating: review.rating,
          content: review.content,
          votes: review.votes,
          created_at: review.createdAt,
          updated_at: review.updatedAt,
          users: {
            email: userQuery?.emailId || 'anonymous@user.com',
          },
        };
      })
    );

    return reviewsWithUsers;
  } catch (error) {
    console.error(`Error fetching reviews for university ${universityId}:`, error);
    throw new Error(`Failed to fetch university reviews: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}