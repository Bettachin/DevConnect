"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      router.push("/home");
    }
  }, [router]);

  const teamMembers = [
    {
      name: "Zedric Abejuela",
      role: "Frontend & Backend Develeper, Deployment, Repository",
      img: "/team/zedric.jpg",
    },
    {
      name: "Gabriel Atanoso",
      role: "Details",
      img: "/team/gabriel.jpg",
    },
    {
      name: "Nelia Meranda",
      role: "Details",
      img: "/team/nelia.jpg",
    },
    {
      name: "Gerald Hachaso",
      role: "Details",
      img: "/team/gerald.jpg",
    },
  ];

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-gray-100 to-white py-20 px-6">
      {/* Welcome Section */}
      <section className="max-w-2xl mx-auto mb-16 text-center space-y-6 bg-white shadow-xl rounded-2xl p-10 border">
        <h1 className="text-4xl font-bold">Welcome to DevConnect <span className="text-5xl inline-block align-middle">🤝</span></h1>
        <p className="text-muted-foreground text-lg">
          Connect. Share. Collaborate. Start your journey with us.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Button
            className="px-6 py-2"
            onClick={() => router.push("/login")}
          >
            Login
          </Button>
          <Button
            variant="outline"
            className="px-6 py-2"
            onClick={() => router.push("/register")}
          >
            Register
          </Button>
        </div>
      </section>

      {/* Meet the Makers Section */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Meet the Makers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <Card key={member.name} className="hover:shadow-2xl transition-shadow">
              <CardHeader className="flex flex-col items-center">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={member.img} alt={member.name} />
                  <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <CardTitle className="mt-4 text-center">{member.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                {member.role}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
