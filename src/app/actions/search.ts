"use server";

import { getAllUniversities } from "@/drizzle/queries/uni";

export async function fetchUniversities(formData: FormData) {
  const query = (formData.get("query") as string) || "";
  const sortBy = formData.get("sortBy") || undefined;
  const universities = await getAllUniversities();

  const q = query.toLowerCase();
  const filteredUniversities = universities.filter((uni) => {
    const title = (uni.title || "").toLowerCase();
    const address = (uni.address || "").toLowerCase();
    const country = (uni.country || "").toLowerCase();
    const region = (uni.region || "").toLowerCase();
    return (
      title.includes(q) ||
      address.includes(q) ||
      country.includes(q) ||
      region.includes(q)
    );
  });

  filteredUniversities.sort((a, b) => {
    if (sortBy === "rating") {
      return Number(b.rating || 0) - Number(a.rating || 0);
    }
    return a.title.localeCompare(b.title);
  });

  return filteredUniversities;
}
