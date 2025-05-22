"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  website?: string;
}

interface APIUser {
  id: number;
  name: string;
  username: string;
  email: string;
  website?: string;
}

const predefinedUsers: User[] = [
  {
    id: 1001,
    name: "Peter",
    username: "PetterPoints",
    email: "Pettern@petter.com",
    avatar: "https://i.pravatar.cc/150?img=12",
    website: "https://petter.dev",
  },
  {
    id: 1002,
    name: "Zedric",
    username: "zedric",
    email: "zedric@example.com",
    avatar: "https://i.pravatar.cc/150?img=31",
    website: "https://zedric.io",
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const mainUser = storedUser ? [JSON.parse(storedUser)] : [];

    const fetchUsers = async () => {
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      const data: APIUser[] = await res.json();

      const mappedData: User[] = data.map((user: APIUser) => ({
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: `https://i.pravatar.cc/150?u=${user.email}`,
        website: user.website ? `https://${user.website}` : undefined,
      }));

      const combinedUsers = [
        ...predefinedUsers,
        ...mainUser,
        ...mappedData,
      ].filter(
        (user, index, self) =>
          index === self.findIndex((u) => u.username === user.username)
      );

      setUsers(combinedUsers);
    };

    fetchUsers();
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <Button variant="outline" onClick={() => router.push("/admin")} className="mb-8">
        Back to Admin
      </Button>

      <h1 className="text-3xl font-semibold mb-6">All Users</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {users.map((user) => (
          <Card
            key={user.id}
            className="flex items-center space-x-4 p-6 hover:shadow-lg transition-shadow"
          >
            <Avatar className="w-16 h-16">
              {user.avatar ? (
                <AvatarImage src={user.avatar} alt={`${user.name} avatar`} />
              ) : (
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1">
              <h2 className="text-lg font-medium">{user.name}</h2>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              {user.website && (
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary underline hover:text-primary/80"
                >
                  Website
                </a>
              )}
            </div>
            <Link
              href={`/admin/users/${user.username}`}
              className="text-primary font-semibold hover:underline whitespace-nowrap"
            >
              View Profile →
            </Link>
          </Card>
        ))}
      </div>
    </main>
  );
}
