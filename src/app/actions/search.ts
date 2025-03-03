"use server";

import { getAllUniversities } from "@/server/uni";

export async function fetchUniversities(formData: FormData) {
  const query = (formData.get("query") as string) || "";
  console.log("query", query)
  const sortBy = formData.get("sortBy") || undefined;
  const universities = await getAllUniversities();

  const filteredUniversities = universities.filter(
    (uni) =>
      (uni.title || "").toLowerCase().includes(query.toLowerCase()) ||
      (uni.address || "").toLowerCase().includes(query.toLowerCase())
  );
  console.log("filteredUniversities", filteredUniversities)

  filteredUniversities.sort((a, b) => {
    if (sortBy === "rating") {
      return (b.rating || 0) - (a.rating || 0); // Handle null ratings
    } else {
      return a.title.localeCompare(b.title);
    }
  });

  return filteredUniversities;
}