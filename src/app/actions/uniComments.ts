"use server";

import { db } from "@/drizzle/db";
import { uniComments, uniVotes } from "@/drizzle/schema";
import { revalidatePath } from "next/cache";

type FormActionResponse = {
  success?: boolean;
  message?: string;
  error?: string;
};

export async function postComment(
  prevState: FormActionResponse,
  formData: FormData
): Promise<FormActionResponse> {
  try {
    const universityId = parseInt(formData.get("universityId") as string);
    const content = formData.get("content") as string;
    const authId = 1; // Replace with real auth logic

    if (!content || content.trim() === "") {
      return { error: "Comment cannot be empty" };
    }

    await db.insert(uniComments).values({
      universityId,
      authId,
      content,
    });

    revalidatePath(`/account/uni/${universityId}`);
    return { success: true, message: "Comment added successfully" };
  } catch (error) {
    console.error("Error posting comment:", error);
    return { error: "Failed to post comment" };
  }
}

export async function postVoteComment(
  prevState: FormActionResponse,
  formData: FormData
): Promise<FormActionResponse> {
  try {
    const commentId = parseInt(formData.get("commentId") as string);
    const isUpvote = formData.get("isUpvote") === "true";
    const authId = 1; // Replace with real auth logic

    // Optional: Prevent duplicate votes
    const existingVote = await db.query.uniVotes.findFirst({
      where: (votes, { eq, and }) => and(eq(votes.commentId, commentId), eq(votes.authId, authId)),
    });

    if (existingVote) {
      return { error: "You have already voted on this comment." };
    }

    await db.insert(uniVotes).values({
      commentId,
      authId,
      isUpvote,
    });

    revalidatePath(`/account/uni/[uniId]`);
    return { success: true, message: "Vote recorded successfully" };
  } catch (error) {
    console.error("Error recording vote:", error);
    return { error: "Failed to record vote" };
  }
}
