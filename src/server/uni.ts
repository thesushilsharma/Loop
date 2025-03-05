import { db } from "@/drizzle/db";
import { universities } from "@/drizzle/schema";
import {eq} from "drizzle-orm"

export async function getAllUniversities() {
    try {
        // Query the universities table
        const result = await db.select().from(universities);

        // Return the list of universities
        return result;
    } catch (error) {
        console.error("Error fetching universities:", error);
        throw error; // Re-throw the error for handling at a higher level
    }
}

export async function getUniversityById(university_id: number) {
    try {
        console.log('uniId', university_id); // Log the university_id for debugging

        // Query the universities table and filter by university_id
        const result = await db.select().from(universities).where(
            eq(universities.universityId, university_id)
        );

        // If no university is found, return null
        if (result.length === 0) {
            return null;
        }

        // Return the first matching university
        return result[0];
    } catch (error) {
        console.error("Error fetching university by ID:", error);
        throw error; // Re-throw the error for handling at a higher level
    }
}