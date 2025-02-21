import { Skeleton } from "@/components/ui/skeleton";

export default function SearchFormSkeleton() {
    return (
        <div className="space-y-8">
            {/* Search Form Skeleton */}
            <div className="bg-background border rounded-lg p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                    {/* Search Input Skeleton */}
                    <div className="flex-1 w-full sm:w-auto">
                        <Skeleton className="h-4 w-24 mb-2" /> {/* Label */}
                        <Skeleton className="h-10 w-full" /> {/* Input */}
                    </div>

                    {/* Sort Dropdown Skeleton */}
                    <div className="w-full sm:w-[180px]">
                        <Skeleton className="h-4 w-24 mb-2" /> {/* Label */}
                        <Skeleton className="h-10 w-full" /> {/* Dropdown */}
                    </div>

                    {/* Search Button Skeleton */}
                    <div className="w-full sm:w-auto">
                        <Skeleton className="h-10 w-24" /> {/* Button */}
                    </div>
                </div>
            </div>

            {/* Uni Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-4">
                        <Skeleton className="h-[200px] w-full rounded-lg" /> {/* Image */}
                        <Skeleton className="h-4 w-3/4" /> {/* Title */}
                        <Skeleton className="h-4 w-1/2" /> {/* Address */}
                        <Skeleton className="h-4 w-1/4" /> {/* Rating */}
                    </div>
                ))}
            </div>
        </div>
    );
}