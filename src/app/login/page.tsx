"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // ✅ Check hardcoded users
    if (username === "Bettachin" && password === "12345678") {
      const fakeUser: User = {
        id: 1,
        name: "Bettachin",
        username: "Bettachin",
        email: "zedric.abejuela@sorsu.edu.ph",
      };
      localStorage.setItem("user", JSON.stringify(fakeUser));
      router.push("/home");
      return;
    }

    if (username === "Zedric" && password === "12345678") {
      const fakeUser: User = {
        id: 2,
        name: "Zedric",
        username: "Zedric",
        email: "zedric.abejuela@sorsu.edu.ph",
      };
      localStorage.setItem("user", JSON.stringify(fakeUser));
      router.push("/home");
      return;
    }

    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      const users: User[] = await res.json();

      const matchedUser = users.find((user) => user.username === username);

      if (!matchedUser) {
        setError("Username not found.");
        return;
      }

      if (password === "12345678") {
        localStorage.setItem("user", JSON.stringify(matchedUser));
        router.push("/home");
      } else {
        setError("Invalid password.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold mb-6">User Login</h1>
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm space-y-4 border rounded-lg p-6 shadow"
      >
        <div>
          <Label>Username</Label>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
          />
        </div>
        <div>
          <Label>Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </main>
  );
}
