"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MailCheck } from "lucide-react";
import { Button, Card, CardContent, Input, Label } from "@ledgr/ui";
import { toast } from "sonner";
import { requestPasswordReset } from "@/lib/core/auth";

export default function ForgotPasswordPage() {
    const [email, setEmail] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [isSubmitted, setIsSubmitted] = React.useState(false);

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter your email address");
            return;
        }

        setLoading(true);
        try {
            const res = await requestPasswordReset(email);
            if (res.success) {
                setIsSubmitted(true);
                toast.success("Reset link sent!");
            }
        } catch (error: unknown) {
            toast.error(
                error instanceof Error ? error.message : "Failed to send reset link"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-zinc-950 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-sm"
            >
                <Card>
                    <CardContent className="py-8">
                        <AnimatePresence mode="wait">
                            {!isSubmitted ? (
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <p className="text-sm text-gray-600 dark:text-zinc-400 mb-6 text-center">
                                        Enter your email and we'll send you a link to get back into your account.
                                    </p>
                                    <form onSubmit={handleForgotPassword} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="you@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            loading={loading}
                                            className="w-full justify-center"
                                        >
                                            Send reset link
                                        </Button>
                                    </form>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center"
                                >
                                    <div className="mb-4 flex justify-center">
                                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-full text-green-600">
                                            <MailCheck size={32} />
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-zinc-400 mb-6">
                                        We&apos;ve sent a password reset link to <br />
                                        <span className="font-semibold text-gray-900 dark:text-white">{email}</span>
                                    </p>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-center"
                                        onClick={() => setIsSubmitted(false)}
                                    >
                                        Didn&apos;t get it? Try again
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>
                </Card>

                <div className="text-center mt-6">
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 dark:text-zinc-400 dark:hover:text-green-400 transition-colors"
                    >
                        <ArrowLeft size={14} />
                        Back to sign in
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}