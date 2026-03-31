import { redirect } from "next/navigation";
import { createClient } from "../supabase/client";

export const signIn = async (email: string, password: string) => {
  const supabase = createClient();

  const {
    data: { user },
    error: signInError,
  } = await supabase.auth.signInWithPassword({ email, password });
  if (signInError) throw new Error(signInError.message);
  if (!user) throw new Error("Login failed");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, email, avatar_url, is_admin")
    .eq("id", user.id)
    .single();

  if (profileError || !profile?.is_admin) {
    throw new Error("Unauthorized: admin only. Use autofill to login.");
  }

  return { success: true, profile };
};

export const signOut = async () => {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
  redirect("/login");
  // return { success: true };
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
