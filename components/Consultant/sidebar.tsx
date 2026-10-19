"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useMutation } from "convex/react";
import { useClerk, useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";

import { Menu, X } from "lucide-react";

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

const navItems = [
  { href: "/consultant/dashboard", label: "Profile", icon: DashboardIcon },
  { href: "/consultant/consultations", label: "Consultations", icon: ChatBubbleIcon },
  { href: "/consultant/availability", label: "Availability", icon: BookIcon },
];

const iconBtnClass =
  "hidden lg:flex p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-400 hover:text-gray-600 transition";

export default function ConsultantSidebar({ isOpen, onClose }: SidebarProps) {
  const { darkMode } = useUIStateContext();
  const pathname = usePathname();

  const { signOut } = useClerk();
  const { user } = useUser();

  const updateOnlineStatus = useMutation(api.consultants.updateOnlineStatus)
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      if (user) {
        await updateOnlineStatus({ clerkId: user.id, isOnline: false });
      }
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
        await signOut({
        redirectUrl: "/",
      })
    }
  }

  const isActive = (href: string) =>
    href === "/consultant/dashboard" ? pathname === href : pathname.startsWith(href);

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
        className={`fixed top-0 bottom-0 left-0 z-50 transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col lg:h-screen lg:shrink-0 ${
          collapsed ? "w-20" : "w-72"
        } ${isOpen ? "translate-x-0" : "-translate-x-full"} ${darkMode ? "bg-[#1E1E1E]" : "bg-white"}`}
      >
        {/* Header */}
        <div className={`p-6 flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
          {collapsed ? (
            <button onClick={() => setCollapsed(false)} className={iconBtnClass}>
              <Menu size={20} />
            </button>
          ) : (
            <>
              <div className="flex items-center gap-3 overflow-hidden">
                <LeafLogo />
                <span
                  className={`text-xl font-bold tracking-tight whitespace-nowrap ${
                    darkMode ? "text-white" : "text-[#2b7a2d]"
                  }`}
                >
                  HerbaGrove
                </span>
              </div>

              <button onClick={() => setCollapsed(true)} className={iconBtnClass}>
                <X size={20} />
              </button>

              <button onClick={onClose} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-400 hover:text-gray-600 transition">
                <XIcon />
              </button>
            </>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-4 space-y-2">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center ${collapsed ? "justify-center px-0" : "gap-4 px-4"} py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                isActive(href)
                  ? darkMode
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-emerald-50 text-[#2b7a2d]"
                  : darkMode
                  ? "text-emerald-400"
                  : "text-[#2b7a2d]"
              }`}
            >
              <span className="shrink-0 transition-transform group-hover:scale-110">
                <Icon />
              </span>
              {!collapsed && <span>{label}</span>}
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className={`p-4 border-t ${darkMode ? "border-neutral-800" : "border-white"}`}>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${collapsed ? "justify-center px-0" : "gap-4 px-4"} py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 transition duration-200 cursor-pointer`}
          >
            <LogoutIcon />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}