import { strengthMap, usePasswordStrength } from "@/lib/core/helpers";
import { Profile } from "@ledgr/types";
import { Avatar, Button, ConfirmDialog, Input, Label } from "@ledgr/ui";
import { initials } from "@ledgr/utils";
import { motion } from "framer-motion";
import { Check, Eye, EyeOff, Monitor, Moon, Sun } from "lucide-react";
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

export function DangerZone({
  onDelete,
  isLoading,
}: {
  onDelete: () => Promise<void>;
  isLoading: boolean;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <div className="rounded-xl border border-red-200 dark:border-red-900 p-5 space-y-3">
        <h3 className="text-sm font-semibold text-red-600 dark:text-red-400">
          Danger Zone
        </h3>
        <p className="text-sm text-gray-500 dark:text-zinc-400">
          Permanently delete your account and all your data.
        </p>
        <Button
          variant="destructive"
          size="sm"
          className="cursor-pointer"
          onClick={() => setConfirmOpen(true)}
        >
          Delete Account
        </Button>
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => onDelete()}
        title="Delete Account"
        description="Are you absolutely sure? This cannot be undone."
        isLoading={isLoading}
      />
    </>
  );
}

export function SecurityTab({
  onUpdate,
  isLoading,
}: {
  onUpdate: (current: string, newPw: string) => void;
  isLoading: boolean;
}) {
  const [current, setCurrent] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirm, setConfirm] = useState("");

  const [show, setShow] = useState({
    current: false,
    newPw: false,
    confirm: false,
  });

  const { strength, mismatch } = usePasswordStrength(newPw, confirm);
  const { label, color, text } = strengthMap[strength];

  const handleAction = () => {
    onUpdate(current, newPw);
  };

  const toggle = (field: keyof typeof show) => {
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* Current Password */}
        <div>
          <Label htmlFor="current">Current password</Label>
          <div className="relative">
            <Input
              id="current"
              type={show.current ? "text" : "password"}
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              disabled={isLoading}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => toggle("current")}
              className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300"
              tabIndex={-1}
            >
              {show.current ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <div>
          <Label htmlFor="newpw">New password</Label>
          <div className="relative">
            <Input
              id="newpw"
              type={show.newPw ? "text" : "password"}
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              disabled={isLoading}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => toggle("newPw")}
              className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300"
              tabIndex={-1}
            >
              {show.newPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {newPw.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-2"
            >
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={[
                      "flex-1 h-1 rounded-full transition-colors duration-300",
                      i <= strength ? color : "bg-gray-200 dark:bg-zinc-700",
                    ].join(" ")}
                  />
                ))}
              </div>
              <p className={["text-xs font-medium", text].join(" ")}>{label}</p>
            </motion.div>
          )}
        </div>

        <div>
          <Label htmlFor="confirm">Confirm new password</Label>
          <div className="relative">
            <Input
              id="confirm"
              type={show.confirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              error={mismatch}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => toggle("confirm")}
              className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300"
              tabIndex={-1}
            >
              {show.confirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {mismatch && (
            <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
          )}
        </div>
      </div>

      <Button
        onClick={handleAction}
        disabled={!current || !newPw || mismatch || isLoading}
        className="w-full sm:w-auto"
      >
        {isLoading ? "Updating..." : "Update Password"}
      </Button>
    </div>
  );
}
