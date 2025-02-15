import { z } from "zod"
import { insertUniversitySchema, locationSchema, reviewSchema } from "../schema/uni-validations"
import { insertCommentSchema, insertPostSchema } from "../schema/post-validations"


// University Types
export type Location = z.infer<typeof locationSchema>
export type University = z.infer<typeof insertUniversitySchema>
export type Review = z.infer<typeof reviewSchema>


// Post Types
export type Post = z.infer<typeof insertPostSchema>
export type Comment = z.infer<typeof insertCommentSchema>