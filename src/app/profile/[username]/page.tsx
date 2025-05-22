"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type UserProfile = {
  username: string;
  avatar?: string;
  coverPhoto?: string;
  bio?: string;
  location?: string;
  website?: string;
};

type Post = {
  id: string | number;
  username: string;
  title: string;
  content: string;
  // Add other fields if needed
};

export default function ProfilePage() {
  const params = useParams() as { username?: string };
  const username = params.username ?? "";

  const [user, setUser] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const localUserStr = localStorage.getItem("user");
    let localUser = null;
    try {
      localUser = localUserStr ? JSON.parse(localUserStr) : null;
    } catch {}

    if (localUser && localUser.username === username) {
      setUser({
        username: localUser.username,
        avatar: localUser.avatar || undefined,
        coverPhoto:
          "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1350&q=80",
        bio: "Hello! This is my bio. I love coding, traveling and cats.",
        location: "New York, USA",
        website: "https://example.com",
      });
    } else {
      setUser({
        username: username || "Unknown User",
        avatar: undefined,
        coverPhoto:
          "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1350&q=80",
        bio: "This user hasn’t added a bio yet.",
        location: "Unknown",
      });
    }

    // Fetch posts from localStorage and filter by username
    const localPostsStr = localStorage.getItem("posts");
    let allPosts: Post[] = [];
    try {
      allPosts = localPostsStr ? JSON.parse(localPostsStr) : [];
    } catch {}

    const userPosts = allPosts.filter((post) => post.username === username);
    setPosts(userPosts);
  }, [username]);

  if (!user) {
    return <div className="p-8 text-center">Loading profile...</div>;
  }

  return (
    <Card className="max-w-4xl mx-auto mt-8 overflow-hidden">
      {/* Cover Photo */}
      <div className="relative h-48 bg-gray-200">
        {user.coverPhoto ? (
          <img
            src={user.coverPhoto}
            alt="Cover Photo"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300" />
        )}
      </div>

      {/* Avatar and username */}
      <div className="relative px-6 pt-0 pb-6 flex items-end">
        <Avatar className="absolute -top-16 left-6 w-32 h-32 border-4 border-white shadow-md">
          {user.avatar ? (
            <AvatarImage src={user.avatar} alt={`${user.username} avatar`} />
          ) : (
            <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
          )}
        </Avatar>
        <div className="ml-44 flex flex-col gap-1">
          <h1 className="text-3xl font-bold">{user.username}</h1>
          <p className="text-muted-foreground max-w-lg">{user.bio}</p>
          <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
            {user.location && <div>📍 {user.location}</div>}
            {user.website && (
              <div>
                🔗{" "}
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-primary"
                >
                  {user.website}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="posts" className="px-6">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="py-4">
          {posts.length === 0 ? (
            <p className="text-muted-foreground">No posts available.</p>
          ) : (
            <ul className="space-y-4">
              {posts.map((post) => (
                <li key={post.id} className="border rounded-md p-4 shadow-sm">
                  <h3 className="text-lg font-semibold">{post.title}</h3>
                  <p className="mt-1 text-muted-foreground">{post.content}</p>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
        <TabsContent value="friends" className="py-4">
          <p className="text-muted-foreground">Friends list will be displayed here.</p>
        </TabsContent>
        <TabsContent value="about" className="py-4">
          <p className="text-muted-foreground">Additional info about the user.</p>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
