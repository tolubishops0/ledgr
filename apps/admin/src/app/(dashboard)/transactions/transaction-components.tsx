import { Category, Profile, Transaction, TransactionType } from "@ledgr/types";
import { Avatar, Badge, Button, Card, CardContent, Drawer, Input, Select } from "@ledgr/ui";
import { getCategoryById, formatCurrency, formatDate, initials } from "@ledgr/utils";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { MdClear } from "react-icons/md";

export type TransactionWithRelations = Transaction & {
    profile?: Pick<Profile, "full_name" | "email" | "avatar_url"> | null;
    category?: Category | null;
};


export function DetailDrawer({
    tx,
    onClose,
    categories
}: {
    categories: Category[]
    tx: TransactionWithRelations | null;
    onClose: () => void;
}) {
    const cat = tx ? getCategoryById(categories, tx.category_id) : null;
    const isIncome = tx?.type === "income";

    return (
        <Drawer isOpen={!!tx} onClose={onClose} title="Transaction Details">
            {tx && (
                <div className="flex flex-col items-center text-center gap-3 pt-4">
                    <span
                        className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                        style={{ backgroundColor: cat ? cat.color + "22" : "#f3f4f6" }}
                    >
                        {cat?.icon ?? "💳"}
                    </span>
                    <p className="text-sm text-gray-500 dark:text-zinc-400">
                        {cat?.name}
                    </p>
                    <p
                        className={[
                            "text-4xl font-bold",
                            isIncome ? "text-green-600 dark:text-green-400" : "text-red-500",
                        ].join(" ")}
                    >
                        {isIncome ? "+" : "-"}
                        {formatCurrency(tx.amount)}
                    </p>
                    <Badge variant={isIncome ? "success" : "destructive"}>
                        {tx.type}
                    </Badge>

                    <div className="w-full mt-4 space-y-0 text-left">
                        {[
                            { label: "User", value: tx?.profile?.full_name ?? tx.user_id },
                            { label: "Description", value: tx.description ?? "—" },
                            { label: "Category", value: cat?.name ?? "—" },
                            { label: "Date", value: formatDate(tx.date) },
                        ].map(({ label, value }) => (
                            <div
                                key={label}
                                className="flex justify-between py-2.5 border-b border-gray-100 dark:border-zinc-800 last:border-0"
                            >
                                <span className="text-sm text-gray-500 dark:text-zinc-400">
                                    {label}
                                </span>
                                <span className="text-sm font-medium text-gray-900 dark:text-zinc-50">
                                    {value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Drawer>
    );
}


type Filters = {
    search: string;
    userSearch: string;
    type: "all" | TransactionType;
    category: string;
    fromDate: string;
    toDate: string;
};

type transactionFilterProps = {
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
    clearFilters: () => void;
    hasActiveFilters: boolean | string;
    categories: Category[];
};
export function TransactionsFilters({
    filters,
    setFilters,
    clearFilters,
    hasActiveFilters,
    categories,
}: transactionFilterProps) {
    return (
        <>
            {hasActiveFilters && (
                <div className="w-full flex justify-end">
                    <Button variant="outline" size="sm" onClick={clearFilters}>
                        <MdClear size={15} />
                        Clear filters
                    </Button>
                </div>
            )}
            <Card>
                <CardContent className="py-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search
                                size={14}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <Input
                                value={filters.search}
                                onChange={(e) =>
                                    setFilters((f) => ({ ...f, search: e.target.value }))
                                }
                                placeholder="Search transactions..."
                                className="pl-8"
                            />
                        </div>

                        <Select
                            value={filters.type}
                            onChange={(e) =>
                                setFilters((f) => ({ ...f, type: e.target.value as 'all' | TransactionType }))}
                            className="sm:w-36"
                        >
                            <option value="all">All types</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </Select>

                        <Select
                            value={filters.category}
                            onChange={(e) =>
                                setFilters((f) => ({ ...f, category: e.target.value }))
                            }
                            className="sm:w-44"
                        >
                            <option value="all">All categories</option>
                            {categories?.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.icon} {c.name}
                                </option>
                            ))}
                        </Select>

                        <Input
                            type="date"
                            value={filters.fromDate}
                            onChange={(e) =>
                                setFilters((f) => ({ ...f, fromDate: e.target.value }))
                            }
                            className="sm:w-40"
                        />
                        <Input
                            type="date"
                            value={filters.toDate}
                            onChange={(e) =>
                                setFilters((f) => ({ ...f, toDate: e.target.value }))
                            }
                            className="sm:w-40"
                        />
                    </div>
                </CardContent>
            </Card>
        </>
    );
}



export function TransactionRow({
    data,
    onClick,
    index,
    categories,
}: {
    categories: Category[];
    data: TransactionWithRelations;

    onClick: () => void;
    index: number;
}) {
    const cat = getCategoryById(categories, data.category_id!);
    const isIncome = data.type === "income";

    return (


        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            onClick={onClick}
            className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer border-b border-gray-50 dark:border-zinc-800/50 last:border-0"
        >
            <span
                className="w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0"
                style={{
                    backgroundColor: cat ? cat.color + "22" : "#f3f4f6",
                }}
            >
                {cat?.icon ?? "💳"}
            </span>

            <div className="hidden sm:flex items-center gap-2 w-36 shrink-0">

                <Avatar
                    initials={initials(data?.profile?.full_name)} src={data.profile?.avatar_url}
                />
                <span className="text-xs text-gray-500 dark:text-zinc-400 truncate">
                    {data.profile?.full_name ?? data?.user_id}
                </span>
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50 truncate">
                    {data.description ?? "Transaction"}
                </p>
                <p className="text-xs text-gray-400 dark:text-zinc-500">
                    {cat?.name}
                </p>
            </div>

            <Badge
                variant={isIncome ? "success" : "destructive"}
                className="hidden sm:inline-flex"
            >
                {data.type}
            </Badge>

            <span
                className={[
                    "text-sm font-semibold shrink-0",
                    isIncome
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-500",
                ].join(" ")}
            >
                {isIncome ? "+" : "-"}
                {formatCurrency(data.amount)}
            </span>

            <span className="text-xs text-gray-400 dark:text-zinc-500 w-16 text-right hidden md:block shrink-0">
                {new Date(data.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                })}
            </span>
        </motion.div>
    );
}