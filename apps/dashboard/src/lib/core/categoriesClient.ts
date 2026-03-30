import { createClient } from "../supabase/client";

// this category fetches data for onboarding client
export const getCategoriesClient = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");
  if (error) throw new Error(error.message);
  return data;
};
