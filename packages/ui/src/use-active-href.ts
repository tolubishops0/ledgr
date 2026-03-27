"use client";
import { usePathname } from "next/navigation";

export type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>
};

export function useActiveHref(navItems: NavItem[]) {
  const pathname = usePathname();
  const sorted = [...navItems].sort((a, b) => b.href.length - a.href.length);
  return (
    sorted.find(
      (n) =>
        pathname === n.href || (n.href !== "/" && pathname.startsWith(n.href)),
    )?.href ??
    navItems[0]?.href ??
    "/"
  );
}
