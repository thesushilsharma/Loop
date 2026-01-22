"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { formatDistanceToNow } from "date-fns";
import { ChevronDown, ChevronUp, Edit, Trash } from "lucide-react";
import { useRef, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useSuggestionComments } from "@/hooks/useSuggestionComments";

interface SuggestionCommentsProps {
  postId: number;
}

export function SuggestionComments({ postId }: SuggestionCommentsProps) {
  const {
    comments,
    loading,
    error,
    createComment,
    updateComment,
    deleteComment,
    voteComment,
  } = useSuggestionComments(postId);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useKindeBrowserClient();

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    setActionError(null);

    const formData = new FormData();
    formData.append("postId", postId.toString());
    formData.append("content", newComment);

    const result = await createComment(formData);

    if (result.error) {
      setActionError(result.error);
    } else {
      setNewComment("");
    }

    setSubmitting(false);
  };

  const handleStartEdit = (commentId: number, content: string) => {
    setEditingId(commentId);
    setEditContent(content);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  const handleSubmitEdit = async (commentId: number) => {
    if (!editContent.trim()) return;

    setSubmitting(true);
    setActionError(null);

    const formData = new FormData();
    formData.append("commentId", commentId.toString());
    formData.append("content", editContent);

    const result = await updateComment(formData);

    if (result.error) {
      setActionError(result.error);
    } else {
      setEditingId(null);
      setEditContent("");
    }

    setSubmitting(false);
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    setActionError(null);

    const formData = new FormData();
    formData.append("commentId", commentId.toString());

    const result = await deleteComment(formData);

    if (result.error) {
      setActionError(result.error);
    }
  };

  const handleVoteComment = async (commentId: number, isUpvote: boolean) => {
    setActionError(null);

    const formData = new FormData();
    formData.append("commentId", commentId.toString());
    formData.append("isUpvote", isUpvote.toString());

    const result = await voteComment(formData);

    if (result.error) {
      setActionError(result.error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Comments</h2>

        <form onSubmit={handleSubmitComment} className="mb-6">
          <Textarea
            ref={commentInputRef}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
            disabled={submitting}
            className="mb-2"
          />

          {actionError && (
            <Alert variant="destructive" className="mb-2">
              <AlertDescription>{actionError}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={submitting || !newComment.trim()}>
            {submitting ? "Posting..." : "Post Comment"}
          </Button>
        </form>
      </div>

      <div className="space-y-4">
        {loading ? (
          // Loading skeletons
          ["a", "b", "c"].map((key) => (
            <Card key={`s-comment-${key}`}>
              <CardContent className="pt-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : comments.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          // Comment list
          comments.map((comment) => {
            const isAuthor = user?.id === comment.authId;
            const isEditing = editingId === comment.commentId;

            return (
              <Card key={comment.commentId}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {comment.user?.name ||
                          comment.user?.emailId ||
                          "Anonymous"}
                      </span>{" "}
                      •
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })}
                      {comment.updatedAt > comment.createdAt && " (edited)"}
                    </div>

                    {isAuthor && !isEditing && (
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleStartEdit(comment.commentId, comment.content)
                          }
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteComment(comment.commentId)}
                        >
                          <Trash className="h-3 w-3 text-red-500" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={3}
                        disabled={submitting}
                      />
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleSubmitEdit(comment.commentId)}
                          disabled={submitting || !editContent.trim()}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                          disabled={submitting}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  )}
                </CardContent>

                <CardFooter className="pt-0 pb-3">
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleVoteComment(comment.commentId, true)}
                      className="h-8 w-8 text-gray-500 hover:text-green-500"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <span
                      className={`text-sm font-medium ${comment.votes > 0 ? "text-green-500" : comment.votes < 0 ? "text-red-500" : ""}`}
                    >
                      {comment.votes || 0}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleVoteComment(comment.commentId, false)
                      }
                      className="h-8 w-8 text-gray-500 hover:text-red-500"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
