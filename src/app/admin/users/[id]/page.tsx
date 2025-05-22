"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone?: string;
  website?: string;
  company?: { name: string };
  address?: { street: string; city: string; zipcode: string };
};

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`https://jsonplaceholder.typicode.com/users/${params.id}`);
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch user", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [params.id]);

  if (loading) return <p className="p-4">Loading user data...</p>;

  if (!user) return <p className="p-4">User not found.</p>;

  return (
    <main className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-bold">User Profile: {user.name}</h1>

      <div>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
        {user.website && <p><strong>Website:</strong> {user.website}</p>}
        {user.company && <p><strong>Company:</strong> {user.company.name}</p>}
        {user.address && (
          <p>
            <strong>Address:</strong> {user.address.street}, {user.address.city} {user.address.zipcode}
          </p>
        )}
      </div>

      <Button onClick={() => router.push("/admin/users")} variant="outline">
        Back to Admin
      </Button>
    </main>
  );
}
