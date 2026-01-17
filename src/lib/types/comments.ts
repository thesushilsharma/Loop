import { z } from "zod";

// Interface for university comments
export interface UniComment {
  commentId: number;
  universityId: number | null;
  authId: number;
  content: string;
  userId?: string; // User display name or ID
  upvotes?: number;
  downvotes?: number;
  createdAt: Date;
  updatedAt: Date;
  replies?: UniReply[];
}

// Interface for university replies
export interface UniReply {
  replyId: number;
  commentId: number;
  authId: number;
  content: string;
  userId?: string; // User display name or ID
  createdAt: Date;
  updatedAt: Date;
}

// Interface for university votes
export interface UniVote {
  voteId: number;
  commentId: number;
  authId: number;
  isUpvote: boolean;
  createdAt: Date;
}

// Zod schema for comment validation
export const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
  universityId: z.number(),
});

// Zod schema for reply validation
export const replySchema = z.object({
  content: z.string().min(1, "Reply cannot be empty"),
  commentId: z.number(),
});

// Zod schema for vote validation
export const voteSchema = z.object({
  commentId: z.number(),
  isUpvote: z.boolean(),
});
