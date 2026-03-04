"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/drizzle/db";
import { reviews } from "@/drizzle/schema";

type ReviewFormResponse = {
  success: boolean;
  message: string;
  error?: string;
};

export async function submitReview(
  _prevState: ReviewFormResponse,
  formData: FormData,
): Promise<ReviewFormResponse> {
  try {
    const universityId = parseInt(formData.get("universityId") as string, 10);
    const rating = parseInt(formData.get("rating") as string, 10);
    const content = formData.get("content") as string;
    const authId = formData.get("authId") as string;

    if (!rating) {
      return { success: false, message: "", error: "Please select a rating" };
    }

    if (!content || content.trim() === "") {
      return {
        success: false,
        message: "",
        error: "Review content cannot be empty",
      };
    }

    await db.insert(reviews).values({
      universityId,
      authId,
      rating,
      content,
    });

    revalidatePath(`/account/uni/${universityId}`);
    return { success: true, message: "Review submitted successfully" };
  } catch (error: unknown) {
    console.error("Error submitting review:", error);
    return {
      success: false,
      message: "",
      error: `Failed to submit review: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}
