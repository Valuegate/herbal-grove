"use client"

console.log("🔥 ADMIN SIDEBAR LOADED");

import Link from "next/link"
import { useClerk } from "@clerk/nextjs"
import { usePathname } from "next/navigation"

import { LeafLogo } from "@/components/ui/icons"
import { XIcon } from "@/components/ui/icons"
import { DashboardIcon } from "@/components/ui/icons"
import { ChatBubbleIcon } from "@/components/ui/icons"
import { BookIcon } from "@/components/ui/icons"
import { LogoutIcon } from "@/components/ui/icons"

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

export default function Sidebar({ isOpen, onClose, darkMode }: SidebarProps) {
  const { signOut } = useClerk();
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut({
      redirectUrl: "/"
    });
  };

  const navItems = [
    { href: "/admin/dashboard", label: "Admin Dashboard", icon: DashboardIcon },
    { href: "/admin/knowledge-base", label: "Knowledge Base", icon: BookIcon },
    { href: "/admin/herbs", label: "Herbs", icon: LeafLogo },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Sidebar */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
        />
      )}

      {/*Sidebar Panel*/}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col lg:h-screen lg:shrink-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        ${darkMode ? "bg-[#1E1E1E]" : "bg-white"}
      `}>
        {/*Sidebar Header*/}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LeafLogo />
            <span className={`text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-[#2b7a2d]'}`}>
              Herbagrove
            </span>
          </div>

          <button onClick={onClose} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-400 hover:text-gray-600 transition" aria-label="Close Sidebar">
            <XIcon />
          </button>
        </div>

        {/*Navlinks*/}
        <div className="flex-1 px-4 py-4 space-y-2">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);

            return (
              
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                  active
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
                <span>{label}</span>
              </Link>
            );
          })}
        </div>

        {/*Sidebar Footer*/}
        <div className={`p-4 border-t ${darkMode ? 'border-neutral-800' : 'border-white' }`}>
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 transition duration-200 cursor-pointer">
            <LogoutIcon />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}