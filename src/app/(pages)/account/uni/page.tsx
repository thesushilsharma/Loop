import { SearchForm } from "@/components/search-form";
import { Suspense } from "react";
import SearchFormSkeleton from "./loading";

export default async function Universities() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-6 text-center">
        All Universities
      </h1>

      <div className="flex justify-center mb-6">
        <Suspense fallback={<SearchFormSkeleton />}>
          <SearchForm />
        </Suspense>
      </div>
    </div>
  );
}
