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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

  // Modal state for delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);

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
  };

  // Show delete confirmation modal
  const confirmDelete = (postId: number) => {
    setPostToDelete(postId);
    setDeleteDialogOpen(true);
  };

  // Actually delete the post
  const handleDelete = () => {
    if (postToDelete === null) return;
    const updated = posts.filter((post) => post.id !== postToDelete);
    setPosts(updated);
    localStorage.setItem("posts", JSON.stringify(updated));
    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-extrabold mb-10 text-center tracking-tight text-gray-900">
        Posts
      </h1>

      {posts.length === 0 && (
        <p className="text-center text-muted-foreground text-lg">No posts yet.</p>
      )}

      <div className="space-y-8">
        {posts.map((post) => (
          <Card
            key={post.id}
            className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg border border-gray-200"
          >
            <CardHeader className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12 ring-2 ring-indigo-500">
                  <AvatarImage
                    src={`https://i.pravatar.cc/40?u=${post.username}`}
                    alt={post.username}
                  />
                  <AvatarFallback className="uppercase font-semibold text-indigo-600">
                    {post.username[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="font-semibold text-lg text-gray-800">{post.username}</span>
              </div>
              {loggedInUser === post.username && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => confirmDelete(post.id)}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  Delete
                </Button>
              )}
            </CardHeader>

            <CardContent className="px-6 pt-0 pb-4">
              <p className="mb-5 whitespace-pre-wrap text-gray-700 leading-relaxed">{post.content}</p>
              {post.image && (
                <img
                  src={post.image}
                  alt="Post image"
                  className="rounded-lg max-w-full max-h-96 object-contain shadow-sm"
                  loading="lazy"
                />
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-4 px-6 py-4">
              <div className="flex items-center gap-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleLike(post.id)}
                  aria-label="Like post"
                  className="text-pink-600 hover:bg-pink-100"
                >
                  <Heart className="w-6 h-6" />
                </Button>
                <span className="font-medium text-gray-700 select-none">
                  {post.likes} {post.likes === 1 ? "like" : "likes"}
                </span>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setShowCommentBox((prev) => ({
                      ...prev,
                      [post.id]: !prev[post.id],
                    }))
                  }
                  className="ml-auto"
                >
                  💬 Comment ({post.comments.length})
                </Button>
              </div>

              {showCommentBox[post.id] && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitComment(post.id);
                  }}
                  className="flex flex-col gap-3 mt-2"
                >
                  <Input
                    placeholder="Write a comment..."
                    value={commentInputs[post.id] || ""}
                    onChange={(e) =>
                      setCommentInputs((prev) => ({
                        ...prev,
                        [post.id]: e.target.value,
                      }))
                    }
                    className="border-indigo-500 focus:ring-indigo-500 focus:ring-1"
                    autoFocus
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="self-end bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Post Comment
                  </Button>
                </form>
              )}

              {post.comments.length > 0 && (
                <section className="mt-4 border-t border-gray-200 pt-4 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-3">Comments</h3>
                  <ul className="space-y-3">
                    {post.comments.map((c) => (
                      <li
                        key={c.id}
                        className="bg-gray-50 p-3 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
                      >
                        <strong className="text-indigo-600">{c.username}:</strong>{" "}
                        <span className="text-gray-700">{c.content}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
