type IncomeInputProps = {
  id?: string;
  value: string;
  onChange: (val: string, id?: string) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  weight?: "normal" | "medium" | "bold";
  showCurrency?: boolean;
};

const sizeStyles = {
  sm: "text-sm py-2",
  md: "text-base py-2.5",
  lg: "text-2xl py-3",
};

const weightStyles = {
  normal: "font-normal",
  medium: "font-medium",
  bold: "font-bold",
};

export function IncomeInput({
  id,
  value,
  onChange,
  size = "sm",
  weight = "normal",
  className,
  showCurrency = true,
}: IncomeInputProps) {
  const handleChange = (val: string) => {
    const numericValue = val.replace(/,/g, "");
    if (!/^\d*\.?\d*$/.test(numericValue)) return;
    onChange(numericValue, id);
  };

  const displayValue = value ? Number(value).toLocaleString() : "";

  return (
    <div className="flex items-center border border-gray-200 dark:border-zinc-700 rounded-lg overflow-hidden bg-white dark:bg-zinc-950 focus-within:ring-2 focus-within:ring-green-500 transition">
      {showCurrency && (
        <span className="px-4 text-gray-500 dark:text-zinc-400 font-semibold border-r border-gray-200 dark:border-zinc-700 select-none">
          ₦
        </span>
      )}
      <input
        type="text"
        value={displayValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="0.00"
        className={`
          flex-1 bg-transparent w-full placeholder:text-gray-400 text-gray-900 dark:text-zinc-50 focus:outline-none
          ${sizeStyles[size]} ${weightStyles[weight]} ${className || ""}
         `}
      />
    </div>
  );
}
