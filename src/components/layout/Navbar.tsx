"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
      isScrolled ? "bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-lg shadow-slate-900/5 py-3" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative h-9 w-9 group-hover:scale-110 transition-transform">
            <Image 
              src="/adrinix/logo.png" 
              alt="Adrinix Logo" 
              fill
              className="object-contain"
            />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">
            Adrinix
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {["Features", "Enterprise", "Pricing", "Support"].map((item) => {
            const isPage = item === "Enterprise";
            return (
              <Link 
                key={item} 
                href={isPage ? "/enterprise" : `#${item.toLowerCase()}`}
                className="text-sm font-bold text-slate-500 hover:text-primary transition-colors uppercase tracking-widest px-1"
              >
                {item}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" className="font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 rounded-xl">
            <Link href="/dashboard">Log in</Link>
          </Button>
          <Button asChild className="font-bold premium-gradient text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all px-6">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
