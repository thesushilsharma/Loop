"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { formatDistanceToNow } from "date-fns";
import {
  ChevronDown,
  ChevronUp,
  Edit,
  MessageSquare,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { useSuggestions } from "@/hooks/useSuggestions";
import type { SuggestionPost } from "@/lib/types/suggestions";

interface SuggestionListProps {
  universityId?: number;
  initialSuggestions?: SuggestionPost[];
}

export function SuggestionList({
  universityId,
  initialSuggestions = [],
}: SuggestionListProps) {
  const { suggestions, loading, error, voteSuggestion, deleteSuggestion } =
    useSuggestions(universityId);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [votingId, setVotingId] = useState<number | null>(null);
  const router = useRouter();
  const { user } = useKindeBrowserClient();

  const displaySuggestions =
    initialSuggestions.length > 0 ? initialSuggestions : suggestions;

  const handleVote = async (postId: number, isUpvote: boolean) => {
    setVotingId(postId);

    const formData = new FormData();
    formData.append("postId", postId.toString());
    formData.append("isUpvote", isUpvote.toString());

    await voteSuggestion(formData);
    setVotingId(null);
  };

  const handleDelete = async (postId: number) => {
    if (!confirm("Are you sure you want to delete this suggestion?")) return;

    setDeletingId(postId);

    const formData = new FormData();
    formData.append("postId", postId.toString());

    await deleteSuggestion(formData);
    setDeletingId(null);
  };

  if (loading && initialSuggestions.length === 0) {
    return (
      <div className="space-y-4">
        {["a", "b", "c"].map((key) => (
          <Card key={`s-list-${key}`} className="w-full">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-8 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded-md">
        Error loading suggestions: {error}
      </div>
    );
  }

  if (displaySuggestions.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 mb-4">
          No suggestions yet. Be the first to suggest something!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displaySuggestions.map((suggestion) => {
        const isAuthor = user?.id === suggestion.authId;

        return (
          <Card
            key={suggestion.postId}
            className="w-full hover:shadow-md transition-shadow"
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Link
                  href={`/account/suggest/${suggestion.postId}`}
                  className="hover:underline"
                >
                  <CardTitle className="text-xl">{suggestion.title}</CardTitle>
                </Link>
                <div className="flex items-center space-x-2">
                  {isAuthor && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          router.push(
                            `/account/suggest/${suggestion.postId}/edit`,
                          )
                        }
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(suggestion.postId)}
                        disabled={deletingId === suggestion.postId}
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Posted by{" "}
                {suggestion.user?.name ||
                  suggestion.user?.emailId ||
                  "Anonymous"}{" "}
                •
                {formatDistanceToNow(new Date(suggestion.createdAt), {
                  addSuffix: true,
                })}
              </div>
            </CardHeader>

            <CardContent className="py-2">
              <p className="text-gray-700 dark:text-gray-300">
                {suggestion.content.length > 200
                  ? `${suggestion.content.substring(0, 200)}...`
                  : suggestion.content}
              </p>
            </CardContent>

            <CardFooter className="pt-2 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleVote(suggestion.postId, true)}
                    disabled={votingId === suggestion.postId}
                    className="text-gray-500 hover:text-green-500"
                  >
                    <ChevronUp
                      className={`h-5 w-5 ${suggestion.isUpVote ? "text-green-500" : ""}`}
                    />
                  </Button>
                  <span
                    className={`font-medium ${suggestion.totalVotes && suggestion.totalVotes > 0 ? "text-green-500" : suggestion.totalVotes && suggestion.totalVotes < 0 ? "text-red-500" : ""}`}
                  >
                    {suggestion.totalVotes || 0}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleVote(suggestion.postId, false)}
                    disabled={votingId === suggestion.postId}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <ChevronDown
                      className={`h-5 w-5 ${suggestion.isUpVote === false ? "text-red-500" : ""}`}
                    />
                  </Button>
                </div>

                <Link
                  href={`/account/suggest/${suggestion.postId}`}
                  className="flex items-center space-x-1 text-gray-500 hover:text-blue-500"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>{suggestion.comments?.length || 0} comments</span>
                </Link>
              </div>

              <Badge variant="outline" className="text-xs">
                {suggestion.universityId ? "University" : "General"}
              </Badge>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
