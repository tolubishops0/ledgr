"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Avatar, Badge, Button, Card, CardContent, Drawer, Input, Select } from "@ledgr/ui";
import { Search } from "lucide-react";
import type { Profile, Transaction, UserStatus } from "@ledgr/types";
import { formatCurrency, formatDate, initials } from "@ledgr/utils";


interface UserDetailDrawerProps {
    user: Profile | null;
    transactions: Transaction[]
    onClose: () => void;
}

export function UserDetailDrawer({ user, transactions, onClose }: UserDetailDrawerProps) {
    if (!user) return null;

    const userTx = transactions.filter((t) => t.user_id === user.id);
    const income = userTx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expense = userTx.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const recent = [...userTx]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

    return (
        <Drawer isOpen={!!user} onClose={onClose} title="User Details">
            <div className="space-y-5">
                <div className="flex flex-col items-center text-center gap-2 pb-4 border-b border-gray-100 dark:border-zinc-800">
                    <Avatar initials={initials(user.full_name)} size="lg" />
                    <p className="text-base font-bold text-gray-900 dark:text-zinc-50">{user.full_name}</p>
                    <p className="text-sm text-gray-400 dark:text-zinc-500">{user.email}</p>
                    <Badge variant={user.status === "active" ? "success" : "destructive"}>{user.status}</Badge>
                    <p className="text-xs text-gray-400 dark:text-zinc-500">Joined {formatDate(user.created_at)}</p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: "Transactions", value: String(userTx.length) },
                        { label: "Income", value: formatCurrency(income) },
                        { label: "Expenses", value: formatCurrency(expense) },
                    ].map((s) => (
                        <div key={s.label} className="text-center p-3 rounded-xl bg-gray-50 dark:bg-zinc-800">
                            <p className="text-xs text-gray-400 dark:text-zinc-500 mb-1">{s.label}</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-zinc-50 truncate">{s.value}</p>
                        </div>
                    ))}
                </div>

                {recent.length > 0 && (
                    <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wide mb-2">
                            Recent Transactions
                        </p>
                        <div className="space-y-2">
                            {recent.map((t) => (
                                <div key={t.id} className="flex items-center justify-between py-1.5">
                                    <div>
                                        <p className="text-sm text-gray-900 dark:text-zinc-50">{t.description ?? "Transaction"}</p>
                                        <p className="text-xs text-gray-400 dark:text-zinc-500">{formatDate(t.date)}</p>
                                    </div>
                                    <span
                                        className={[
                                            "text-sm font-semibold",
                                            t.type === "income" ? "text-green-600 dark:text-green-400" : "text-red-500",
                                        ].join(" ")}
                                    >
                                        {t.type === "income" ? "+" : "-"}
                                        {formatCurrency(t.amount)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Drawer>
    );
}


interface UserFiltersProps {
    search: string;
    setSearch: (val: string) => void;
    statusFilter: "all" | UserStatus;
    setStatusFilter: (val: "all" | UserStatus) => void;
}

export function UserFilters({
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
}: UserFiltersProps) {
    const hasSearch = !!search;
    return (
        <Card>
            <CardContent className="py-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search
                            size={14}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or email..."
                            className="pl-8"
                        />
                        {hasSearch && (
                            <button
                                onClick={() => setSearch("")}
                                className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    <Select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(e.target.value as typeof statusFilter)
                        }
                        className="sm:w-40"
                    >
                        <option value="all">All statuses</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                    </Select>
                </div>
            </CardContent>
        </Card>
    );
}


interface UserRowProps {
    user: Profile;
    index: number;
    onClick: (user: Profile) => void;
    onAction: (user: Profile, action: UserStatus) => void;
}

export function UserRow({ user, index, onClick, onAction }: UserRowProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            onClick={() => onClick(user)}
            className={[
                "grid grid-cols-1 md:grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-2 md:gap-4 px-5 py-4",
                "border-b border-gray-50 dark:border-zinc-800/50 last:border-0",
                "hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer",
                user.status === "suspended" ? "opacity-60" : "",
            ].join(" ")}
        >
            <div className="flex items-center gap-3">
                <Avatar initials={initials(user.full_name)} src={user?.avatar_url} size="sm" />
                <span className="text-sm font-semibold text-gray-900 dark:text-zinc-50 truncate capitalize">{user.full_name}</span>
            </div>

            <span className="text-sm text-gray-400 dark:text-zinc-500 truncate self-center">{user.email}</span>

            <div className="self-center">
                <Badge variant={user.status === "active" ? "success" : "destructive"}>{user.status}</Badge>
            </div>

            <span className="text-sm text-gray-400 dark:text-zinc-500 self-center hidden md:block">{formatDate(user.created_at)}</span>

            <div className="self-center" onClick={(e) => e.stopPropagation()}>
                {user.status === "active" ? (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onAction(user, "suspended")}
                        className="text-amber-600 border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                    >
                        Suspend
                    </Button>
                ) : (
                    <Button variant="outline" size="sm" onClick={() => onAction(user, "active")}>
                        Activate
                    </Button>
                )}
            </div>
        </motion.div>
    );
}