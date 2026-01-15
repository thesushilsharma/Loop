import { Star, StarHalf } from "lucide-react";

interface StarRatingProps {
  rating: number;
  className?: string;
}

export function StarRating({ rating, className = "" }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const STAR_KEYS = ["one", "two", "three", "four", "five"];
  const statuses = STAR_KEYS.map((_, idx) => {
    if (idx < fullStars) return "full" as const;
    if (idx === fullStars && hasHalfStar) return "half" as const;
    return "empty" as const;
  });

  return (
    <div className={`flex items-center ${className}`}>
      {statuses.map((status, idx) => {
        const key = STAR_KEYS[idx];
        if (status === "full") {
          return (
            <Star
              key={`full-${key}`}
              className="w-5 h-5 fill-yellow-400 text-yellow-400"
            />
          );
        }
        if (status === "half") {
          return (
            <StarHalf key={`half-${key}`} className="w-5 h-5 text-yellow-400" />
          );
        }
        return <Star key={`empty-${key}`} className="w-5 h-5 text-gray-300" />;
      })}
    </div>
  );
}
