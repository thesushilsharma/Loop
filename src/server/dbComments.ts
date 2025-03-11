import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { uniComments } from "@/drizzle/schema";

export async function getUniversityComments(university_id: number) {
    try {
        // Query the comments table with proper reference
        const comments = await db
            .select()
            .from(uniComments)
            .where(eq(uniComments.universityId, university_id));
            
        return comments;
    } catch (error: any) {
        console.error(`Error fetching comments for university ${university_id}:`, error);
        throw new Error(`Failed to fetch university comments: ${error.message}`);
    }
}