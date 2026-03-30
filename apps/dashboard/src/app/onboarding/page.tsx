"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import type { Category, OnboardingData } from "@ledgr/types";

import { toast } from "sonner";
import { completeOnboarding } from "@/lib/core/auth";
import {
  Direction,
  ProgressDots,
  slideVariants,
  StepBudgets,
  StepIncome,
  StepSuccess,
} from "./onboarding-steps";
import { getCategoriesClient } from "@/lib/core/actions";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<Direction>(1);
  const [income, setIncome] = useState("");
  const [budgets, setBudgets] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    getCategoriesClient().then(setCategories).catch(console.error);
  }, []);

  function goNext() {
    setDirection(1);
    setStep((s) => s + 1);
  }

  function goBack() {
    setDirection(-1);
    setStep((s) => s - 1);
  }

  async function handleBudgetChange(catId: string, val: string) {
    setBudgets((prev) => ({ ...prev, [catId]: val }));
  }

  const handleFinish = async () => {
    const data: OnboardingData = {
      monthly_income: Number(income),
      budgets: Object.entries(budgets)
        .filter(([, v]) => Number(v) > 0)
        .map(([category_id, amount]) => ({
          category_id,
          amount: Number(amount),
        })),
    };
    console.log("Onboarding complete:", data);
    setLoading(true);
    try {
      const res = await completeOnboarding(data.monthly_income, data.budgets);
      if (res.success) {
        toast.success("Details added!", { duration: 5000 });
        goNext();
      }
    } catch (error: unknown) {
      console.log({ error });
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    <StepIncome
      key="income"
      income={income}
      onChange={setIncome}
      onNext={goNext}
    />,
    <StepBudgets
      key="budgets"
      budgets={budgets}
      onChange={handleBudgetChange}
      onFinish={handleFinish}
      onBack={goBack}
      loading={loading}
      categories={categories || []}
    />,
    <StepSuccess key="success" onDone={() => router.push("/")} />,
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <ProgressDots step={step} />
        <div className="relative overflow-hidden min-h-120 flex flex-col justify-center">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full"
            >
              {steps[step]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
