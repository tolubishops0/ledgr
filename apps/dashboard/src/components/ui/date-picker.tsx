"use client";

import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { formatFullDate } from "@ledgr/utils";
import { useMemo, useState } from "react";

interface DatePickerProps {
  value?: string; // Expecting ISO string or similar
  onChange: (date: string) => void;
  placeholder?: string;
  className?: string;
}

const baseInputClasses = [
  "cursor-pointer w-full rounded-lg border bg-white dark:bg-zinc-950",
  "text-gray-900 dark:text-zinc-50 placeholder:text-gray-400 dark:placeholder:text-zinc-500",
  "border-gray-200 dark:border-zinc-800",
  "focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent",
  "transition-colors duration-150",
  "disabled:opacity-50 disabled:cursor-not-allowed",
].join(" ");

export function DatePicker({
  value,
  onChange,
  placeholder,
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);

  const { selectedDate, displayValue } = useMemo(() => {
    if (!value) return { selectedDate: undefined, displayValue: undefined };

    const date = new Date(value);

    const formatted = formatFullDate(
      `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
    );

    return {
      selectedDate: date,
      displayValue: formatted,
    };
  }, [value]);

  const handleDate = (date: Date | undefined) => {
    if (!date) return;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    onChange(`${year}-${month}-${day}`);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={[
            baseInputClasses,
            "px-3 py-2 text-sm text-left",
            className,
          ].join(" ")}
        >
          {displayValue ? (
            displayValue
          ) : (
            <span className="text-gray-400 dark:text-zinc-500">
              {placeholder}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={selectedDate} onSelect={handleDate} />
      </PopoverContent>
    </Popover>
  );
}
