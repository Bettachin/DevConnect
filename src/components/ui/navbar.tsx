"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Menu,
  Home,
  LogIn,
  LogOut,
  UserPlus,
  FilePlus,
} from "lucide-react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<{ username: string; avatar?: string } | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setHasMounted(true);
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
      try {
        setUserInfo(JSON.parse(user));
      } catch {
        setUserInfo(null);
      }
    } else {
      setIsLoggedIn(false);
      setUserInfo(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  // Hide navbar on admin route
  if (!hasMounted || pathname.startsWith("/admin")) return null;

  const NavButton = ({
    href,
    label,
    icon,
    show = true,
  }: {
    href: string;
    label: string;
    icon: React.ReactNode;
    show?: boolean;
  }) => {
    if (!show) return null;
    return (
      <Link href={href}>
        <Button variant="ghost" className="w-full justify-start gap-2">
          {icon}
          {label}
        </Button>
      </Link>
    );
  };

  const hideHomePaths = ["/", "/home", "/login", "/register"];
  const hidePostPaths = ["/dashboard/post"];

  return (
    <nav className="w-full px-6 py-4 border-b shadow-sm flex justify-between items-center bg-white">
      <Link href="/" className="text-xl font-bold">
        DevConnect
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex gap-4 items-center">
        <NavButton
          href="/home"
          label="Home"
          icon={<Home className="w-4 h-4" />}
          show={!hideHomePaths.includes(pathname)}
        />
        {isLoggedIn && !hidePostPaths.includes(pathname) && (
          <NavButton
            href="/dashboard/post"
            label="Make a Post"
            icon={<FilePlus className="w-4 h-4" />}
          />
        )}
        {!isLoggedIn ? (
          <>
            <NavButton
              href="/login"
              label="Login"
              icon={<LogIn className="w-4 h-4" />}
            />
            <NavButton
              href="/register"
              label="Register"
              icon={<UserPlus className="w-4 h-4" />}
            />
          </>
        ) : (
          <>
            {userInfo && (
              <div className="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded-md">
                <img
                  src={userInfo.avatar || "https://i.pravatar.cc/100"}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium">{userInfo.username}</span>
              </div>
            )}
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </>
        )}
      </div>

      {/* Mobile nav */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="pt-12 space-y-2">
            <SheetHeader>
              <SheetTitle className="text-lg">Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-2 mt-4">
              <NavButton
                href="/home"
                label="Home"
                icon={<Home className="w-4 h-4" />}
                show={!hideHomePaths.includes(pathname)}
              />
              {isLoggedIn && !hidePostPaths.includes(pathname) && (
                <NavButton
                  href="/dashboard/post"
                  label="Make a Post"
                  icon={<FilePlus className="w-4 h-4" />}
                />
              )}
              {!isLoggedIn ? (
                <>
                  <NavButton
                    href="/login"
                    label="Login"
                    icon={<LogIn className="w-4 h-4" />}
                  />
                  <NavButton
                    href="/register"
                    label="Register"
                    icon={<UserPlus className="w-4 h-4" />}
                  />
                </>
              ) : (
                <>
                  {userInfo && (
                    <div className="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded-md">
                      <img
                        src={userInfo.avatar || "https://i.pravatar.cc/100"}
                        alt="avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm font-medium">{userInfo.username}</span>
                    </div>
                  )}
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
