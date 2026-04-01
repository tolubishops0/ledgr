"use client";

import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { formatFullDate, getMonthName } from "@ledgr/utils";
import { useEffect } from "react";

type PickerType = "empty" | "full" | "short";

interface DatePickerProps {
  type: PickerType;
  value?: string;
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
  type,
  value,
  onChange,
  placeholder,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const getInitialDate = () => {
    if (value) return new Date(value);
    if (type === "full" || type === "short") return new Date();
    return undefined;
  };

  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    getInitialDate(),
  );

  useEffect(() => {
    if (value) setSelectedDate(new Date(value));
    else if (type === "full" || type === "short") setSelectedDate(new Date());
    else setSelectedDate(undefined);
  }, [value, type]);

  const displayValue = selectedDate
    ? type === "full"
      ? formatFullDate(
          `${selectedDate.getDate()}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`,
        )
      : type === "short"
        ? getMonthName(selectedDate)
        : ""
    : "";

  const handleDate = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);

    if (type === "full") {
      onChange(
        formatFullDate(
          `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
        ),
      );
    } else if (type === "short") {
      onChange(getMonthName(date));
    } else {
      onChange(""); // empty type
    }

    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <input
          type="text"
          readOnly
          value={displayValue}
          placeholder={placeholder || (type === "empty" ? "Select date" : "")}
          className={[baseInputClasses, "px-3 py-2 text-sm", className].join(
            " ",
          )}
        />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          required={false}
          selected={selectedDate}
          onSelect={handleDate}
        />
      </PopoverContent>
    </Popover>
  );
}
