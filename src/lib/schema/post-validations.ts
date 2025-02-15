import * as z from "zod"

export const insertPostSchema = z.object({
    postId: z.string().uuid().optional(),
    title: z.string().trim().nonempty("Title is required").max(200),
    content: z.string().trim().min(10, "Post must be at least 10 characters").max(5000),
    isUpVote: z.boolean().default(() => false),
})

export const insertCommentSchema = z.object({
    commentId: z.string().uuid().optional(),
    userId: z.string().uuid(),
    postId: z.string().uuid(),
    content: z.string().trim().nonempty("Comment is required").max(1000),
    votes: z.number().int().default(() => 0),
})