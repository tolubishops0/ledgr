"use server";

import type { UserStatus } from "@ledgr/types";
import { createAdminClient } from "../supabase/admin";
import { createClient } from "../supabase/client";

const statusMessageMap = {
  active: "activated",
  suspended: "suspended",
  banned: "restricted",
};

const notifyUser = async (user_id: string, type: string, message: string) => {
  const supabase = createClient();
  await supabase.from("notifications").insert({ user_id, type, message });
};

export async function updateUserStatusAction(
  userId: string,
  status: UserStatus,
) {
  const readableStatus = statusMessageMap[status] ?? status;
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({ status })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw new Error(error.message);

  if (data) {
    await notifyUser(
      userId,
      "user-status",
      `Your account has been ${readableStatus} by an admin. If this was unexpected, please contact support.`,
    );

    const {
      data: { user: admin },
    } = await supabase.auth.getUser();

    if (admin) {
      await notifyUser(
        admin.id,
        "user-status",
        `User "${data.full_name}" account status updated to "${status}".`,
      );
    }
  }

  return data;
}

// export async function updateUserStatusAction(userId: string, status: UserStatus) {
//     const supabase = createAdminClient()
//     const { data, error } = await supabase
//         .from('profiles')
//         .update({ status })
//         .eq('id', userId)
//         .select()
//         .single()
//     if (error) throw new Error(error.message)
//     return data
// }

export const getAllUsers = async () => {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
};

export const getAllTransactions = async () => {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("transactions")
    .select(
      "*, category:categories(*), profile:profiles(full_name, email, avatar_url)",
    )
    .order("date", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
};
