"use client";

import * as React from "react";
import Image from "next/image";

type AvatarSize = "sm" | "md" | "lg";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  initials?: string;
  size?: AvatarSize;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: "w-7 h-7 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-12 h-12 text-base",
};

export function Avatar({
  src,
  alt,
  initials,
  size = "md",
  className = "",
}: AvatarProps) {
  const [imgError, setImgError] = React.useState(false);

  const base = [
    "inline-flex items-center justify-center rounded-full overflow-hidden select-none shrink-0",
    sizeClasses[size],
    className,
  ].join(" ");

  if (src && !imgError) {
    return (
      <span className={base}>
        <Image
          src={src}
          alt={alt ?? "user-image"}
          className="w-full h-full object-cover object-top"
          onError={() => setImgError(true)}
        />
      </span>
    );
  }

  return (
    <span className={[base, "bg-green-600 text-white font-semibold"].join(" ")}>
      {initials ? initials.slice(0, 2).toUpperCase() : "G"}
    </span>
  );
}
