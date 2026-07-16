"use client";

import { createContext, useContext, ReactNode, useMemo, useState } from "react";

export interface UIStateContextValue {
  darkMode: boolean;
  toggleDarkMode: () => void;
  sidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
}

const UIStateContext = createContext<UIStateContextValue | undefined>(undefined);

export function UIStateProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  const value = useMemo<UIStateContextValue>(
    () => ({
      darkMode,
      toggleDarkMode,
      sidebarOpen,
      openSidebar,
      closeSidebar,
    }),
    [darkMode, sidebarOpen],
  );

  return <UIStateContext.Provider value={value}>{children}</UIStateContext.Provider>;
}

export function useUIStateContext() {
  const context = useContext(UIStateContext);
  if (!context) {
    throw new Error("useUIStateContext must be used within UIStateProvider");
  }
  return context;
}
