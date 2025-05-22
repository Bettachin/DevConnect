"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Post = {
  id: number;
  username: string;
  content: string;
  image?: string;
  comments: { id: number; username: string; content: string }[];
  likes: number;
};

export default function MakePostPage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");

  const username = "Bettachin";

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
      comments: [],
      likes: 0,
    };

    const existingPosts = JSON.parse(localStorage.getItem("posts") || "[]");
    const updatedPosts = [newPost, ...existingPosts];

    localStorage.setItem("posts", JSON.stringify(updatedPosts));
    localStorage.setItem("hasNewPost", "true"); // trigger refresh on /home

    setContent("");
    setImage("");
    setError("");
    router.push("/home");
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
          />
        </div>
        {error && <p className="text-red-600">{error}</p>}
        <Button type="submit" className="w-full">Post</Button>
      </form>
    </main>
  );
}
