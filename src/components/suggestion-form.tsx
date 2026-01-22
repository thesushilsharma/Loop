"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createSuggestion } from "@/app/actions/suggestions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SuggestionFormProps {
  universityId: number;
}

export function SuggestionForm({ universityId }: SuggestionFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Create form data
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("universityId", universityId.toString());

    startTransition(async () => {
      try {
        const result = await createSuggestion(formData);
        if (result.error) {
          setError(result.error);
          return;
        }

        // Reset form
        setTitle("");
        setContent("");
        setSuccess(true);

        // Refresh the page
        router.refresh();
      } catch (err) {
        console.error("Error creating suggestion:", err);
        setError("Failed to create suggestion");
      }
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create a Suggestion</h2>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4 bg-green-100 dark:bg-green-900">
          <AlertDescription>Suggestion created successfully!</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for your suggestion"
            required
            minLength={3}
            maxLength={200}
            disabled={isPending}
          />
        </div>

        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Describe your suggestion in detail"
            required
            minLength={10}
            rows={5}
            disabled={isPending}
          />
        </div>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Submitting..." : "Submit Suggestion"}
        </Button>
      </form>
    </div>
  );
}
