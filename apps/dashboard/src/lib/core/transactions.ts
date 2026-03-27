import type { Transaction } from "@ledgr/types";
import { createClient } from "../supabase/client";

export const getTransactions = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("*, category:categories(*)")
    .order("date", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

export const addTransaction = async (
  transaction: Omit<Transaction, "id" | "user_id" | "created_at">,
) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data, error } = await supabase
    .from("transactions")
    .insert({
      ...transaction,
      user_id: user.id,
    })
    .select("*, category:categories(*)")
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const deleteTransaction = async (id: string) => {
  const supabase = createClient();
  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { success: true };
};

export const updateTransaction = async (
  id: string,
  updates: Partial<Transaction>,
) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("transactions")
    .update(updates)
    .eq("id", id)
    .select("*, category:categories(*)")
    .single();
  console.log({ error });
  if (error) throw new Error(error.message);
  return data;
};
