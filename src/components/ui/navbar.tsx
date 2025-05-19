'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex justify-between items-center px-6 py-4 border-b shadow-sm">
      <Link href="/" className="text-xl font-bold">DevConnect</Link>
      <div className="space-x-4">
        <Link href="/register">
        <Button variant="ghost">Register</Button>
        </Link>
        <Link href="/posts">
        <Button variant="ghost">Posts</Button>
        </Link>
        <Link href="/developers">
          <Button variant="ghost">Developers</Button>
        </Link>
        {user && (
          <Link href="/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
        )}
        {user ? (
        <>
          <span>Welcome, {user.name}</span>
          <button onClick={logout} className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">
            Logout
          </button>
        </>
      ) : (
          <Link href="/login">
            <Button>Login</Button>
          </Link>
          
        )}
        
      </div>
    </nav>
  );
}