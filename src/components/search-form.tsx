"use client";

import { useFormStatus } from "react-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, AlertCircle } from "lucide-react";
import { useQueryState } from "nuqs";
import { useUniSearchFilterQuery } from "@/hooks/useUniSearch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { UniCard } from "./uni-card";
import SearchFormSkeleton from "@/app/(pages)/account/uni/loading";

export function SearchForm() {
    const status = useFormStatus();

    const [query, setQuery] = useQueryState("query");
    const [sortBy, setSort] = useQueryState("sortBy");
    const {
        data: universities,
        isLoading,
        isError,
        refetch,
    } = useUniSearchFilterQuery();

    const handleSubmit = (formData: FormData) => {
        const queryValue = formData.get("query") as string;
        const sortByValue = formData.get("sortBy") as string;

        setQuery(queryValue || "");
        setSort(sortByValue || null);

        refetch();
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    };

    const handleSort = (value: string) => {
        setSort(value);
    };

    return (
        <div className="space-y-8">
            {/* Search Form */}
            <form action={handleSubmit} className="space-y-6">
                <div className="bg-background border rounded-lg p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row gap-4 items-end">
                        {/* Search Input */}
                        <div className="flex-1 w-full sm:w-auto">
                            <Label htmlFor="query" className="text-sm font-medium">
                                Search by Name or Address
                            </Label>
                            <div className="relative">
                                <Input
                                    id="query"
                                    name="query"
                                    type="text"
                                    placeholder="Search universities..."
                                    defaultValue={query || ""}
                                    onChange={handleSearch}
                                    className="w-full pl-10 pr-4 py-2"
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>

                        {/* Sorting */}
                        <div className="w-full sm:w-[180px]">
                            <Label htmlFor="sortBy" className="text-sm font-medium">
                                Sort by
                            </Label>
                            <Select value={sortBy || ""} onValueChange={handleSort}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select sort option" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="name">Name</SelectItem>
                                    <SelectItem value="rating">Rating</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Search Button */}
                        <div className="w-full sm:w-auto">
                            <Button type="submit" disabled={status.pending} className="w-full sm:w-auto">
                                {status.pending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Searching...
                                    </>
                                ) : (
                                    "Search"
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>

            {/* Loading State */}
            {isLoading && (
                <SearchFormSkeleton />
            )}

            {/* Error State */}
            {isError && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        An error occurred while fetching results. Please try again.
                    </AlertDescription>
                </Alert>
            )}

            {/* No Results Found */}
            {universities !== undefined && universities.length === 0 && !isLoading && (
                <Alert variant="default">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No Results Found</AlertTitle>
                    <AlertDescription>
                        No universities match your search criteria. Try adjusting your filters.
                    </AlertDescription>
                </Alert>
            )}

            {/* Uni Cards */}
            {universities && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {universities.map((uni) => (
                        <UniCard key={uni.universityId} uni={uni} />
                    ))}
                </div>
            )}
        </div>

    );
}
