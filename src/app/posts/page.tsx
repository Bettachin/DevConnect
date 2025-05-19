'use client';

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
};

type Comment = {
  id: number;
  body: string;
  name: string;
  email: string;
  postId: number;
};

export default function PostsPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);

  const isAdmin = user?.email === "admin@admin.com" && user?.username === "admin123";

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((res) => res.json())
      .then((data) => {
        const filtered = isAdmin
          ? data
          : data.filter((post: Post) => post.userId === user?.id);
        setPosts(filtered);
      });
  }, [user]);

  const togglePost = async (postId: number) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
    } else {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
      );
      const data = await res.json();
      setComments(data);
      setExpandedPostId(postId);
    }
  };

  if (!user) return <p className="mt-10 text-center text-lg">Please log in to view posts.</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Posts</h1>
      {posts.map((post) => (
        <Card key={post.id} className="p-4 space-y-2">
          <div className="cursor-pointer" onClick={() => togglePost(post.id)}>
            <h2 className="text-xl font-semibold">{post.title}</h2>
          </div>
          {expandedPostId === post.id && (
            <div className="space-y-2 mt-2">
              <p>{post.body}</p>
              <Separator />
              <h3 className="font-medium">Comments:</h3>
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="text-sm border-t py-2">
                    <p className="font-semibold">{comment.name}</p>
                    <p className="text-muted-foreground">{comment.body}</p>
                  </div>
                ))
              ) : (
                <p>No comments found.</p>
              )}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}