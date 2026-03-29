"use server";

import type { UserStatus } from "@ledgr/types";
import { createAdminClient } from "../supabase/admin";
import { createClient } from "../supabase/client";
import { createClient as CreateServerClient } from "../supabase/server";

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
  const supabaseServer = await CreateServerClient();

  const { data: res, error } = await supabase
    .from("profiles")
    .update({ status })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw new Error(error.message);

  if (res) {
    await notifyUser(
      userId,
      "user-status",
      `Your account has been ${readableStatus} by an admin. If this was unexpected, please contact support.`,
    );

    const {
      data: { user: user },
    } = await supabaseServer.auth.getUser();
    if (user) {
      await notifyUser(
        user.id,
        "user-status",
        `User "${res.full_name}" account status updated to "${status}".`,
      );
    }
  }

  return res;
}

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
