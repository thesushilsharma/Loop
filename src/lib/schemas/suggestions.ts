import { z } from 'zod';

// Schema for creating a new suggestion post
export const createSuggestionSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200, "Title must be less than 200 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  universityId: z.coerce.number().int().positive("University ID is required"),
});

// Schema for updating an existing suggestion post
export const updateSuggestionSchema = createSuggestionSchema.partial().extend({
  postId: z.coerce.number().int().positive("Post ID is required"),
});

// Schema for deleting a suggestion post
export const deleteSuggestionSchema = z.object({
  postId: z.coerce.number().int().positive("Post ID is required"),
});

// Schema for voting on a suggestion post
export const voteSuggestionSchema = z.object({
  postId: z.coerce.number().int().positive("Post ID is required"),
  isUpvote: z.boolean(),
});

// Schema for creating a comment on a suggestion post
export const createSuggestionCommentSchema = z.object({
  postId: z.coerce.number().int().positive("Post ID is required"),
  content: z.string().min(1, "Comment cannot be empty").max(1000, "Comment is too long"),
});

// Schema for updating a comment
export const updateSuggestionCommentSchema = z.object({
  commentId: z.coerce.number().int().positive("Comment ID is required"),
  content: z.string().min(1, "Comment cannot be empty").max(1000, "Comment is too long"),
});

// Schema for deleting a comment
export const deleteSuggestionCommentSchema = z.object({
  commentId: z.coerce.number().int().positive("Comment ID is required"),
});

// Schema for voting on a comment
export const voteSuggestionCommentSchema = z.object({
  commentId: z.coerce.number().int().positive("Comment ID is required"),
  isUpvote: z.boolean(),
});