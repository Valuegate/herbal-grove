"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Bot,
  MessageCircle,
  BookOpen,
  NotebookPen,
} from "lucide-react";

const navItems = [
  {
    label: "Home",
    icon: Home,
    href: "/dashboard",
  },
  {
    label: "AI",
    icon: Bot,
    href: "/ai",
  },
  {
    label: "Consult",
    icon: MessageCircle,
    href: "/consultants",
  },
  {
    label: "Researches",
    icon: BookOpen,
    href: "/researchlibrary",
  },
  {
    label: "Journal",
    icon: NotebookPen,
    href: "/journal",
  },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white md:hidden">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <button
              key={item.href}
              type="button"
              onClick={() => router.push(item.href)}
              className={`flex flex-col items-center justify-center gap-1 text-xs ${
                isActive ? "text-green-700" : "text-gray-500"
              }`}
            >
              <Icon size={21} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}