import { useMemo } from "react";
import { createClient } from "../supabase/client";

export function usePasswordStrength(
  password: string,
  confirmPassword?: string,
) {
  const strength = useMemo(() => {
    if (!password) return 0;

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score;
  }, [password]);

  const mismatch = !!confirmPassword && confirmPassword !== password;

  return { strength, mismatch };
}

export const strengthMap = [
  { label: "", color: "", text: "" },
  { label: "Weak", color: "bg-red-500", text: "text-red-500" },
  { label: "Fair", color: "bg-amber-500", text: "text-amber-500" },
  { label: "Good", color: "bg-blue-500", text: "text-blue-500" },
  { label: "Strong", color: "bg-green-500", text: "text-green-500" },
];

export const notifyUser = async (
  user_id: string,
  type: string,
  message: string,
) => {
  const supabase = createClient();
  await supabase.from("notifications").insert({ user_id, type, message });
};
