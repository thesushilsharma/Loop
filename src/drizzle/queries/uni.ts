import { eq, sql } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { reviews, universities } from "@/drizzle/schema";

export async function getAllUniversities() {
  try {
    // Query the universities table with average ratings from reviews
    const result = await db
      .select({
        universityId: universities.universityId,
        title: universities.title,
        description: universities.description,
        country: universities.country,
        region: universities.region,
        address: universities.address,
        maps: universities.maps,
        imageUrl: universities.imageUrl,
        websiteLink: universities.websiteLink,
        linkedinLink: universities.linkedinLink,
        createdAt: universities.createdAt,
        averageRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`.as(
          "average_rating",
        ),
      })
      .from(universities)
      .leftJoin(reviews, eq(universities.universityId, reviews.universityId))
      .groupBy(universities.universityId);

    // Map the results to include the average rating
    const universitiesWithRatings = result.map((uni) => ({
      ...uni,
      rating: uni.averageRating || 0,
    }));

    // Return the list of universities with ratings
    return universitiesWithRatings;
  } catch (error) {
    console.error("Error fetching universities:", error);
    throw error; // Re-throw the error for handling at a higher level
  }
}

export async function getUniversityById(university_id: number) {
  try {
    console.log("uniId", university_id); // Log the university_id for debugging

    // Query the university with average rating from reviews
    const result = await db
      .select({
        universityId: universities.universityId,
        title: universities.title,
        description: universities.description,
        country: universities.country,
        region: universities.region,
        address: universities.address,
        maps: universities.maps,
        imageUrl: universities.imageUrl,
        websiteLink: universities.websiteLink,
        linkedinLink: universities.linkedinLink,
        createdAt: universities.createdAt,
        averageRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`.as(
          "average_rating",
        ),
      })
      .from(universities)
      .leftJoin(reviews, eq(universities.universityId, reviews.universityId))
      .where(eq(universities.universityId, university_id))
      .groupBy(universities.universityId);

    // If no university is found, return null
    if (result.length === 0) {
      return null;
    }

    // Return the university with average rating
    const university = result[0];
    return {
      ...university,
      rating: university.averageRating || 0,
    };
  } catch (error) {
    console.error("Error fetching university by ID:", error);
    throw error; // Re-throw the error for handling at a higher level
  }
}
