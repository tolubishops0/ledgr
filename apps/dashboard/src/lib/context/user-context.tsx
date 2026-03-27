"use client";

import { createContext, useContext, useState } from "react";
import type { Profile } from "@ledgr/types";

const UserContext = createContext<{
  user: Profile;
  setUser: (user: Profile) => void;
} | null>(null);

export function UserProvider({
  user: initialUser,
  children,
}: {
  user: Profile;
  children: React.ReactNode;
}) {
  const [user, setUser] = useState(initialUser);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const user = useContext(UserContext);
  if (!user) throw new Error("useUserContext must be used within UserProvider");
  return user;
}
