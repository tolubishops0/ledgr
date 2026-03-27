"use client";

import * as React from "react";

const baseInputClasses = [
  "w-full rounded-lg border bg-white dark:bg-zinc-950",
  "text-gray-900 dark:text-zinc-50 placeholder:text-gray-400 dark:placeholder:text-zinc-500",
  "border-gray-200 dark:border-zinc-800",
  "focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent",
  "transition-colors duration-150",
  "disabled:opacity-50 disabled:cursor-not-allowed",
].join(" ");

const errorClasses = "border-red-500 dark:border-red-500 focus:ring-red-500";

// --- Label ---
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

export function Label({ children, className = "", ...props }: LabelProps) {
  return (
    <label
      className={[
        "block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </label>
  );
}

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ error, className = "", ...props }: InputProps) {
  return (
    <input
      className={[
        baseInputClasses,
        "px-3 py-2 text-sm",
        error ? errorClasses : "",
        className,
      ].join(" ")}
      {...props}
    />
  );
}

// --- Textarea ---
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function Textarea({ error, className = "", ...props }: TextareaProps) {
  return (
    <textarea
      className={[
        baseInputClasses,
        "px-3 py-2 text-sm resize-y min-h-[80px]",
        error ? errorClasses : "",
        className,
      ].join(" ")}
      {...props}
    />
  );
}

// --- Select ---
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  children: React.ReactNode;
}

export function Select({
  error,
  children,
  className = "",
  ...props
}: SelectProps) {
  return (
    <select
      className={[
        baseInputClasses,
        "px-3 py-2 text-sm appearance-none cursor-pointer",
        error ? errorClasses : "",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </select>
  );
}
