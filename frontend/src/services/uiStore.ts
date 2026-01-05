// frontend/src/services/uiStore.ts

import { createContext, useContext, useState } from "react";

interface UIState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  unreadCount: number;
  approvalsPending: number;
}

const UIContext = createContext<UIState | null>(null);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [unreadCount] = useState(0);
  const [approvalsPending] = useState(0);

  const toggleSidebar = () => setSidebarCollapsed(v => !v);

  return (
    <UIContext.Provider
      value={{
        sidebarCollapsed,
        toggleSidebar,
        unreadCount,
        approvalsPending,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used inside UIProvider");
  return ctx;
};
