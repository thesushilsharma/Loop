import { comments, insertCommentSchema, insertPostSchema, insertReviewSchema, insertUniversitySchema, insertUserSchema, posts, reviews, universities } from "@/drizzle/schema";
import { z } from "zod"


// Types
export type University = typeof universities.$inferSelect;
export type NewUniversity = typeof universities.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertUniversity = z.infer<typeof insertUniversitySchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type InsertPost = z.infer<typeof insertPostSchema>;