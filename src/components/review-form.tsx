"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { submitReview } from "@/app/actions/reviews";
import { Button } from "./ui/button";

// Define a schema for review validation
const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating"),
  content: z.string().min(1, "Review content cannot be empty"),
});

type ReviewFormResult = {
  success: boolean;
  message: string;
  error?: string;
};

export function ReviewForm({ universityId }: { universityId: string }) {
  const { user } = useKindeBrowserClient();
  const router = useRouter();

  const initialState: ReviewFormResult = { success: false, message: "" };

  const [formState, formAction, isPending] = useActionState<
    ReviewFormResult,
    FormData
  >(submitReview, initialState);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
  });

  // Reset form when submission is successful
  useEffect(() => {
    if (formState?.success) {
      reset();
    }
  }, [formState, reset]);

  // Wrapper function to handle form submission
  const onSubmit = (data: z.infer<typeof reviewSchema>) => {
    if (!user) {
      router.push("/auth/sign-in");
      return;
    }

    const formData = new FormData();
    formData.append("universityId", universityId);
    formData.append("authId", user.id);
    formData.append("rating", data.rating.toString());
    formData.append("content", data.content);

    formAction(formData);
  };

  if (!user) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-600 mb-4">Please sign in to leave a review</p>
        <Button onClick={() => router.push("/auth/sign-in")}>Sign In</Button>
      </div>
    );
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Review Form</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <div className="mb-4">
          <label
            htmlFor="review-rating"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Rating
          </label>
          <select
            id="review-rating"
            {...register("rating", { valueAsNumber: true })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select a rating</option>
            {[1, 2, 3, 4, 5].map((rating) => (
              <option key={rating} value={rating}>
                {rating} {rating === 1 ? "star" : "stars"}
              </option>
            ))}
          </select>
          {errors.rating && (
            <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="review-content"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Review
          </label>
          <textarea
            id="review-content"
            {...register("content")}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Share your experience..."
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">
              {errors.content.message}
            </p>
          )}
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
            </>
          ) : (
            "Submit Review"
          )}
        </Button>

        {formState?.error && (
          <p className="mt-4 text-sm text-red-600">{formState.error}</p>
        )}

        {formState?.success && formState.message && (
          <p className="mt-4 text-sm text-green-600">{formState.message}</p>
        )}
      </form>
    </section>
  );
}
