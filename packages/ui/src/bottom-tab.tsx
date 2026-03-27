"use client";

import * as React from "react";
import Link from "next/link";
import { NavItem } from "./use-active-href";

interface BottomTabBarProps {
  active: string;
  navList: NavItem[];
}

export function BottomTabBar({ active, navList }: BottomTabBarProps) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800 flex items-stretch">
      {navList.map(({ href, label, icon: Icon }) => {
        const IconComponent = Icon as React.ElementType
        const isActive = active === href;
        return (
          <Link
            key={href}
            href={href}
            className={[
              "flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors",
              isActive
                ? "text-green-600 dark:text-green-400"
                : "text-gray-400 dark:text-zinc-500",
            ].join(" ")}
          >
            <IconComponent size={20} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
