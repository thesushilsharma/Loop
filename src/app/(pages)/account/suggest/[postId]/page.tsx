import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSuggestionById } from "@/app/actions/suggestions";
import { SuggestionDetail } from "@/components/suggestion-detail";
import type { SuggestionPost } from "@/lib/types/suggestions";

export async function generateMetadata({
  params,
}: {
  params: { postId: string };
}): Promise<Metadata> {
  const postId = parseInt(params.postId, 10);
  if (Number.isNaN(postId)) return { title: "Suggestion Not Found | Loop" };

  const suggestion = await getSuggestionById(postId);

  if (!suggestion) {
    return {
      title: "Suggestion Not Found | Loop",
    };
  }

  return {
    title: `${suggestion.title} | Loop Suggestions`,
    description: suggestion.content.substring(0, 160),
  };
}

export default async function SuggestionPage({
  params,
}: {
  params: { postId: string };
}) {
  const postId = parseInt(params.postId, 10);
  if (Number.isNaN(postId)) return notFound();

  const suggestion = await getSuggestionById(postId);
  if (!suggestion) return notFound();

  const suggestionWithIsUpVote = {
    ...suggestion,
    isUpVote: false, // Default value
  } as SuggestionPost;

  return (
    <div className="container py-8">
      <SuggestionDetail
        postId={postId}
        initialSuggestion={suggestionWithIsUpVote}
      />
    </div>
  );
}
