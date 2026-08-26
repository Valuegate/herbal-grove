"use client";

import { useState } from "react";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import {
  LeafLogo,
  XIcon,
  DashboardIcon,
  ChatBubbleIcon,
  BookIcon,
  LogoutIcon,
} from "@/components/ui/icons";
import { useUIStateContext } from "@/components/UIStateContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  isOpen,
  onClose,
}: SidebarProps) {
  const { darkMode } = useUIStateContext();
  const { signOut } = useClerk();
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await signOut({
      redirectUrl: "/",
    });
  };

  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: DashboardIcon,
    },
    {
      href: "/chat",
      label: "Chat with AI",
      icon: ChatBubbleIcon,
    },
    {
      href: "/consultants",
      label: "Chat Consultant",
      icon: ChatBubbleIcon,
    },
    {
      href: "/researchlibrary",
      label: "Research Library",
      icon: BookIcon,
    },
    {
      href: "/consultants/journal",
      label: "Care Journal",
      icon: BookIcon,
    }
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 transition-all duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:flex lg:flex-col lg:h-screen lg:shrink-0
          ${collapsed ? "w-20" : "w-72"}
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${darkMode ? "bg-[#1E1E1E]" : "bg-white"}
        `}
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <LeafLogo />

            {!collapsed && (
              <span
                className={`text-xl font-bold tracking-tight whitespace-nowrap ${
                  darkMode ? "text-white" : "text-[#2b7a2d]"
                }`}
              >
                HerbaGrove
              </span>
            )}
          </div>

          {/* Desktop Collapse */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-400 hover:text-gray-600 transition"
          >
            {collapsed ? <Menu /> : <XIcon />}
          </button>

          {/* Mobile Close */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-400 hover:text-gray-600 transition"
          >
            <XIcon />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-4 space-y-2">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);

            return (
              <Link
                key={href}
                href={href}
                className={`
                  flex items-center
                  ${collapsed ? "justify-center" : "gap-4"}
                  px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 group
                  ${
                    active
                      ? darkMode
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-emerald-50 text-[#2b7a2d]"
                      : darkMode
                      ? "text-emerald-400"
                      : "text-[#2b7a2d]"
                  }
                `}
              >
                <span className="shrink-0 transition-transform group-hover:scale-110">
                  <Icon />
                </span>

                {!collapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t ${
            darkMode ? "border-neutral-800" : "border-white"
          }`}
        >
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${
              collapsed ? "justify-center" : "gap-4"
            } px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 transition duration-200 cursor-pointer`}
          >
            <LogoutIcon />

            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}