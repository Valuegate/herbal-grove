"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/**
 * Navbar — fixed navigation bar with desktop links and mobile Sheet drawer.
 * Applies a scroll-based shadow effect after 20px of scroll.
 */

const navLinks = [
  { label: "Home", href: "#" },
  { label: "What You Can Do", href: "#what-herbagrove-does" },
  { label: "Safety", href: "#how-it-works" },
];

function LeafLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path
        d="M16 4C21 6 25 10 25 15C25 20 21 24 16 24L16 4Z"
        fill="#1a7a1e"
      />
      <path
        d="M16 6C11 6 7 10 7 15C7 20 11 24 16 24L16 6Z"
        fill="#1a7a1e"
        opacity="0.4"
      />
      <path
        d="M16 8L16 26"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M16 14C16 14 13 11 10 12"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M16 18C16 18 19 15 22 16"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-4 pt-4">
      <nav
        className={`mx-auto max-w-[1120px] flex items-center justify-between bg-white rounded-xl px-6 transition-all duration-300 ${
          scrolled
            ? "py-3 shadow-nav"
            : "py-4 shadow-[0_0_4px_0_rgba(0,0,0,0.1)]"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <LeafLogo />
          <span className="font-heading font-bold text-2xl text-brand-primary">
            Herbagrove
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-medium text-body-text text-base hover:text-brand-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop auth */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/sign-in"
            className="font-medium text-body-text text-base hover:text-brand-primary transition-colors"
          >
            Log in
          </Link>
          <Button className="bg-brand-primary hover:bg-brand-700 text-white rounded-full px-6 py-2 font-medium h-12">
            Get Started
          </Button>
        </div>

        {/* Mobile hamburger */}
        <div className="lg:hidden">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <button
                className="p-2 text-neutral-800"
                aria-label="Open menu"
              >
                <MenuIcon />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] p-6">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col h-full">
                {/* Sheet logo */}
                <div className="flex items-center gap-2 mb-8">
                  <LeafLogo />
                  <span className="font-heading font-bold text-2xl text-brand-primary">
                    Herbagrove
                  </span>
                </div>

                {/* Sheet nav links */}
                <div className="flex flex-col gap-1 flex-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setSheetOpen(false)}
                      className="py-3 font-medium text-body-text text-base hover:text-brand-primary transition-colors border-b border-border"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* Sheet auth */}
                <div className="flex flex-col gap-3 pt-6">
                  <Link
                    href="/sign-in"
                    onClick={() => setSheetOpen(false)}
                    className="text-center font-medium text-body-text text-base py-2 hover:text-brand-primary transition-colors"
                  >
                    Log in
                  </Link>
                  <Button
                    className="bg-brand-primary hover:bg-brand-700 text-white rounded-full py-2 font-medium w-full h-12"
                    onClick={() => setSheetOpen(false)}
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
