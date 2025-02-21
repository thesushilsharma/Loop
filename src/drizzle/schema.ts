import {
    pgTable,
    serial,
    varchar,
    boolean,
    timestamp,
    integer,
    text,
    uuid,
    index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

const createdAt = timestamp("created_at").notNull().defaultNow();
const updatedAt = timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date());

// Users table
export const users = pgTable(
    "users",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        authId: text("auth_Id").notNull().unique(),
        name: text("name").notNull(),
        emailId: text("email").notNull().unique(), //passwordless login email otp
        createdAt,
    },
    (table) => [
        index("auth_user_id_idx").on(table.authId),
        index("email_idx").on(table.emailId),
    ]
);

// Universities table
export const universities = pgTable("universities", {
    universityId: serial("university_id").primaryKey(),
    title: varchar("title", { length: 100 }).notNull(),
    description: text("description"),
    country: varchar("country", { length: 100 }).notNull(),
    region: varchar("region", { length: 100 }).notNull(),
    address: text("address").notNull(),
    maps: text("maps_url"),
    imageUrl: varchar("image_url", { length: 255 }),
    websiteLink: varchar("website_url", { length: 255 }).notNull(),
    linkedinLink: varchar("linkedin_url", { length: 255 }),
    rating: integer("rating"),
    createdAt,
});

// Reviews table
export const reviews = pgTable(
    "reviews",
    {
        reviewId: serial("review_id").primaryKey(),
        authId: text("auth_Id")
            .notNull()
            .references(() => users.authId, {
                onDelete: "cascade",
            }),
        universityId: serial("university_id")
            .notNull()
            .references(() => universities.universityId, {
                onDelete: "cascade",
            }),
        rating: integer("rating").notNull().notNull(),
        content: text("content").notNull(),
        votes: integer("votes").notNull().default(0),
        createdAt: timestamp("created_at").defaultNow(),
        updatedAt: timestamp("updated_at").defaultNow(),
    },
    (table) => [index("user_review_idx").on(table.authId, table.universityId)]
);

// Posts table
export const posts = pgTable(
    "posts",
    {
        postId: serial("post_id").primaryKey(),
        authId: text("auth_Id")
            .notNull()
            .references(() => users.authId, {
                onDelete: "cascade",
            }),
        universityId: serial("university_id")
            .notNull()
            .references(() => universities.universityId, {
                onDelete: "cascade",
            }),
        title: varchar("title", { length: 200 }).notNull(),
        content: text("content").notNull(),
        isUpVote: boolean("is_up_vote").notNull().default(false),
        createdAt,
        updatedAt,
    },
    (table) => [
        index("title_idx").on(table.title),
        index("user_post_idx").on(table.authId),
    ]
);

// Comments table
export const comments = pgTable(
    "comments",
    {
        commentId: serial("comment_id").primaryKey(),
        authId: text("auth_Id")
            .notNull()
            .references(() => users.authId, {
                onDelete: "cascade",
            }),
        postId: serial("post_id")
            .notNull()
            .references(() => posts.postId, {
                onDelete: "cascade",
            }),
        content: text("content").notNull(),
        votes: integer("votes").notNull().default(0),
        createdAt,
        updatedAt,
    },
    (table) => [index("user_comment_idx").on(table.authId)]
);

// Relations
export const universityRelations = relations(universities, ({ many }) => ({
    reviews: many(reviews),
    posts: many(posts),
}));

export const postRelations = relations(posts, ({ one, many }) => ({
    university: one(universities, {
        fields: [posts.universityId],
        references: [universities.universityId],
    }),
    comments: many(comments),
}));

export const commentRelations = relations(comments, ({ one }) => ({
    post: one(posts, {
        fields: [comments.postId],
        references: [posts.postId],
    }),
}));

export const reviewRelations = relations(reviews, ({ one }) => ({
    university: one(universities, {
        fields: [reviews.universityId],
        references: [universities.universityId],
    }),
}));

// Users insert schema
export const insertUserSchema = createInsertSchema(users).omit({
    id: true,
    createdAt: true,
});

// University insert schema
export const insertUniversitySchema = createInsertSchema(universities).omit({
    universityId: true,
    createdAt: true,
});

// Review insert schema
export const insertReviewSchema = createInsertSchema(reviews).omit({
    reviewId: true,
    votes: true,
    createdAt: true,
    updatedAt: true,
});

// Post insert schema
export const insertPostSchema = createInsertSchema(posts).omit({
    postId: true,
    createdAt: true,
    updatedAt: true,
});

// Comment insert schema
export const insertCommentSchema = createInsertSchema(comments).omit({
    commentId: true,
    votes: true,
    createdAt: true,
    updatedAt: true,
});

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
