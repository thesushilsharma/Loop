"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { postComment, postVoteComment } from "@/app/actions/uniComments";
import { getUniversityComments } from "@/server/dbComments";
import { UniComment, UniReply } from "@/lib/types/comments";

type FormActionResponse = {
  success: boolean;
  message: string;
  error: string;
};

export function CommentsSection({ universityId }: { universityId: number }) {
    const [comments, setComments] = useState<UniComment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newComment, setNewComment] = useState("");

  const initialState: FormActionResponse = { message: "", error: "", success: false };

  const [commentState, postCommentAction, isCommentPending] = useActionState(
    postComment,
    initialState
  );
  const [voteState, postVoteAction, isVotePending] = useActionState(
    postVoteComment,
    initialState
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
  }, [universityId, commentState, voteState]);

  useEffect(() => {
    if (commentState.success) setNewComment("");
  }, [commentState]);

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Comment</h2>

      <div className="space-y-6">
        <form className="flex gap-4" action={postCommentAction}>
          <input type="hidden" name="universityId" value={universityId} />
          <Input
            name="content"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
          />
          <Button type="submit" disabled={isCommentPending}>
            {isCommentPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Post"}
          </Button>
        </form>

        {commentState.error && <p className="text-sm text-red-500">{commentState.error}</p>}
        {commentState.success && commentState.message && (
          <p className="text-sm text-green-500">{commentState.message}</p>
        )}
        {voteState.error && <p className="text-sm text-red-500">{voteState.error}</p>}

        {isLoading ? (
          <p>Loading comments...</p>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.commentId} comment={comment} voteAction={postVoteAction} />
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
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src={`https://i.pravatar.cc/150?u=${comment.userId}`} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{comment.userId}</p>
          <p className="text-sm text-muted-foreground">{comment.content}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <form action={voteAction}>
          <input type="hidden" name="commentId" value={comment.commentId} />
          <input type="hidden" name="isUpvote" value="true" />
          <Button variant="ghost" size="sm" type="submit">
            👍 {comment.upvotes}
          </Button>
        </form>

        <form action={voteAction}>
          <input type="hidden" name="commentId" value={comment.commentId} />
          <input type="hidden" name="isUpvote" value="false" />
          <Button variant="ghost" size="sm" type="submit">
            👎 {comment.downvotes}
          </Button>
        </form>
      </div>

      <div className="pl-8">
        {comment.replies?.map((reply: UniReply) => (
          <div key={reply.replyId} className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={`https://i.pravatar.cc/150?u=${reply.userId}`} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{reply.userId}</p>
              <p className="text-sm text-muted-foreground">{reply.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
