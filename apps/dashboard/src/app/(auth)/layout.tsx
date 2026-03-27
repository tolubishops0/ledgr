"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const SUBTITLES: Record<string, string> = {
    "/login": "Sign in to your account",
    "/register": "Create your account to get started",
    "/forgot-password": "Reset your password",
    "/reset-password": "Create a new secure password",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const subtitle = SUBTITLES[pathname] || "Secure financial management";

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col items-center justify-center px-4">
            <div className="text-center mb-8">
                <span className="text-3xl font-extrabold text-green-600 dark:text-green-400 tracking-tight">
                    Ledgr
                </span>

                <AnimatePresence mode="wait">
                    <motion.p
                        key={pathname}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="mt-2 text-sm text-gray-500 dark:text-zinc-400"
                    >
                        {subtitle}
                    </motion.p>
                </AnimatePresence>
            </div>

            <div className="w-full max-w-sm">
                {children}
            </div>
        </div>
    );
}