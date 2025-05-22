"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, Users, FileText, MessageCircle, Globe, LogOut } from "lucide-react";

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const authed = localStorage.getItem("admin-auth") === "true";
    setIsAuthenticated(authed);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin@admin.com" && password === "admin123") {
      localStorage.setItem("admin-auth", "true");
      setIsAuthenticated(true);
    } else {
      alert("Invalid credentials");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin-auth");
    setIsAuthenticated(false);
    router.refresh();
  };

  if (!isAuthenticated) {
    return (
      <main className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-6">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="space-y-4 p-6">
            <div className="flex flex-col items-center gap-2">
              <LayoutDashboard className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold text-center">Admin Login</h1>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    );
  }

  // Dummy/fake data
  const users = Array(11).fill({}); // hardcoded 11 users
  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  const commentCount = posts.reduce(
    (acc: number, post: any) => acc + (post.comments?.length || 0),
    0
  );

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Admin</p>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="outline">Admin Mode</Badge>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="shadow-sm">
            <CardContent className="p-4 flex flex-col gap-2">
              <Users className="text-blue-500" />
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-4 flex flex-col gap-2">
              <FileText className="text-green-500" />
              <p className="text-sm text-muted-foreground">Total Posts</p>
              <p className="text-2xl font-bold">{posts.length}</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-4 flex flex-col gap-2">
              <MessageCircle className="text-purple-500" />
              <p className="text-sm text-muted-foreground">Total Comments</p>
              <p className="text-2xl font-bold">{commentCount}</p>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-6" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button
            onClick={() => router.push("/admin/users")}
            className="w-full"
            variant="default"
          >
            <Users className="w-4 h-4 mr-2" />
            View All Users
          </Button>
          <Button
            onClick={() => router.push("/admin/posts")}
            className="w-full"
            variant="default"
          >
            <FileText className="w-4 h-4 mr-2" />
            View All Posts
          </Button>
          <Button
            onClick={() => router.push("/home")}
            className="w-full"
            variant="outline"
          >
            <Globe className="w-4 h-4 mr-2" />
            Go to Website
          </Button>
        </div>
      </div>
    </main>
  );
}
