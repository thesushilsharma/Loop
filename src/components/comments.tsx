"use client";

import { Loader2 } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { postComment, postVoteComment } from "@/app/actions/uniComments";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Meter } from "@/components/ui/meter";
import type { UniComment, UniReply } from "@/lib/types/comments";
import { cn } from "@/lib/utils";
import { getUniversityComments } from "@/server/dbComments";

type FormActionResponse = {
  success: boolean;
  message: string;
  error: string;
};

export function CommentsSection({ universityId }: { universityId: number }) {
  const [comments, setComments] = useState<UniComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");

  const initialState: FormActionResponse = {
    message: "",
    error: "",
    success: false,
  };

  const [commentState, postCommentAction, isCommentPending] = useActionState(
    postComment,
    initialState,
  );
  const [voteState, postVoteAction, _isVotePending] = useActionState(
    postVoteComment,
    initialState,
  );

  useEffect(() => {
    async function fetchComments() {
      try {
        setIsLoading(true);
        const data = await getUniversityComments(universityId);
        setComments(data || []);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchComments();
  }, [universityId]);

  useEffect(() => {
    async function refetchOnSuccess() {
      if (commentState.success) {
        setNewComment("");
        const data = await getUniversityComments(universityId);
        setComments(data || []);
      }
    }
    refetchOnSuccess();
  }, [commentState, universityId]);

  useEffect(() => {
    async function refetchOnVote() {
      if (voteState.success) {
        const data = await getUniversityComments(universityId);
        setComments(data || []);
      }
    }
    refetchOnVote();
  }, [voteState, universityId]);

  return (
    <section className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Comments</h2>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <h3 className="text-lg font-medium">Add a Comment</h3>
        </CardHeader>
        <CardContent>
          <form className="flex gap-4" action={postCommentAction}>
            <input type="hidden" name="universityId" value={universityId} />
            <Input
              name="content"
              placeholder="Share your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
              className="flex-1"
            />
            <Button type="submit" disabled={isCommentPending}>
              {isCommentPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Post"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="pt-0">
          {commentState.error && (
            <p className="text-sm text-red-500">{commentState.error}</p>
          )}
          {commentState.success && commentState.message && (
            <p className="text-sm text-green-500">{commentState.message}</p>
          )}
          {voteState.error && (
            <p className="text-sm text-red-500">{voteState.error}</p>
          )}
        </CardFooter>
      </Card>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : comments.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No comments yet. Be the first to share your thoughts!
            </CardContent>
          </Card>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.commentId}
              comment={comment}
              voteAction={postVoteAction}
            />
          ))
        )}
      </div>
    </section>
  );
}

function CommentItem({
  comment,
  voteAction,
}: {
  comment: UniComment;
  voteAction: (formData: FormData) => void;
}) {
  // Calculate sentiment score based on upvotes vs downvotes
  const totalVotes = (comment.upvotes || 0) + (comment.downvotes || 0);
  const sentimentScore =
    totalVotes > 0 ? ((comment.upvotes || 0) / totalVotes) * 100 : 50; // Default to neutral if no votes

  return (
    <Card
      className={cn(
        "transition-all duration-300",
        sentimentScore >= 80
          ? "border-blue-300"
          : sentimentScore <= 30
            ? "border-red-300"
            : "",
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src={`https://i.pravatar.cc/150?u=${comment.userId}`}
              />
              <AvatarFallback>
                {comment.userId?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{comment.userId}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(comment.createdAt || "").toLocaleDateString()}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="ml-auto">
            {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm">{comment.content}</p>

        {/* Sentiment Meter */}
        <div className="mt-4">
          <Meter value={sentimentScore} size="sm" />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-4 pt-0">
        <div className="flex gap-2">
          <form action={voteAction}>
            <input type="hidden" name="commentId" value={comment.commentId} />
            <input type="hidden" name="isUpvote" value="true" />
            <Button
              variant="outline"
              size="sm"
              type="submit"
              className="text-green-600"
            >
              👍 {comment.upvotes || 0}
            </Button>
          </form>

          <form action={voteAction}>
            <input type="hidden" name="commentId" value={comment.commentId} />
            <input type="hidden" name="isUpvote" value="false" />
            <Button
              variant="outline"
              size="sm"
              type="submit"
              className="text-red-600"
            >
              👎 {comment.downvotes || 0}
            </Button>
          </form>
        </div>

        {comment.replies && comment.replies.length > 0 && (
          <div className="w-full space-y-3 border-l-2 pl-4 mt-2">
            <h4 className="text-sm font-medium">Replies</h4>
            {comment.replies.map((reply: UniReply) => (
              <div key={reply.replyId} className="flex items-start gap-3">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={`https://i.pravatar.cc/150?u=${reply.userId}`}
                  />
                  <AvatarFallback>
                    {reply.userId?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs font-medium">{reply.userId}</p>
                  <p className="text-sm text-muted-foreground">
                    {reply.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
