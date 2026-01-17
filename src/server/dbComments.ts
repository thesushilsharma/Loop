import { eq, sql } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { uniComments } from "@/drizzle/schema";

export async function getUniversityComments(university_id: number) {
  try {
    const base = await db
      .select()
      .from(uniComments)
      .where(eq(uniComments.universityId, university_id));

    if (base.length === 0) return [];

    const commentIds = base.map((c) => c.commentId);

    const upvotesQuery = db.execute(sql`
          SELECT comment_id, COUNT(*) as count
          FROM "uni-votes"
          WHERE comment_id IN (${sql.join(commentIds)}) AND is_upvote = true
          GROUP BY comment_id
        `);

    const downvotesQuery = db.execute(sql`
          SELECT comment_id, COUNT(*) as count
          FROM "uni-votes"
          WHERE comment_id IN (${sql.join(commentIds)}) AND is_upvote = false
          GROUP BY comment_id
        `);

    const [upvotesResult, downvotesResult] = await Promise.all([
      upvotesQuery,
      downvotesQuery,
    ]);

    const upvotesMap = new Map<number, number>();
    const downvotesMap = new Map<number, number>();

    if (upvotesResult && "rows" in upvotesResult) {
      const rows = (upvotesResult as { rows: unknown[] }).rows || [];
      for (const row of rows) {
        const r = row as { comment_id: unknown; count: unknown };
        upvotesMap.set(Number(r.comment_id), Number(r.count));
      }
    }
    if (downvotesResult && "rows" in downvotesResult) {
      const rows = (downvotesResult as { rows: unknown[] }).rows || [];
      for (const row of rows) {
        const r = row as { comment_id: unknown; count: unknown };
        downvotesMap.set(Number(r.comment_id), Number(r.count));
      }
    }

    return base.map((c) => ({
      ...c,
      upvotes: upvotesMap.get(c.commentId) || 0,
      downvotes: downvotesMap.get(c.commentId) || 0,
    }));
  } catch (error: unknown) {
    console.error(
      `Error fetching comments for university ${university_id}:`,
      error,
    );
    throw new Error(
      `Failed to fetch university comments: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
