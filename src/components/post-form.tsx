"use client";

import { useActionState, useEffect, useState } from "react";
import { postDiscussion } from "@/app/actions/postDiscussion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type PostFormResult = {
  success: boolean;
  message: string;
};

export function PostForm({ universityId }: { universityId: string }) {
  const initialState: PostFormResult = { success: false, message: "" };

  const [formState, formAction, isPending] = useActionState<
    PostFormResult,
    FormData
  >(postDiscussion, initialState);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (formState?.success) {
      setTitle("");
      setContent("");
    }
  }, [formState]);

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Post Form</h2>

      <form
        action={formAction}
        className="bg-white rounded-lg shadow-sm p-4 space-y-4"
      >
        <input type="hidden" name="universityId" value={universityId} />

        <div>
          <Input
            name="title"
            placeholder="Discussion title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isPending}
          />
        </div>

        <div>
          <textarea
            name="content"
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={isPending}
          />
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Posting..." : "Post Discussion"}
        </Button>

        {formState?.message && (
          <p
            className={`text-sm ${
              formState.success ? "text-green-600" : "text-red-600"
            }`}
          >
            {formState.message}
          </p>
        )}
      </form>
    </section>
  );
}
