"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/drizzle/db";
import { uniComments, uniVotes } from "@/drizzle/schema";

type FormActionResponse = {
  success?: boolean;
  message?: string;
  error?: string;
};

export async function postComment(
  _prevState: FormActionResponse,
  formData: FormData,
): Promise<FormActionResponse> {
  try {
    const universityId = parseInt(formData.get("universityId") as string, 10);
    const content = formData.get("content") as string;
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const parsedAuthId = Number(user?.id);
    const authId = Number.isFinite(parsedAuthId) ? parsedAuthId : 1;

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
  _prevState: FormActionResponse,
  formData: FormData,
): Promise<FormActionResponse> {
  try {
    const commentId = parseInt(formData.get("commentId") as string, 10);
    const isUpvote = formData.get("isUpvote") === "true";
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const parsedAuthId = Number(user?.id);
    const authId = Number.isFinite(parsedAuthId) ? parsedAuthId : 1;

    // Optional: Prevent duplicate votes
    const existingVote = await db.query.uniVotes.findFirst({
      where: (votes, { eq, and }) =>
        and(eq(votes.commentId, commentId), eq(votes.authId, authId)),
    });

    if (existingVote) {
      return { error: "You have already voted on this comment." };
    }

    await db.insert(uniVotes).values({
      commentId,
      authId,
      isUpvote,
    });

    const comment = await db.query.uniComments.findFirst({
      where: (comments, { eq }) => eq(comments.commentId, commentId),
      columns: { universityId: true },
    });
    if (comment?.universityId) {
      revalidatePath(`/account/uni/${comment.universityId}`);
    }
    return { success: true, message: "Vote recorded successfully" };
  } catch (error) {
    console.error("Error recording vote:", error);
    return { error: "Failed to record vote" };
  }
}
