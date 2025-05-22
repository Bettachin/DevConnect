"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      router.push("/home");
    }
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-10 max-w-md w-full text-center space-y-6 text-black animate-fade-in">
        <h1 className="text-4xl font-bold">Welcome to DevConnect 🚀</h1>
        <p className="text-black/90">
          Please log in or register to access the website.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Button
            className="bg-white text-black hover:bg-gray-100 font-semibold px-6"
            onClick={() => router.push("/login")}
          >
            Login
          </Button>
          <Button
            variant="outline"
            className="border-white text-black hover:bg-black/10 font-semibold px-6"
            onClick={() => router.push("/register")}
          >
            Register
          </Button>
        </div>
      </div>
    </main>
  );
}
