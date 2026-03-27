"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Button, Card, CardContent, Input, Label } from "@ledgr/ui";
import { toast } from "sonner";
import { signIn } from "@/lib/core/auth";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    const handleLogin = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setError("");
        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }
        setLoading(true);
        try {
            const res = await signIn(email, password);
            if (res.success) {
                toast.success("Welcome back!", { duration: 5000 });
                router.push("/");
            }
        } catch (error: unknown) {
            toast.error(
                error instanceof Error ? error.message : "Something went wrong",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-sm"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-green-600 mb-4">
                        <ShieldCheck size={24} className="text-white" />
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-2xl font-extrabold text-green-600 dark:text-green-400 tracking-tight">
                            Ledgr
                        </span>
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400">
                            Admin
                        </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
                        Sign in to the admin portal
                    </p>
                </div>

                <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1.5">
                        👀 Demo access
                    </p>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <p className="text-xs text-amber-600 dark:text-amber-500">
                                <span className="font-medium">Email:</span>{" "}
                                okafor.kemi@gmail.com
                            </p>
                            <p className="text-xs text-amber-600 dark:text-amber-500">
                                <span className="font-medium">Password:</span> qwerty123
                            </p>
                        </div>
                        <Button
                            type="button"
                            onClick={() => {
                                setEmail("okafor.kemi@gmail.com");
                                setPassword("qwerty123");
                            }}
                            variant="ghost"
                            className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline 
              shrink-0 ml-2"
                        >
                            Autofill →
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardContent className="py-6">
                        <form onSubmit={handleLogin} className="space-y-4">
                            {/* Email */}
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@ledgr.app"
                                    error={!!error}
                                />
                            </div>

                            <div>
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        error={!!error}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((s) => !s)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-xs text-red-500 dark:text-red-400"
                                >
                                    {error}
                                </motion.p>
                            )}

                            {/* Submit */}
                            <Button
                                type="submit"
                                size="md"
                                loading={loading}
                                disabled={!email || !password}
                                className="w-full justify-center mt-2"
                            >
                                Sign in to Admin
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center text-xs text-gray-400 dark:text-zinc-500 mt-5">
                    This portal is restricted to authorised administrators only.
                </p>
            </motion.div>
        </div>
    );
}
