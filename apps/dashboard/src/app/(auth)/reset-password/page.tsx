"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, CheckCircle2 } from "lucide-react";
import { Button, Card, CardContent, Input, Label } from "@ledgr/ui";
import { toast } from "sonner";
import { updatePasswordOnAuth } from "@/lib/core/auth";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await updatePasswordOnAuth(password);
      if (res.success) {
        setIsSuccess(true);
        toast.success("Password updated successfully!");

        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update password",
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
        className="w-full max-w-sm"
      >
        <Card>
          <CardContent className="py-8">
            {isSuccess ? (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="text-center space-y-4"
              >
                <div className="flex justify-center">
                  <CheckCircle2 className="text-green-500 w-12 h-12" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  All set!
                </h3>
                <p className="text-sm text-zinc-500">
                  Your password has been updated. Redirecting you to login...
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  loading={loading}
                  className="w-full justify-center gap-2"
                >
                  <Lock size={16} />
                  Update Password
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
