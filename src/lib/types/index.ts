import type { z } from "zod";
import type {
  comments,
  insertCommentSchema,
  insertPostSchema,
  insertReviewSchema,
  insertUniCommentSchema,
  insertUniReplySchema,
  insertUniVoteSchema,
  insertUniversitySchema,
  insertUserSchema,
  posts,
  reviews,
  uniComments,
  uniReplies,
  uniVotes,
  universities,
} from "@/drizzle/schema";

// Types
export type University = typeof universities.$inferSelect;
export type NewUniversity = typeof universities.$inferInsert;
export type UniComments = typeof uniComments.$inferSelect;
export type NewUniComments = typeof uniComments.$inferInsert;
export type UniReplies = typeof uniReplies.$inferSelect;
export type NewUniReplies = typeof uniReplies.$inferInsert;
export type UniVotes = typeof uniVotes.$inferSelect;
export type NewUniVotes = typeof uniVotes.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertUniversity = z.infer<typeof insertUniversitySchema>;
export type InsertUniComment = z.infer<typeof insertUniCommentSchema>;
export type InsertUniReply = z.infer<typeof insertUniReplySchema>;
export type InsertUniVote = z.infer<typeof insertUniVoteSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type InsertPost = z.infer<typeof insertPostSchema>;
