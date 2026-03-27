"use client";

import { createContext, useContext, useState } from "react";
import type { Profile } from "@ledgr/types";

const AdminContext = createContext<{
  user: Profile;
  setUser: (user: Profile) => void;
} | null>(null);

export function AdminProvider({
  user: initialUser,
  children,
}: {
  user: Profile;
  children: React.ReactNode;
}) {
  const [user, setUser] = useState(initialUser);
  return (
    <AdminContext.Provider value={{ user, setUser }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdminContext() {
  const user = useContext(AdminContext);
  if (!user) throw new Error("useAdminContext must be used within UserProvider");
  return user;
}
