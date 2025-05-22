"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type User = {
  id?: number;
  name: string;
  username: string;
  email?: string;
  phone?: string;
  website?: string;
  company?: { name: string };
  address?: { street: string; city: string; zipcode: string };
  avatar?: string;
  coverPhoto?: string;
  bio?: string;
  location?: string;
};

const predefinedUsers: Record<string, User> = {
  bettachin: {
    id: 1001,
    name: "Bettachin",
    username: "bettachin",
    email: "bettachin@example.com",
    phone: "123-456-7890",
    website: "https://bettachin.dev",
    company: { name: "Bettachin Inc." },
    address: { street: "123 Code St.", city: "Dev City", zipcode: "10101" },
    avatar: "https://i.pravatar.cc/150?img=12",
    coverPhoto: "https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?auto=format&fit=crop&w=1350&q=80",
    bio: "Passionate developer and coffee lover.",
    location: "San Francisco, CA",
  },
  zedric: {
    id: 1002,
    name: "Zedric",
    username: "zedric",
    email: "zedric@example.com",
    phone: "098-765-4321",
    website: "https://zedric.io",
    company: { name: "Zedric Solutions" },
    address: { street: "456 Dev Ave.", city: "Code Town", zipcode: "20202" },
    avatar: "https://i.pravatar.cc/150?img=31",
    coverPhoto: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1350&q=80",
    bio: "Full-stack engineer and tech blogger.",
    location: "New York, NY",
  },
};

export default function UserProfilePage() {
  const params = useParams() as { id: string };
  const router = useRouter();
  const usernameOrId = params.id;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);

      // If username matches predefined user, use that profile
      if (usernameOrId in predefinedUsers) {
        setUser(predefinedUsers[usernameOrId]);
        setLoading(false);
        return;
      }

      // Otherwise, try fetching by ID (numeric)
      try {
        const res = await fetch(`https://jsonplaceholder.typicode.com/users/${usernameOrId}`);
        if (!res.ok) throw new Error("User not found");
        const data = await res.json();
        setUser({
          ...data,
          avatar: `https://i.pravatar.cc/150?u=${data.email}`, // generate avatar from email
          coverPhoto:
            "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1350&q=80",
          bio: "This user hasn’t added a bio yet.",
          location: data.address ? `${data.address.city}, ${data.address.street}` : undefined,
        });
      } catch (err) {
        console.error("Failed to fetch user", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [usernameOrId]);

  if (loading) return <p className="p-4 text-center">Loading user data...</p>;
  if (!user) return <p className="p-4 text-center">User not found.</p>;

  return (
    <main className="max-w-3xl mx-auto mt-8">
      <Card className="overflow-hidden">
        {/* Cover Photo */}
        <div className="relative h-48 bg-gray-200">
          {user.coverPhoto ? (
            <img
              src={user.coverPhoto}
              alt={`${user.name} cover photo`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-300" />
          )}
        </div>

        {/* Avatar and name */}
        <div className="relative px-6 pt-0 pb-6 flex items-end">
          <Avatar className="absolute -top-16 left-6 w-32 h-32 border-4 border-white shadow-md">
            {user.avatar ? (
              <AvatarImage src={user.avatar} alt={`${user.name} avatar`} />
            ) : (
              <AvatarFallback>{user.name[0].toUpperCase()}</AvatarFallback>
            )}
          </Avatar>
          <div className="ml-44 flex flex-col gap-1">
            <h1 className="text-3xl font-bold">{user.name}</h1>
            {user.bio && <p className="text-muted-foreground max-w-lg">{user.bio}</p>}
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

        {/* User info details */}
        <div className="px-6 pb-6 space-y-2">
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          {user.email && (
            <p>
              <strong>Email:</strong>{" "}
              <a href={`mailto:${user.email}`} className="underline hover:text-primary">
                {user.email}
              </a>
            </p>
          )}
          {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
          {user.company && <p><strong>Company:</strong> {user.company.name}</p>}
          {user.address && (
            <p>
              <strong>Address:</strong> {user.address.street}, {user.address.city} {user.address.zipcode}
            </p>
          )}
        </div>
      </Card>

      <div className="max-w-3xl mx-auto p-4 flex justify-start">
        <Button onClick={() => router.push("/admin/users")} variant="outline">
          Back to Admin
        </Button>
      </div>
    </main>
  );
}
