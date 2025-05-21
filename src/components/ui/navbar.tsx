"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  const NavLinks = () => (
    <>
      <Link href="/" className="hover:underline">
        Home
      </Link>
      {isLoggedIn ? (
        <>
          <Link href="/app/dashboard/post" className="hover:underline">
            Make a Post
          </Link>
          <Button variant="ghost" onClick={handleLogout}>
            Logout
          </Button>
        </>
      ) : (
        <>
          <Link href="/login" className="hover:underline">
            Login
          </Link>
          <Link href="/register" className="hover:underline">
            Register
          </Link>
        </>
      )}
    </>
  );

  return (
    <nav className="w-full px-6 py-4 border-b shadow-sm flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">
        My App
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex gap-6 items-center">
        <NavLinks />
      </div>

      {/* Mobile nav */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="space-y-4 mt-10">
            <NavLinks />
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
