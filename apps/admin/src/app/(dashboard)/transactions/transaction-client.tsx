"use client";
import * as React from "react";

import {
    PageHeader,
    Card,
    CardContent,
    EmptyState,

} from "@ledgr/ui";
import {
    groupTransactionsByDate,
} from "@ledgr/utils";
import type { Category, TransactionType } from "@ledgr/types";
import { DetailDrawer, TransactionRow, TransactionsFilters, TransactionWithRelations } from "./transaction-components";
import { useMemo, useState } from "react";


type Props = {
    initialTransactions: TransactionWithRelations[];
    initialCategories: Category[];
};

const initialFilters = {
    search: "",
    userSearch: "",
    type: "all" as "all" | TransactionType,
    category: "all",
    fromDate: "",
    toDate: "",
};

export default function AdminTransactionsPageClient({ initialTransactions, initialCategories }: Props) {

    const [detailTx, setDetailTx] = useState<TransactionWithRelations | null>(null);
    const [filters, setFilters] = useState(initialFilters);




    const clearFilters = () => setFilters(initialFilters);

    const hasActiveFilters =
        filters.search ||
        filters.userSearch ||
        filters.type !== "all" ||
        filters.category !== "all" ||
        filters.fromDate ||
        filters.toDate;

    const filtered = useMemo(() => {
        return initialTransactions.filter((t) => {
            if (filters.search && !t.description?.toLowerCase().includes(filters.search.toLowerCase())) return false
            if (filters.userSearch && !t.profile?.full_name?.toLowerCase().includes(filters.userSearch.toLowerCase())) return false
            if (filters.type !== 'all' && t.type !== filters.type) return false
            if (filters.category !== 'all' && t.category_id !== filters.category) return false
            if (filters.fromDate && t.date < filters.fromDate) return false
            if (filters.toDate && t.date > filters.toDate) return false
            return true
        })
    }, [initialTransactions, filters])

    const grouped = useMemo(() => groupTransactionsByDate(filtered), [filtered]);


    return (
        <div className="p-4 md:p-6 space-y-5 max-w-5xl mx-auto">
            <PageHeader title="Transactions" subtitle="All platform transactions" />

            {initialTransactions.length > 0 && (
                <TransactionsFilters
                    categories={initialCategories}
                    filters={filters}
                    setFilters={setFilters}
                    clearFilters={clearFilters}
                    hasActiveFilters={hasActiveFilters}
                />
            )}

            {Object.keys(grouped).length === 0 ? (
                <EmptyState
                    heading="No transactions found"
                    subtext="Try adjusting your filters or add a new transaction."
                />
            ) : (
                <Card>
                    <CardContent className="px-0 py-0">
                        {Object.entries(grouped).map(([label, txs]) => (
                            <div key={label}>
                                <div className="px-5 py-2 bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-100 dark:border-zinc-800">
                                    <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wide">
                                        {label}
                                    </span>
                                </div>
                                {txs.map((t, i) => (
                                    <TransactionRow
                                        key={t.id}
                                        data={t}
                                        index={i}
                                        categories={initialCategories}
                                        onClick={() => setDetailTx(t)}

                                    />
                                ))}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            <DetailDrawer tx={detailTx} onClose={() => setDetailTx(null)} categories={initialCategories} />
        </div>
    );
}
