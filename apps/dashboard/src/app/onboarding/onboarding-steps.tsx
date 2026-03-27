import { Category } from "@ledgr/types";
import { Button } from "@ledgr/ui/src/button";
import { IncomeInput } from "@ledgr/ui/src/income-input";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React from "react";

export function StepIncome({
  income,
  onChange,
  onNext,
}: {
  income: string;
  onChange: (v: string) => void;
  onNext: () => void;
}) {
  return (
    <motion.div
      className="flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Logo */}
      <span className="text-3xl font-extrabold text-green-600 dark:text-green-400 mb-8 tracking-tight">
        Ledgr
      </span>

      {/* Illustration */}
      <svg
        width="96"
        height="96"
        viewBox="0 0 96 96"
        fill="none"
        className="mb-6"
        aria-hidden="true"
      >
        <circle
          cx="48"
          cy="48"
          r="44"
          fill="#f0fdf4"
          stroke="#16a34a"
          strokeWidth="2"
        />
        <rect
          x="26"
          y="38"
          width="44"
          height="28"
          rx="5"
          fill="#16a34a"
          opacity="0.15"
          stroke="#16a34a"
          strokeWidth="2"
        />
        <rect
          x="26"
          y="38"
          width="44"
          height="10"
          rx="5"
          fill="#16a34a"
          opacity="0.4"
        />
        <circle cx="38" cy="58" r="4" fill="#16a34a" opacity="0.6" />
        <circle cx="48" cy="58" r="4" fill="#16a34a" opacity="0.6" />
        <circle cx="58" cy="58" r="4" fill="#16a34a" opacity="0.6" />
        <path
          d="M44 30 Q48 24 52 30"
          stroke="#16a34a"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="48" cy="29" r="3" fill="#16a34a" opacity="0.5" />
      </svg>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-50 mb-2">
        Welcome to Ledgr 👋
      </h1>
      <p className="text-sm text-gray-500 dark:text-zinc-400 mb-8 max-w-xs">
        Let&apos;s set up your finances in 3 quick steps
      </p>

      <div className="w-full max-w-sm mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 text-left mb-2">
          What is your monthly income?
        </label>
        <IncomeInput value={income} onChange={onChange} />
      </div>

      <Button
        type="submit"
        variant="default"
        size="md"
        onClick={onNext}
        disabled={!income || Number(income) <= 0}
        className="w-full justify-center mt-2"
      >
        Continue
      </Button>
    </motion.div>
  );
}

export function StepBudgets({
  budgets,
  onChange,
  onFinish,
  onBack,
  loading,
  categories,
}: {
  categories: Category[] | null;
  loading: boolean;
  budgets: Record<string, string>;
  onChange: (catId: string, val: string) => void;
  onFinish: () => void;
  onBack: () => void;
}) {
  const router = useRouter();
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-50 mb-1">
        Set your monthly budgets
      </h2>
      <p className="text-sm text-gray-500 dark:text-zinc-400 mb-5">
        How much do you want to spend on each category?
      </p>

      <div className="flex-1 overflow-y-auto space-y-1 mb-6 max-h-85">
        {categories?.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between gap-3 py-2.5 border-b border-gray-100 dark:border-zinc-800 last:border-0"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                className="w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0"
                style={{ backgroundColor: cat.color + "22" }}
              >
                {cat.icon}
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-zinc-50 truncate">
                {cat.name}
              </span>
            </div>

            <IncomeInput
              id={cat.id}
              value={budgets[cat.id] ?? ""}
              onChange={(val: string, id?: string) => onChange(id!, val)}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={onBack}
          variant="outline"
          size="md"
          loading={loading}
          className="w-full justify-center mt-2"
        >
          Back
        </Button>
        <Button
          type="submit"
          variant="default"
          size="md"
          loading={loading}
          onClick={onFinish}
          className="w-full justify-center mt-2"
        >
          Continue
        </Button>
      </div>

      <Button
        type="submit"
        variant="ghost"
        size="md"
        loading={loading}
        onClick={() => router.push("/")}
        className="w-full justify-center mt-3  text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors "
      >
        Skip for now
      </Button>
    </div>
  );
}

export function Confetti() {
  const pieces = React.useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 8 + 4,
        delay: Math.random() * 0.5,
        isCircle: Math.random() > 0.5,
        color: Math.random() > 0.5 ? "#16a34a" : "#bbf7d0",
      })),
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-10">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute top-0"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            borderRadius: p.isCircle ? "50%" : 2,
            backgroundColor: p.color,
          }}
          initial={{ y: -20, opacity: 1 }}
          animate={{ y: "100vh", opacity: 0 }}
          transition={{ duration: 1.5, delay: p.delay, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}

// ─── Progress Dots ────────────────────────────────────────────────────────────

export function ProgressDots({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          layout
          animate={{
            width: i === step ? 24 : 8,
            backgroundColor: i === step ? "#16a34a" : "#d1d5db",
          }}
          className="h-2 rounded-full"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      ))}
    </div>
  );
}

export function StepSuccess({ onDone }: { onDone: () => void }) {
  return (
    <>
      <Confetti />
      <div className="flex flex-col items-center text-center">
        <motion.div
          className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.15, 1] }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            aria-hidden="true"
          >
            <motion.path
              d="M8 18 L15 25 L28 11"
              stroke="#16a34a"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
            />
          </svg>
        </motion.div>

        <motion.h2
          className="text-2xl font-bold text-gray-900 dark:text-zinc-50 mb-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          You&apos;re all set! 🎉
        </motion.h2>
        <motion.p
          className="text-sm text-gray-500 dark:text-zinc-400 max-w-xs mb-8"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Your financial dashboard is ready. Start by logging your first
          transaction.
        </motion.p>

        <motion.button
          onClick={onDone}
          className="w-full max-w-sm py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          Go to Dashboard
        </motion.button>
      </div>
    </>
  );
}

export type Direction = 1 | -1;
export const slideVariants = {
  enter: (dir: Direction) => ({ x: dir > 0 ? "60%" : "-60%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: Direction) => ({ x: dir > 0 ? "-60%" : "60%", opacity: 0 }),
};
