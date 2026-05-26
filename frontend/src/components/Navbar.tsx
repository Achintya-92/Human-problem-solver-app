"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn, LogOut, PlusCircle, User } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/Button";
import { cn } from "@/lib/cn";
import { useAuth } from "./providers/AuthProvider";

export function Navbar() {
  const pathname = usePathname();
  const { status, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-[rgb(var(--border))] bg-[rgb(var(--background))]/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-2xl bg-[rgb(var(--primary))] shadow-sm" />
          <div className="leading-tight">
            <div className="text-sm font-semibold">Human Problem Solver</div>
            <div className="text-xs text-[rgb(var(--muted-foreground))]">experience-first solutions</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <Link
            className={cn(
              "rounded-xl px-3 py-2 text-sm hover:bg-[rgb(var(--muted))]",
              pathname === "/" && "bg-[rgb(var(--muted))]",
            )}
            href="/"
          >
            Home
          </Link>
          <Link
            className={cn(
              "rounded-xl px-3 py-2 text-sm hover:bg-[rgb(var(--muted))]",
              pathname === "/ask" && "bg-[rgb(var(--muted))]",
            )}
            href="/ask"
          >
            Ask
          </Link>
          {status === "authed" && (
            <Link
              className={cn(
                "rounded-xl px-3 py-2 text-sm hover:bg-[rgb(var(--muted))]",
                pathname.startsWith("/dashboard") && "bg-[rgb(var(--muted))]",
              )}
              href="/dashboard"
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Link href="/ask" className="hidden sm:block">
            <Button variant="outline" size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              Ask a problem
            </Button>
          </Link>

          {status === "authed" ? (
            <>
              <Link href={`/u/${user?.username ?? user?.id ?? ""}`}>
                <Button variant="ghost" size="sm">
                  <User className="mr-2 h-4 w-4" />
                  {user?.name ?? "Profile"}
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

