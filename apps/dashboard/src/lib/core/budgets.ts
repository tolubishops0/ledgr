import type { Budget } from "@ledgr/types";
import { createClient } from "../supabase/client";
import { notifyUser } from "./helpers";
import { formatNaira, getMonthName } from "@ledgr/utils";

export const getBudgets = async (month: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("budget")
    .select("*, category:categories(*)")
    .eq("month", month);
  if (error) throw new Error(error.message);
  return data;
};

// export const addBudget = async (
//   budget: Omit<Budget, "id" | "user_id" | "created_at">,
// ) => {
//   const supabase = createClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();
//   if (!user) throw new Error("Not authenticated");
//   const { data, error } = await supabase
//     .from("budget")
//     .insert({ ...budget, user_id: user.id })
//     .select("*, category:categories(*)")
//     .single();
//   if (error) throw new Error(error.message);
//   return data;
// };

// export const deleteBudget = async (id: string) => {
//   const supabase = createClient();
//   const { error } = await supabase.from("budget").delete().eq("id", id);
//   if (error) throw new Error(error.message);
//   return { success: true };
// };

// export const updateBudget = async (id: string, updates: Partial<Budget>) => {
//   const supabase = createClient();

//   const cleanUpdates: Partial<Budget> = {
//     ...(updates.amount !== undefined && { amount: updates.amount }),
//     ...(updates.category_id !== undefined && {
//       category_id: updates.category_id,
//     }),
//     ...(updates.month !== undefined && { month: updates.month }),
//   };

//   const { data, error } = await supabase
//     .from("budget")
//     .update(cleanUpdates)
//     .eq("id", id)
//     .select("*, category:categories(*)")
//     .single();

//   if (error) throw new Error(error.message);
//   return data;
// };

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

  if (user && data?.category)
    await notifyUser(
      user.id,
      "budget",
      `Budget "${data.category.name}" of ${formatNaira(data.amount)} added for ${getMonthName(data.month)}`,
    );

  return data;
};

export const updateBudget = async (id: string, updates: Partial<Budget>) => {
  const supabase = createClient();

  const cleanUpdates: Partial<Budget> = {
    ...(updates.amount !== undefined && { amount: updates.amount }),
    ...(updates.category_id !== undefined && {
      category_id: updates.category_id,
    }),
    ...(updates.month !== undefined && { month: updates.month }),
  };

  const { data, error } = await supabase
    .from("budget")
    .update(cleanUpdates)
    .eq("id", id)
    .select("*, category:categories(*)")
    .single();
  if (error) throw new Error(error.message);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && data?.category)
    await notifyUser(
      user.id,
      "budget",
      `Budget "${data.category.name}" updated to ${formatNaira(data.amount)} for ${getMonthName(data.month)}`,
    );

  return data;
};

export const deleteBudget = async (id: string) => {
  const supabase = createClient();

  const { data, error: fetchError } = await supabase
    .from("budget")
    .select("*, category:categories(*)")
    .eq("id", id)
    .single();
  if (fetchError) throw new Error(fetchError.message);

  const { error } = await supabase.from("budget").delete().eq("id", id);
  if (error) throw new Error(error.message);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && data?.category)
    await notifyUser(
      user.id,
      "budget",
      `Budget "${data.category.name}" (${getMonthName(data.month)}) of ${formatNaira(data.amount)} deleted`,
    );

  return { success: true };
};
