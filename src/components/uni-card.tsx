import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useReviews } from "@/hooks/useReviews";
import type { University } from "@/lib/types";
import { Button } from "./ui/button";

export function UniCard({ uni }: { uni: University }) {
  const {
    data: reviews,
    isLoading,
    error,
  } = useReviews(uni.universityId.toString());

  // Calculate aggregate rating from reviews
  const aggregateRating =
    reviews && reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : null;

  const reviewCount = reviews?.length || 0;

  console.log(uni);
  return (
    <Card key={uni.universityId} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        {uni.imageUrl ? (
          <div className="w-full h-[200px] relative">
            <Image
              src={uni.imageUrl}
              alt={uni.title}
              fill={true}
              style={{ objectFit: "contain" }}
              className="rounded-lg"
            />
          </div>
        ) : (
          <div className="w-full h-[200px] rounded-lg bg-muted flex items-center justify-center">
            <span className="text-sm text-muted-foreground">No image</span>
          </div>
        )}
        <CardTitle className="text-xl font-semibold mt-4">
          {uni.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-muted-foreground">
          {uni.description}
        </CardDescription>
        {uni.address}
        <div className="text-lg font-medium text-secondary-foreground mb-4">
          {isLoading ? (
            <p>Loading rating...</p>
          ) : error ? (
            <p>Rating: Not available</p>
          ) : aggregateRating ? (
            <p>
              Rating: {aggregateRating}/5
              <span className="text-sm text-muted-foreground ml-2">
                ({reviewCount} review{reviewCount !== 1 ? "s" : ""})
              </span>
            </p>
          ) : (
            <p>Rating: No reviews yet</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="px-6 pb-6 pt-0 flex gap-6 text-muted-foreground">
        <Link href={`/account/uni/${uni.universityId}`}>
          <Button className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
