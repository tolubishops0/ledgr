"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Sector,
} from "recharts";
import { Card, CardHeader, CardContent, Avatar } from "@ledgr/ui";
import { formatCurrency, initials } from "@ledgr/utils";
import {
  getMostActiveUsers,
  getTypeSplit,
  getUserGrowthData,
  getVolumeData,
} from "@/lib/helpers";
import { Profile, Transaction } from "@ledgr/types";

export function UserGrowthChart({ users }: { users: Profile[] }) {
  const growthData = getUserGrowthData(users);

  return (
    <Card>
      <CardHeader>
        <span className="text-sm font-semibold text-gray-900 dark:text-zinc-50">
          User Growth
        </span>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={growthData}>
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
            <Line
              type="monotone"
              dataKey="users"
              stroke="#16a34a"
              strokeWidth={2.5}
              dot={{ r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// 2. Monthly Volume
export function MonthlyVolumeChart({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const volumeData = getVolumeData(transactions);

  return (
    <Card>
      <CardHeader>
        <span className="text-sm font-semibold text-gray-900 dark:text-zinc-50">
          Monthly Platform Volume
        </span>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={volumeData}>
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
              tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value) => formatCurrency(Number(value) || 0)}
            />
            <Bar dataKey="Volume" fill="#16a34a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// 3. Type Split
export function TransactionTypeSplit({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const typeSplit = getTypeSplit(transactions);
  return (
    <Card>
      <CardHeader>
        <span className="text-sm font-semibold text-gray-900 dark:text-zinc-50">
          Transaction Type Split
        </span>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={typeSplit}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
              >
                {typeSplit.map((entry) => (
                  <Sector key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatCurrency(Number(value) || 0)}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="space-y-3 shrink-0">
            {typeSplit.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <div>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">
                    {entry.name}
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50">
                    {formatCurrency(entry.value)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function MostActiveUsers({
  users,
  transactions,
}: {
  users: Profile[];
  transactions: Transaction[];
}) {
  const activeUsers = getMostActiveUsers(transactions, users);

  return (
    <Card>
      <CardHeader>
        <span className="text-sm font-semibold text-gray-900 dark:text-zinc-50">
          Most Active Users
        </span>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activeUsers.map((user, i) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-3"
            >
              <span className="text-xs text-gray-400 w-4 text-right">
                {i + 1}
              </span>

              <Avatar initials={initials(user.full_name)} size="sm" />

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {user.full_name}
                </p>
                <p className="text-xs text-gray-400">
                  {user.txCount} transactions
                </p>
              </div>

              <span className="text-sm font-semibold">
                {formatCurrency(user.volume)}
              </span>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
