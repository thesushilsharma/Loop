"use client";

import { Loader2 } from "lucide-react";
import { useReviews } from "@/hooks/useReviews";
import { ReviewForm } from "./review-form";
import { StarRating } from "./ui/star-rating";

export function UniReviews({ universityId }: { universityId: string }) {
  const { data: reviews, isLoading, isError } = useReviews(universityId);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Reviews</h2>
      <ReviewForm universityId={universityId} />

      <div className="mt-8 space-y-6">
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-gray-600">Loading reviews...</span>
          </div>
        )}

        {isError && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            <p>Failed to load reviews. Please try again later.</p>
          </div>
        )}

        {!isLoading && !isError && reviews?.length === 0 && (
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <p className="text-gray-600">
              No reviews yet. Be the first to leave a review!
            </p>
          </div>
        )}

        {!isLoading &&
          !isError &&
          reviews?.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <StarRating rating={review.rating} />
                  <span className="text-gray-600">
                    by {review.users.email.split("@")[0]}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {review.created_at
                    ? new Date(review.created_at).toLocaleDateString()
                    : "Unknown date"}
                </span>
              </div>
              <p className="text-gray-700">{review.content}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
