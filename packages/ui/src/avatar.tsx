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
          alt={alt || initials || "user avatar"}
          className="w-full h-full object-cover object-top"
          onError={() => setImgError(true)}
        />
      </span>
    );
  }

  return (
    <span
      className={[base, "bg-gray-400 text-white font-semibold"].join(" ")}
      title={initials || "User"}
    >
      {initials ? (
        initials.slice(0, 2).toUpperCase()
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-3/4 h-3/4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.121 17.804A9 9 0 1118.879 6.196a9 9 0 01-13.758 11.608z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      )}
    </span>
  );
}
