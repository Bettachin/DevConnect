"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Load from localStorage or use mock data
    const storedUser = localStorage.getItem("user");
    const mainUser = storedUser ? [JSON.parse(storedUser)] : [];

    const fetchUsers = async () => {
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      const data = await res.json();
      setUsers([...mainUser, ...data]);
    };

    fetchUsers();
  }, []);

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <Button variant="outline" onClick={() => router.push("/admin")} className="mb-6">
        Back to Admin
      </Button>

      <h1 className="text-2xl font-bold mb-4">All Users</h1>
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="border p-4 rounded shadow-sm">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <Link
              href={`/admin/users/${user.id}`}
              className="text-blue-600 hover:underline"
            >
              View Profile
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
