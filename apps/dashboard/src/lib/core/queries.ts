import { createClient } from "../supabase/server";

export const getTransactions = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("*, category:categories(*)")
    .order("date", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

export const getCategories = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");
  if (error) throw new Error(error.message);
  return data;
};

export const getBudgets = async (month: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("budget")
    .select("*, category:categories(*)")
    .eq("month", month);
  if (error) throw new Error(error.message);
  return data;
};
