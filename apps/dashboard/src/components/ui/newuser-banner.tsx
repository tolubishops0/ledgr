"use client";

import { useRouter } from "next/navigation";
import { Button, Modal } from "@ledgr/ui";

interface FirstTimeUserModalProps {
  budgetsCount: number;
  transactionsCount: number;
  isOpen: boolean;
  onClose: () => void;
}

export function FirstTimeUserModal({
  budgetsCount,
  transactionsCount,
  isOpen,
  onClose,
}: FirstTimeUserModalProps) {
  const router = useRouter();

  if (budgetsCount > 0 && transactionsCount > 0) return null;

  const showBudgetButton = budgetsCount === 0;
  const showTransactionButton = budgetsCount > 0 && transactionsCount === 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Welcome to Ledgr!">
      <div className="flex flex-col items-center justify-center py-4 px-6 text-center space-y-4">
        <p className="text-sm text-gray-500 dark:text-zinc-400">
          Let's get you started.{" "}
          {showBudgetButton
            ? "Create your first budget"
            : "Add your first transaction"}{" "}
          to begin tracking your spending.
        </p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={onClose}>
            I'll find my way
          </Button>
          {showBudgetButton && (
            <Button
              size="sm"
              onClick={() => {
                router.push("/budgets");
                onClose();
              }}
            >
              Create Budget
            </Button>
          )}
          {showTransactionButton && (
            <Button
              size="sm"
              onClick={() => {
                router.push("/transactions");
                onClose();
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
