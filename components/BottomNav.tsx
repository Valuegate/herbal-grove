"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Bot,
  MessageCircle,
  BookOpen,
  NotebookPen,
} from "lucide-react";
import { useUIStateContext } from "@/components/UIStateContext";

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
  const { darkMode } = useUIStateContext();

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 border-t md:hidden ${
        darkMode ? "bg-[#1E1E1E] border-neutral-800" : "bg-white border-gray-100"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-md items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <button
              key={item.href}
              type="button"
              onClick={() => router.push(item.href)}
              className={`flex flex-col items-center justify-center gap-1 rounded-xl px-3 py-1 text-xs transition-colors ${
                isActive
                  ? darkMode
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "text-[#2b7a2d]"
                  : darkMode
                  ? "text-emerald-400"
                  : "text-gray-500"
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