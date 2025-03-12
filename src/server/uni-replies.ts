import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { uniReplies } from "@/drizzle/schema";
export async function getUniReplies(university_commentId: number) {
  try {
    // Query the replies table
    const replies = await db
      .select()
      .from(uniReplies)
      .where(eq(uniReplies.commentId, university_commentId));

    return replies;
  } catch (error: any) {
    console.error(
      `Error fetching replies for comment ${university_commentId}:`,
      error
    );
    throw new Error(`Failed to fetch comment replies: ${error.message}`);
  }
}
