import { Profile, Transaction } from "@ledgr/types";
import { getMonthlyTotals } from "@ledgr/utils";

export function getUserGrowthData(users: Profile[]) {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        const label = d.toLocaleDateString("en-US", { month: "short" });
        const count = users.filter((u) => u.created_at.startsWith(key)).length;
        return { month: label, users: count };
    });
};

export function getTypeSplit(transactions: Transaction[]) {
    const income = transactions
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + t.amount, 0);
    const expense = transactions
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + t.amount, 0);
    return [
        { name: "Income", value: income, color: "#16a34a" },
        { name: "Expense", value: expense, color: "#ef4444" },
    ];
}


export function getVolumeData(transactions: Transaction[]) {
    return getMonthlyTotals(transactions, 6).map((d) => ({
        month: d.month,
        Volume: d.income + d.expense,
    }));
}



export function getMostActiveUsers(transactions: Transaction[], users: Profile[]) {
    return users
        .map((u) => {
            const txs = transactions.filter((t) => t.user_id === u.id);
            return {
                ...u,
                txCount: txs.length,
                volume: txs.reduce((s, t) => s + t.amount, 0),
            };
        })
        .sort((a, b) => b.txCount - a.txCount)
        .slice(0, 5);
}
