"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, PageHeader } from "@ledgr/ui";
import { useState } from "react";
import { useUserContext } from "@/lib/context/user-context";
import { Profile, Tab } from "@ledgr/types";

import {
  AppearanceTab,
  DangerZone,
  ProfileTab,
  SecurityTab,
} from "./settings-components";
import { updatePassword, updateProfile } from "@/lib/core/auth";
import { toast } from "sonner";

const TABS: { id: Tab; label: string }[] = [
  { id: "profile", label: "Profile" },
  { id: "security", label: "Security" },
  { id: "appearance", label: "Appearance" },
];

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("profile");
  const [isUpdating, setIsUpdating] = useState({
    profile: false,
    settings: false,
    delete: false,
  });
  const { user, setUser } = useUserContext();
   const handleDeleteAccount = async () => {
    console.log("Deleting account from Database...");
  };

  const handleProfileUpdate = async (updatedData: Partial<Profile>) => {
    setIsUpdating((prev) => ({
      ...prev,
      profile: true,
    }));
    try {
      const updated = await updateProfile({
        full_name: updatedData.full_name,
        avatar_url: updatedData.avatar_url ?? undefined,
      });
      toast.success("Profile updated!");
      setUser(updated);
    } catch (error) {
      console.log({ error });
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setIsUpdating((prev) => ({
        ...prev,
        profile: false,
      }));
    }
  };

  const handlePasswordUpdate = async (current: string, newPw: string) => {
    setIsUpdating((prev) => ({
      ...prev,
      settings: true,
    }));
    try {
      await updatePassword(current, newPw);
      toast.success("Password updated!");
    } catch (error) {
      console.log({ error });
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setIsUpdating((prev) => ({
        ...prev,
        settings: false,
      }));
    }
  };

  const tabContent: Record<Tab, React.ReactNode> = {
    profile: (
      <ProfileTab
        profile={user}
        onSave={handleProfileUpdate}
        isLoading={isUpdating.profile}
      />
    ),
    security: (
      <SecurityTab
        onUpdate={handlePasswordUpdate}
        isLoading={isUpdating.settings}
      />
    ),
    appearance: <AppearanceTab />,
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-xl mx-auto">
      <PageHeader title="Settings" subtitle="Manage your account preferences" />

      <div className="flex border-b border-gray-200 dark:border-zinc-800">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={[
              "relative px-4 py-2.5 text-sm font-medium transition-colors",
              tab === id
                ? "text-green-600 dark:text-green-400"
                : "text-gray-500 dark:text-zinc-400 hover:text-gray-800 dark:hover:text-zinc-200",
            ].join(" ")}
          >
            {label}
            {tab === id && (
              <motion.div
                layoutId="tab-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 dark:bg-green-400 rounded-full"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="py-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              {tabContent[tab]}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      <DangerZone
        onDelete={handleDeleteAccount}
        isLoading={isUpdating.delete}
      />
    </div>
  );
}
