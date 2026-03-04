"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/drizzle/db";
import { posts } from "@/drizzle/schema";

type PostFormResult = {
  success: boolean;
  message: string;
};

export async function postDiscussion(
  _prevState: PostFormResult | undefined,
  formData: FormData,
): Promise<PostFormResult> {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const universityId = formData.get("universityId") as string;
  const userId = "1"; // Replace with actual user ID from session

  if (!title || !content) {
    return {
      success: false,
      message: "Both title and content are required.",
    };
  }

  try {
    await db.insert(posts).values({
      universityId: parseInt(universityId, 10), // ✅ match your schema
      authId: userId,
      title,
      content,
    });

    revalidatePath(`/account/uni/${universityId}`);
    return {
      success: true,
      message: "Discussion posted successfully.",
    };
  } catch (err) {
    console.error("Failed to post discussion", err);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
