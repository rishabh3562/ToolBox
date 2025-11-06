"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, LogIn, UserPlus } from "lucide-react";
import { useSession } from "next-auth/react";

export function HomeHeader() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <span className="text-xl font-bold">🧰</span>
          </div>
          <span className="text-xl font-bold">ToolBox</span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link href="/tools">
            <Button variant="ghost" className="text-base">
              Tools
            </Button>
          </Link>
          {mounted && session ? (
            <Link href="/admin">
              <Button className="h-10 px-4">
                Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          ) : mounted ? (
            <>
              <Link href="/login">
                <Button variant="ghost" className="h-10 px-4">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="h-10 px-4">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Get Started
                </Button>
              </Link>
            </>
          ) : (
            <div className="h-10 w-40" /> // Placeholder during SSR
          )}
        </nav>
      </div>
    </header>
  );
}
