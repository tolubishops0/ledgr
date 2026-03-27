
"use client"
import { getUserGrowthData } from "@/lib/helpers";
import { Profile } from "@ledgr/types";
import { StatCard, Card, CardHeader, CardContent, Badge, Avatar } from "@ledgr/ui";
import { formatCurrency, initials, formatDate } from "@ledgr/utils";
import { motion } from "framer-motion";
import { Users, UserCheck, ArrowLeftRight, DollarSign, } from "lucide-react";
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Area, AreaChart } from "recharts";

type StatsSectionProps = {
    stats: {
        totalUsers: number;
        activeUsers: number;
        totalTransactions: number;
        volume: number;
    };
};

export function StatsSection({ stats }: StatsSectionProps) {

    const statsData = [
        {
            label: "Total Users",
            value: String(stats.totalUsers),
            icon: <Users size={18} />,
        },
        {
            label: "Active Users",
            value: String(stats.activeUsers),
            icon: <UserCheck size={18} />,
        },
        {
            label: "Total Transactions",
            value: String(stats.totalTransactions),
            icon: <ArrowLeftRight size={18} />,
        },
        {
            label: "Platform Volume",
            value: formatCurrency(stats.volume),
            icon: <DollarSign size={18} />,
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statsData.map((s, i) => (
                <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.3 }}
                >
                    <StatCard {...s} />
                </motion.div>
            ))}
        </div>
    );
}


export function RecentSignups({ signups }: { signups: Profile[] }) {
    return (
        <Card>
            <CardHeader>
                <span className="text-sm font-semibold text-gray-900 dark:text-zinc-50">
                    Recent signups
                </span>
            </CardHeader>
            <CardContent className="px-0 py-0 pb-2">
                {signups.map((user, i) => (
                    <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                        <Avatar initials={initials(user.full_name)} src={user?.avatar_url} size="sm" />
                        <div className="flex-1 min-w-0">
                            <p className="capitalize text-sm font-semibold text-gray-900 dark:text-zinc-50 truncate">
                                {user.full_name}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-zinc-500 truncate">
                                {user.email}
                            </p>
                        </div>
                        <Badge
                            variant={user.status === "active" ? "success" : "destructive"}
                        >
                            {user.status}
                        </Badge>
                        <span className="text-xs text-gray-400 dark:text-zinc-500 shrink-0 hidden sm:block">
                            {formatDate(user.created_at)}
                        </span>
                    </motion.div>
                ))}
            </CardContent>
        </Card>
    );
}


export function UserGrowthChart({ users }: { users: Profile[] }) {
    const data = getUserGrowthData(users);

    return (
        <Card>
            <CardHeader>
                <span className="text-sm font-semibold text-gray-900 dark:text-zinc-50">
                    User Growth
                </span>
            </CardHeader>
            <CardContent className="w-full h-full flex justify-center items-center ">
                <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="month"
                            tick={{ fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                            allowDecimals={false}
                        />
                        <Tooltip />
                        <Area
                            type="monotone"
                            dataKey="users"
                            stroke="#16a34a"
                            strokeWidth={2.5}
                            fill="url(#greenGrad)"
                            dot={{ fill: "#16a34a", r: 4, strokeWidth: 0 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
