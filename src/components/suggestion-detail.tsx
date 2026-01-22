"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, ChevronDown, ChevronUp, Edit, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SuggestionComments } from "@/components/suggestion-comments";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSuggestion } from "@/hooks/useSuggestions";
import type { SuggestionPost } from "@/lib/types/suggestions";

interface SuggestionDetailProps {
  postId: number;
  initialSuggestion?: SuggestionPost;
}

export function SuggestionDetail({
  postId,
  initialSuggestion,
}: SuggestionDetailProps) {
  const { suggestion, loading, error, voteSuggestion, deleteSuggestion } =
    useSuggestion(postId);
  const [isVoting, setIsVoting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { user } = useKindeBrowserClient();

  const displaySuggestion = initialSuggestion || suggestion;
  const isAuthor = user?.id === displaySuggestion?.authId;

  const handleVote = async (isUpvote: boolean) => {
    if (!displaySuggestion) return;

    setIsVoting(true);

    const formData = new FormData();
    formData.append("postId", displaySuggestion.postId.toString());
    formData.append("isUpvote", isUpvote.toString());

    await voteSuggestion(formData);
    setIsVoting(false);
  };

  const handleDelete = async () => {
    if (!displaySuggestion) return;
    if (!confirm("Are you sure you want to delete this suggestion?")) return;

    setIsDeleting(true);

    const formData = new FormData();
    formData.append("postId", displaySuggestion.postId.toString());

    const result = await deleteSuggestion(formData);
    if (result.success) {
      router.push("/account/suggest");
    } else {
      setIsDeleting(false);
      alert(result.error || "Failed to delete suggestion");
    }
  };

  if (loading && !initialSuggestion) {
    return (
      <div className="space-y-4">
        <Card className="w-full">
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-8 w-full" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded-md">
        Error loading suggestion: {error}
      </div>
    );
  }

  if (!displaySuggestion) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 mb-4">Suggestion not found</p>
        <Button asChild>
          <Link href="/account/suggest">Back to Suggestions</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" asChild className="mr-2">
          <Link href="/account/suggest">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
      </div>

      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl">
              {displaySuggestion.title}
            </CardTitle>
            <div className="flex items-center space-x-2">
              {isAuthor && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      router.push(
                        `/account/suggest/${displaySuggestion.postId}/edit`,
                      )
                    }
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Posted by{" "}
            {displaySuggestion.user?.name ||
              displaySuggestion.user?.emailId ||
              "Anonymous"}{" "}
            •
            {formatDistanceToNow(new Date(displaySuggestion.createdAt), {
              addSuffix: true,
            })}
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {displaySuggestion.content}
          </p>
        </CardContent>

        <CardFooter className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleVote(true)}
                disabled={isVoting}
                className="text-gray-500 hover:text-green-500"
              >
                <ChevronUp className="h-5 w-5" />
              </Button>
              <span
                className={`font-medium ${displaySuggestion.totalVotes && displaySuggestion.totalVotes > 0 ? "text-green-500" : displaySuggestion.totalVotes && displaySuggestion.totalVotes < 0 ? "text-red-500" : ""}`}
              >
                {displaySuggestion.totalVotes || 0}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleVote(false)}
                disabled={isVoting}
                className="text-gray-500 hover:text-red-500"
              >
                <ChevronDown className="h-5 w-5" />
              </Button>
            </div>

            <div className="text-gray-500">
              <span className="font-medium">
                {displaySuggestion.upvotes || 0}
              </span>{" "}
              upvotes •
              <span className="font-medium">
                {displaySuggestion.downvotes || 0}
              </span>{" "}
              downvotes
            </div>
          </div>

          <Badge variant="outline" className="text-xs">
            {displaySuggestion.universityId ? "University" : "General"}
          </Badge>
        </CardFooter>
      </Card>

      <SuggestionComments postId={postId} />
    </div>
  );
}
