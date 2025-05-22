"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Trash2 } from "lucide-react";

type Comment = { id: number; username: string; content: string };
type Post = {
  id: number;
  username: string;
  content: string;
  image?: string;
  comments: Comment[];
  likes: number;
};

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});
  const [showCommentBox, setShowCommentBox] = useState<{ [key: number]: boolean }>({});
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

  // Load posts and user info
  const loadPosts = () => {
    const storedPosts = localStorage.getItem("posts");
    if (storedPosts) setPosts(JSON.parse(storedPosts));
  };

  useEffect(() => {
    loadPosts();

    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setLoggedInUser(parsedUser.username);
      } catch {
        setLoggedInUser(null);
      }
    } else {
      setLoggedInUser(null);
    }

    // Poll for new posts flag
    const interval = setInterval(() => {
      const newPostFlag = localStorage.getItem("hasNewPost");
      if (newPostFlag === "true") {
        loadPosts();
        localStorage.setItem("hasNewPost", "false");
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Like post, only once per user
  const handleLike = (postId: number) => {
    const likedMap = JSON.parse(localStorage.getItem("likedPosts") || "{}");
    if (likedMap[postId]) return;

    const updated = posts.map((post) =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    );
    setPosts(updated);
    localStorage.setItem("posts", JSON.stringify(updated));
    likedMap[postId] = true;
    localStorage.setItem("likedPosts", JSON.stringify(likedMap));
  };

  // Add comment
  const submitComment = (postId: number) => {
    const comment = commentInputs[postId]?.trim();
    if (!comment) return;

    const newComment: Comment = {
      id: Date.now(),
      username: loggedInUser || "Anonymous",
      content: comment,
    };

    const updated = posts.map((post) =>
      post.id === postId
        ? { ...post, comments: [...post.comments, newComment] }
        : post
    );
    setPosts(updated);
    localStorage.setItem("posts", JSON.stringify(updated));
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    setShowCommentBox((prev) => ({ ...prev, [postId]: false }));
  };

  // Delete post (only if logged-in user owns it)
  const handleDelete = (postId: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    const updated = posts.filter((post) => post.id !== postId);
    setPosts(updated);
    localStorage.setItem("posts", JSON.stringify(updated));
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-extrabold mb-8 text-center">Posts</h1>

      {posts.length === 0 && (
        <p className="text-center text-muted-foreground">No posts yet.</p>
      )}

      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post.id} className="shadow-md">
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={`https://i.pravatar.cc/40?u=${post.username}`}
                    alt={post.username}
                  />
                  <AvatarFallback>{post.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="font-semibold">{post.username}</span>
              </div>
              {loggedInUser === post.username && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(post.id)}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              )}
            </CardHeader>

            <CardContent>
              <p className="mb-4 whitespace-pre-wrap">{post.content}</p>
              {post.image && (
                <img
                  src={post.image}
                  alt="Post image"
                  className="rounded-md max-w-full mb-4"
                />
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleLike(post.id)}
                  aria-label="Like post"
                >
                  <Heart className="text-pink-600" />
                </Button>
                <span>{post.likes} {post.likes === 1 ? "like" : "likes"}</span>

                <Button
                  size="sm"
                  onClick={() =>
                    setShowCommentBox((prev) => ({
                      ...prev,
                      [post.id]: !prev[post.id],
                    }))
                  }
                >
                  💬 Comment ({post.comments.length})
                </Button>
              </div>

              {showCommentBox[post.id] && (
                <div className="flex flex-col gap-2">
                  <Input
                    placeholder="Write a comment..."
                    value={commentInputs[post.id] || ""}
                    onChange={(e) =>
                      setCommentInputs((prev) => ({
                        ...prev,
                        [post.id]: e.target.value,
                      }))
                    }
                  />
                  <Button size="sm" onClick={() => submitComment(post.id)}>
                    Post Comment
                  </Button>
                </div>
              )}

              {post.comments.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Comments:</h3>
                  <ul className="space-y-1">
                    {post.comments.map((c) => (
                      <li key={c.id}>
                        <strong>{c.username}:</strong> {c.content}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
