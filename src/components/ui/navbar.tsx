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

function DevConnectLogo() {
  // Example minimal SVG logo you can replace with your own
  return (
    <svg
      className="w-8 h-8 text-black-600"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12l2 2 4-4" />
    </svg>
  );
}

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

  if (!hasMounted || pathname === "/" || pathname.startsWith("/admin")) return null;

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
  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <nav className="w-full px-6 py-4 border-b shadow-sm flex justify-between items-center bg-white/90 backdrop-blur-md animate-fade-in transition-opacity duration-500">
      {/* Logo + Text Link */}
      <Link
        href="/"
        className="flex items-center gap-2 text-black-700 hover:text-black-900 transition font-semibold text-xl select-none"
        aria-label="DevConnect Home"
      >
        <DevConnectLogo />
        <span>DevConnect</span>
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex gap-6 items-center">
        <NavButton
          href="/home"
          label="Home"
          icon={<Home className="w-4 h-4" />}
          show={!hideHomePaths.includes(pathname)}
        />
        <NavButton
          href="/"
          label="Back to Home"
          icon={<Home className="w-4 h-4" />}
          show={isAuthPage}
        />
        {isLoggedIn && !hidePostPaths.includes(pathname) && (
          <NavButton
            href="/dashboard/post"
            label="Make a Post"
            icon={<FilePlus className="w-4 h-4" />}
          />
        )}

        {/* Profile button for logged-in users */}
        {isLoggedIn && userInfo && (
          <NavButton
            href={`/profile/${userInfo.username}`}
            label="My Profile"
            icon={<UserPlus className="w-4 h-4" />}
          />
        )}

        {!isLoggedIn ? (
          <>
            <NavButton href="/login" label="Login" icon={<LogIn className="w-4 h-4" />} />
            <NavButton href="/register" label="Register" icon={<UserPlus className="w-4 h-4" />} />
          </>
        ) : (
          <>
            {userInfo && (
              <div className="flex items-center gap-3 px-3 py-1 bg-gray-100 rounded-md select-none">
                <img
                  src={userInfo.avatar || "https://i.pravatar.cc/100"}
                  alt="User avatar"
                  className="w-9 h-9 rounded-full object-cover"
                  loading="lazy"
                />
                <span className="text-sm font-medium text-gray-700">{userInfo.username}</span>
              </div>
            )}
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="flex items-center gap-2"
              aria-label="Logout"
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
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="pt-12 space-y-4">
            <SheetHeader>
              <SheetTitle className="text-lg font-semibold">Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-3 mt-4">
              <NavButton
                href="/home"
                label="Home"
                icon={<Home className="w-4 h-4" />}
                show={!hideHomePaths.includes(pathname)}
              />
              <NavButton
                href="/"
                label="Back to Home"
                icon={<Home className="w-4 h-4" />}
                show={isAuthPage}
              />
              {isLoggedIn && !hidePostPaths.includes(pathname) && (
                <NavButton
                  href="/dashboard/post"
                  label="Make a Post"
                  icon={<FilePlus className="w-4 h-4" />}
                />
              )}

              {/* Profile button for logged-in users */}
              {isLoggedIn && userInfo && (
                <NavButton
                  href={`/profile/${userInfo.username}`}
                  label="My Profile"
                  icon={<UserPlus className="w-4 h-4" />}
                />
              )}

              {!isLoggedIn ? (
                <>
                  <NavButton href="/login" label="Login" icon={<LogIn className="w-4 h-4" />} />
                  <NavButton href="/register" label="Register" icon={<UserPlus className="w-4 h-4" />} />
                </>
              ) : (
                <>
                  {userInfo && (
                    <div className="flex items-center gap-3 px-3 py-2 bg-gray-100 rounded-md select-none">
                      <img
                        src={userInfo.avatar || "https://i.pravatar.cc/100"}
                        alt="User avatar"
                        className="w-9 h-9 rounded-full object-cover"
                        loading="lazy"
                      />
                      <span className="text-sm font-medium text-gray-700">{userInfo.username}</span>
                    </div>
                  )}
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="w-full justify-start gap-2"
                    aria-label="Logout"
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
