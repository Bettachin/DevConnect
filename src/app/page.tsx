// src/app/page.tsx
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center flex-col gap-4">
      <h1 className="text-4xl font-bold">Welcome to DevConnect</h1>
      <Button>Get Started</Button>
    </main>
  );
}
