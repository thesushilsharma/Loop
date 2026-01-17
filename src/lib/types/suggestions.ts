import type { z } from "zod";
import type {
  createSuggestionCommentSchema,
  createSuggestionSchema,
} from "../schemas/suggestions";

// Interface for suggestion posts
export interface SuggestionPost {
  postId: number;
  authId: string;
  universityId: number;
  title: string;
  content: string;
  isUpVote: boolean;
  upvotes?: number;
  downvotes?: number;
  totalVotes?: number;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    name?: string;
    emailId?: string;
  };
  comments?: SuggestionComment[];
}

// Interface for suggestion comments
export interface SuggestionComment {
  commentId: number;
  authId: string;
  postId: number;
  content: string;
  votes: number;
  upvotes?: number;
  downvotes?: number;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    name?: string;
    emailId?: string;
  };
}

// Type for creating a new suggestion post
export type CreateSuggestionInput = z.infer<typeof createSuggestionSchema>;

// Type for creating a new suggestion comment
export type CreateSuggestionCommentInput = z.infer<
  typeof createSuggestionCommentSchema
>;
