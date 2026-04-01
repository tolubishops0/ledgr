"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Modal } from "@ledgr/ui";

export function FirstTimeUserModal({
  budgetsCount,
  transactionsCount,
}: {
  budgetsCount: number;
  transactionsCount: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("firstTimeModalSeen") === "true";
    const shouldShow = (budgetsCount === 0 || transactionsCount === 0) && !seen;
    setOpen(shouldShow);
  }, [budgetsCount, transactionsCount]);

  if (budgetsCount > 0 && transactionsCount > 0 && !open) return null;

  const handleClose = () => {
    localStorage.setItem("firstTimeModalSeen", "true");
    setOpen(false);
  };

  return (
    <Modal isOpen={open} onClose={handleClose} title="Welcome to Ledgr!">
      <div className="flex flex-col items-center justify-center py-4 px-6 text-center space-y-4">
        <p className="text-sm text-gray-500 dark:text-zinc-400">
          Let&apos;s get you started.{" "}
          {budgetsCount === 0
            ? "Create your first budget"
            : "Add your first transaction"}{" "}
          to begin tracking your spending.
        </p>
        <div className="flex gap-2 flex-wrap justify-center">
          <Button size="sm" variant="outline" onClick={handleClose}>
            I&apos;ll find my way
          </Button>
          {budgetsCount === 0 && (
            <Button
              size="sm"
              onClick={() => {
                router.push("/budgets");
                handleClose();
              }}
            >
              Create Budget
            </Button>
          )}
          {budgetsCount > 0 && transactionsCount === 0 && (
            <Button
              size="sm"
              onClick={() => {
                router.push("/transactions");
                handleClose();
              }}
            >
              Add Transaction
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
