"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, ThumbsUp } from "lucide-react";

interface Comment {
  id: number;
  postId: number;
  username: string;
  text: string;
}

interface Post {
  id: number;
  username: string;
  content: string;
  image?: string;
  comments?: Comment[];
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("posts");
    const storedPosts: Post[] = stored ? JSON.parse(stored) : [];
    setPosts(storedPosts);
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">All Posts & Comments</h1>
        <Button onClick={() => router.push("/admin")}>← Back to Admin</Button>
      </div>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">No posts available.</p>
      ) : (
        posts.map((post) => (
          <Card key={post.id} className="space-y-4">
            <CardContent>
              <div className="flex items-center gap-4 mb-2">
                <Avatar>
                  <AvatarFallback>{post.username[0]}</AvatarFallback>
                </Avatar>
                <p className="font-semibold">{post.username}</p>
              </div>
              <p className="text-lg mb-2">{post.content}</p>
              {post.image && (
                <img
                  src={post.image}
                  alt="Post image"
                  className="rounded-lg w-full max-h-96 object-cover mb-4"
                />
              )}
              <div className="flex items-center gap-4 text-muted-foreground">
                <ThumbsUp className="w-4 h-4" />
                <MessageSquare className="w-4 h-4" /> {post.comments?.length || 0} Comments
              </div>

              {post.comments && post.comments.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="font-medium">Comments:</p>
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="border rounded p-2">
                      <p className="font-semibold text-sm">{comment.username}</p>
                      <p className="text-sm">{comment.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </main>
  );
}
