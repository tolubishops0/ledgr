"use client";
import { Profile } from "@ledgr/types";
import { Avatar, Button, Input, Label } from "@ledgr/ui";
import { initials } from "@ledgr/utils";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";

export function ProfileTab({
  profile,
  onSave,
  isLoading,
}: {
  profile: Profile;
  isLoading: boolean;
  onSave: (data: Partial<Profile>) => Promise<void>;
}) {
  const [fullName, setFullName] = useState(profile.full_name);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.avatar_url);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setAvatarUrl(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-2">
        <Avatar
          src={avatarUrl ?? undefined}
          initials={initials(fullName)}
          size="lg"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer text-xs text-green-600 dark:text-green-400 hover:underline font-medium"
        >
          Change photo
        </button>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={profile.email}
            readOnly
            className="opacity-50 cursor-not-allowed"
          />
        </div>
      </div>

      <Button
        loading={isLoading}
        onClick={() => onSave({ full_name: fullName, avatar_url: avatarUrl })}
        disabled={isLoading}
        className="w-full sm:w-auto"
      >
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
export function AppearanceTab() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const options = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 dark:text-zinc-400">
        Choose how Ledgr looks on your device.
      </p>
      <div className="grid grid-cols-3 gap-3">
        {options.map(({ value, label, icon: Icon }) => {
          const selected = mounted && theme === value;
          return (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={[
                "relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
                selected
                  ? "border-green-600 dark:border-green-500 bg-green-50 dark:bg-green-900/20"
                  : "border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600 bg-white dark:bg-zinc-900",
              ].join(" ")}
            >
              {selected && (
                <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-green-600 flex items-center justify-center">
                  <Check size={9} className="text-white" />
                </span>
              )}
              <Icon
                size={22}
                className={
                  selected
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-400 dark:text-zinc-500"
                }
              />
              <span
                className={[
                  "text-xs font-medium",
                  selected
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-600 dark:text-zinc-400",
                ].join(" ")}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
