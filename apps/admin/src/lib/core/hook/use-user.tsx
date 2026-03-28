import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useUserStatusDot(userId: string) {
  const [hasUpdate, setHasUpdate] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from("profiles")
      .select("status")
      .eq("id", userId)
      .single()
      .then(({ data }) => {
        if (data && data.status !== "active") setHasUpdate(true);
      });

    // subscribe to realtime updates
    const subscription = supabase
      .channel(`public:profiles:id=eq.${userId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          if (payload.new?.status) {
            setHasUpdate(true);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [userId]);

  return { hasUpdate, clear: () => setHasUpdate(false) };
}
