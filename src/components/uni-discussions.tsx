"use client";

import { Loader2 } from "lucide-react";
import { useDiscussions } from "@/hooks/useDiscussions";
import { PostForm } from "./post-form";

export function Discussions({ universityId }: { universityId: string }) {
  const { data: posts, isLoading, isError } = useDiscussions(universityId);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Discussions</h2>
      <PostForm universityId={universityId} />

      <div className="mt-8 space-y-4">
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-gray-600">Loading discussions...</span>
          </div>
        )}

        {isError && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            <p>Failed to load discussions. Please try again later.</p>
          </div>
        )}

        {!isLoading && !isError && posts?.length === 0 && (
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <p className="text-gray-600">
              No discussions yet. Start a new discussion!
            </p>
          </div>
        )}

        {!isLoading &&
          !isError &&
          posts?.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold mb-2">{post.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{post.content}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{post.users.email.split("@")[0]}</span>
                <div className="flex items-center gap-4">
                  <span>{post.vote_count} votes</span>
                  <span>
                    {post.created_at
                      ? new Date(post.created_at).toLocaleDateString()
                      : "Unknown date"}
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
