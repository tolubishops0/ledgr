import type { Transaction } from "@ledgr/types";
import { createClient } from "../supabase/client";
import { notifyUser } from "./helpers";
import { formatNaira, getMonthName } from "@ledgr/utils";

export const getTransactions = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("*, category:categories(*)")
    .order("date", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

// export const addTransaction = async (
//   transaction: Omit<Transaction, "id" | "user_id" | "created_at">,
// ) => {
//   const supabase = createClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();
//   if (!user) throw new Error("Not authenticated");
//   const { data, error } = await supabase
//     .from("transactions")
//     .insert({
//       ...transaction,
//       user_id: user.id,
//     })
//     .select("*, category:categories(*)")
//     .single();
//   if (error) throw new Error(error.message);
//   return data;
// };

// export const deleteTransaction = async (id: string) => {
//   const supabase = createClient();
//   const { error } = await supabase.from("transactions").delete().eq("id", id);
//   if (error) throw new Error(error.message);
//   return { success: true };
// };

// export const updateTransaction = async (
//   id: string,
//   updates: Partial<Transaction>,
// ) => {
//   const supabase = createClient();
//   const { data, error } = await supabase
//     .from("transactions")
//     .update(updates)
//     .eq("id", id)
//     .select("*, category:categories(*)")
//     .single();
//   console.log({ error });
//   if (error) throw new Error(error.message);
//   return data;
// };

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
    .insert({ ...transaction, user_id: user.id })
    .select("*, category:categories(*)")
    .single();
  if (error) throw new Error(error.message);

  if (user && data?.category)
    await notifyUser(
      user.id,
      "transaction",
      `Transaction "${data.category.name}" of ${formatNaira(data.amount)} added for ${getMonthName(data.date)}`,
    );

  return data;
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
  if (error) throw new Error(error.message);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && data?.category)
    await notifyUser(
      user.id,
      "transaction",
      `Transaction "${data.category.name}" updated to ${formatNaira(data.amount)} for ${getMonthName(data.date)}`,
    );

  return data;
};

export const deleteTransaction = async (id: string) => {
  const supabase = createClient();
  const { data, error: fetchError } = await supabase
    .from("transactions")
    .select("*, category:categories(*)")
    .eq("id", id)
    .single();
  if (fetchError) throw new Error(fetchError.message);

  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) throw new Error(error.message);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && data?.category)
    await notifyUser(
      user.id,
      "transaction",
      `Transaction "${data.category.name}" of ${formatNaira(data.amount)} for ${getMonthName(data.date)} deleted`,
    );

  return { success: true };
};
