"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { Button, Card, CardContent, Input, Label } from "@ledgr/ui";
import { FcGoogle } from "react-icons/fc";
import { signIn, signInWithGoogle } from "@/lib/core/auth";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);
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
        router.replace("/overview");

        toast.success("welcome back!", { duration: 5000 });
      }
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await signInWithGoogle();
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
          <CardContent className="py-6">
            <Button
              variant="outline"
              size="md"
              loading={googleLoading}
              disabled={loading}
              onClick={handleGoogle}
              className="w-full justify-center gap-3"
            >
              {!googleLoading && <FcGoogle />}
              Continue with Google
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-700" />
              <span className="text-xs text-gray-400 dark:text-zinc-500">
                or
              </span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-700" />
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  error={!!error}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-green-600 dark:text-green-400 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
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

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-500 dark:text-red-400"
                >
                  {error}
                </motion.p>
              )}

              <Button
                type="submit"
                variant="default"
                size="md"
                loading={loading}
                disabled={googleLoading}
                className="w-full justify-center"
              >
                Sign in
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-500 dark:text-zinc-400 mt-5">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-green-600 dark:text-green-400 font-medium hover:underline"
          >
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
