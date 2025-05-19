'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { User } from "@/context/auth-context";

export default function DevelopersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Developer Directory</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <Link href={`/developers/${user.id}`} key={user.id}>
            <Card className="p-4 hover:shadow-md transition">
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-muted-foreground">@{user.username}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}