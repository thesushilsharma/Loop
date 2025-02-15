import { z } from "zod";

export const locationSchema = z.object({
  country: z.string().trim().nonempty("Country is required"),
  region: z.string().trim().nonempty("Region is required"),
  address: z.string().trim().nonempty("Address is required"),
});

export const insertUniversitySchema = z.object({
  universityId: z.string().uuid().optional(),
  title: z.string().trim().nonempty("University name is required").max(100),
  location: locationSchema,
  description: z.string().trim().max(1000).optional(),
  maps: z.string().trim().url("Please enter a valid maps URL").optional(),
  imageUrl: z.string().trim().url("Please enter a valid image URL").optional(),
  websiteLink: z.string().trim().url("Please enter a valid website URL"),
  linkedinLink: z.string().trim().url("Please enter a valid LinkedIn URL").optional(),
  rating: z.number().int().min(1).max(5),
});

export const reviewSchema = z.object({
  reviewId: z.string().uuid().optional(),
  userId: z.string().uuid(), 
  rating: z.number().int().min(1).max(5),
  content: z
    .string()
    .trim()
    .min(10, "Review must be at least 10 characters")
    .max(1000),
  votes: z.number().int().default(() => 0),
});
