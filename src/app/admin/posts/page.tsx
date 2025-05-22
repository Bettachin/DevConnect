"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, ThumbsUp } from "lucide-react";
import Image from "next/image";

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
    <main className="max-w-5xl mx-auto p-8 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold tracking-tight">All Posts & Comments</h1>
        <Button variant="outline" onClick={() => router.push("/admin")}>
          ← Back to Admin
        </Button>
      </div>

      {posts.length === 0 ? (
        <p className="text-center text-muted-foreground text-lg">No posts available.</p>
      ) : (
        posts.map((post) => (
          <Card key={post.id} className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="space-y-5">
              {/* User info */}
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="text-xl">{post.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <p className="text-xl font-semibold">{post.username}</p>
              </div>

              {/* Post content */}
              <p className="text-lg leading-relaxed whitespace-pre-wrap">{post.content}</p>

              {/* Post image */}
              {post.image && (
                <div className="relative w-full h-[24rem] rounded-lg overflow-hidden shadow-md">
                  <Image
                    src={post.image}
                    alt={`Image posted by ${post.username}`}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              {/* Post meta */}
              <div className="flex items-center gap-6 text-muted-foreground text-sm font-medium select-none">
                <div className="flex items-center gap-1">
                  <ThumbsUp className="w-5 h-5" />
                  <span>Likes</span> {/* You can add like count here */}
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-5 h-5" />
                  <span>{post.comments?.length ?? 0} Comments</span>
                </div>
              </div>

              {/* Comments section */}
              {post.comments && post.comments.length > 0 && (
                <section className="pt-4 border-t border-muted-foreground/30 space-y-4">
                  <h3 className="text-lg font-semibold">Comments</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                    {post.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="bg-muted p-3 rounded-md shadow-sm"
                      >
                        <p className="font-semibold text-sm">{comment.username}</p>
                        <p className="text-sm leading-snug whitespace-pre-wrap">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </main>
  );
}
