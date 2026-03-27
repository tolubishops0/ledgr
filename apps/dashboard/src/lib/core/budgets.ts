import type { Budget } from "@ledgr/types";
import { createClient } from "../supabase/client";

export const getBudgets = async (month: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("budget")
    .select("*, category:categories(*)")
    .eq("month", month);
  if (error) throw new Error(error.message);
  return data;
};

export const addBudget = async (
  budget: Omit<Budget, "id" | "user_id" | "created_at">,
) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data, error } = await supabase
    .from("budget")
    .insert({ ...budget, user_id: user.id })
    .select("*, category:categories(*)")
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const deleteBudget = async (id: string) => {
  const supabase = createClient();
  const { error } = await supabase.from("budget").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { success: true };
};

// export const updateBudget = async (id: string, updates: Partial<Budget>) => {
//   const supabase = createClient();
//   const { category, ...newUpdates } = updates as any;
//   const { data, error } = await supabase
//     .from("budget")
//     .update(newUpdates)
//     .eq("id", id)
//     .select("*, category:categories(*)")
//     .single();
//   if (error) throw new Error(error.message);
//   return data;
// };

export const updateBudget = async (id: string, updates: Partial<Budget>) => {
  const supabase = createClient()

  const cleanUpdates: Partial<Budget> = {
    ...(updates.amount !== undefined && { amount: updates.amount }),
    ...(updates.category_id !== undefined && { category_id: updates.category_id }),
    ...(updates.month !== undefined && { month: updates.month }),
  }

  const { data, error } = await supabase
    .from('budget')
    .update(cleanUpdates)
    .eq('id', id)
    .select('*, category:categories(*)')
    .single()

  if (error) throw new Error(error.message)
  return data
}
