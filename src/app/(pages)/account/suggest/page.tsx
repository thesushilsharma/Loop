import type { Metadata } from "next";
import { SuggestionForm } from "@/components/suggestion-form";
import { SuggestionList } from "@/components/suggestion-list";

export const metadata: Metadata = {
  title: "Suggestions | Loop",
  description: "View and submit suggestions for Loop",
};

export default function SuggestionsPage() {
  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Suggestions</h1>
        <p className="text-muted-foreground">
          Share your ideas and vote on suggestions from the community.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <SuggestionList />
        </div>

        <div className="space-y-6">
          <div className="bg-muted p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Submit a Suggestion</h2>
            <SuggestionForm universityId={1} />
          </div>

          <div className="bg-muted p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Guidelines</h2>
            <ul className="space-y-2 text-sm">
              <li>• Be specific and clear about your suggestion</li>
              <li>• Check if a similar suggestion already exists</li>
              <li>• Be respectful and constructive</li>
              <li>• Upvote suggestions you support</li>
              <li>• Provide feedback on existing suggestions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
