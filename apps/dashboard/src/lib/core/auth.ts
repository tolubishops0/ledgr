import { redirect } from "next/navigation";
import { createClient } from "../supabase/client";

export const signUp = async (
  fullName: string,
  email: string,
  password: string,
) => {
  const supabase = createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  if (error) throw new Error(error.message);
  return { success: true };
};

export const completeOnboarding = async (
  monthlyIncome: number,
  budgets: { category_id: string; amount: number }[],
) => {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Not authenticated");

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      monthly_income: monthlyIncome,
      is_admin: false,
    })
    .eq("id", user.id);

  if (profileError) throw new Error(profileError.message);

  if (budgets.length > 0) {
    const { error: budgetError } = await supabase.from("budget").insert(
      budgets.map((b) => ({
        user_id: user.id,
        category_id: b.category_id,
        amount: b.amount,
        month: new Date().toISOString().slice(0, 7),
      })),
    );

    if (budgetError) throw new Error(budgetError.message);
  }

  return { success: true };
};

export const signIn = async (email: string, password: string) => {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  return { success: true };
};

export const requestPasswordReset = async (email: string) => {
  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw new Error(error.message);
  return { success: true };
};

export const updatePasswordOnAuth = async (newPassword: string) => {
  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  if (error) throw new Error(error.message);
  return { success: true };
};

export const signOut = async () => {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
  redirect("/login");
  // return { success: true };
};

export const signInWithGoogle = async () => {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });
  if (error) throw new Error(error.message);
  return { success: true };
};

export const updateProfile = async (updates: {
  full_name?: string;
  avatar_url?: string;
}) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const updatePassword = async (
  currentPassword: string,
  newPassword: string,
) => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) throw new Error("Not authenticated");

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });
  if (signInError) throw new Error("Current password is incorrect");

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw new Error(error.message);

  return { success: true };
};

export const deleteAccount = async () => {
  throw new Error("Contact support to delete your account");
};
