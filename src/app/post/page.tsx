"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type CommentType = {
  id: number;
  username: string;
  text: string;
  replies: CommentType[];
};

type PostType = {
  id: number;
  username: string;
  content: string;
  image?: string;
  likes: number;
  likedByUser: boolean;
  comments: CommentType[];
};

const fakePosts: PostType[] = [
  {
    id: 1,
    username: "Bettachin",
    content: "Check out this beautiful sunset!",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    likes: 15,
    likedByUser: false,
    comments: [
      {
        id: 1,
        username: "JaneDoe",
        text: "Amazing photo!",
        replies: [
          {
            id: 11,
            username: "Bettachin",
            text: "Thank you!",
            replies: [],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    username: "TechGuru",
    content: "Just finished my new project!",
    likes: 5,
    likedByUser: false,
    comments: [],
  },
  // Add more fake posts here
];

export default function PublicPostsPage() {
  const [posts, setPosts] = useState<PostType[]>(fakePosts);

  // Like toggle logic (can expand later)
  const toggleLike = (postId: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              likedByUser: !post.likedByUser,
              likes: post.likedByUser ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  return (
    <main className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Posts from Other Users</h1>

      {posts.map((post) => (
        <div
          key={post.id}
          className="border rounded p-4 mb-6 bg-white shadow-sm"
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold">{post.username}</h2>
            <button
              onClick={() => toggleLike(post.id)}
              className={`font-semibold ${
                post.likedByUser ? "text-red-600" : "text-gray-500"
              }`}
            >
              ♥ {post.likes}
            </button>
          </div>
          <p className="mb-2">{post.content}</p>
          {post.image && (
            <img
              src={post.image}
              alt="post image"
              className="w-full max-h-80 object-cover rounded"
            />
          )}
          {/* Comments & replies UI can be added here later */}
        </div>
      ))}
    </main>
  );
}