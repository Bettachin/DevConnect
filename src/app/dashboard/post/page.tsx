"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Post = {
  id: number;
  username: string;
  content: string;
  image?: string;
};

export default function MakePostPage() {
  const router = useRouter();

  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");

  const username = "Bettachin"; // Or get from logged-in user state

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("Post content is required");
      return;
    }

    const newPost: Post = {
      id: Date.now(),
      username,
      content,
      image: image.trim() || undefined,
    };

    // Get existing posts from localStorage or empty array
    const existingPosts = JSON.parse(localStorage.getItem("posts") || "[]");

    // Add new post at the start of the array
    const updatedPosts = [newPost, ...existingPosts];

    // Save back to localStorage
    localStorage.setItem("posts", JSON.stringify(updatedPosts));

    // Clear form
    setContent("");
    setImage("");
    setError("");

    // Redirect to posts page to see the new post
    router.push("/posts");
  };

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Make a Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Content</Label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            required
            rows={4}
          />
        </div>
        <div>
          <Label>Image URL (optional)</Label>
          <Input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Paste an image URL"
          />
        </div>
        {error && <p className="text-red-600 font-semibold">{error}</p>}
        <Button type="submit" className="w-full">
          Post
        </Button>
      </form>
    </main>
  );
}
