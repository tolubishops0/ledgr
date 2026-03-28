"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import type { Profile, Transaction, UserStatus } from "@ledgr/types";
import {
  Card,
  CardContent,
  ConfirmDialog,
  EmptyState,
  PageHeader,
  Pagination,
} from "@ledgr/ui";
import { UserFilters, UserRow, UserDetailDrawer } from "./users-components";
import { toast } from "sonner";
import { updateUserStatusAction } from "@/lib/core/users";

type Props = {
  initialUsers: Profile[];
  initialTrans: Transaction[];
};

export default function AdminUsersPageClient({
  initialUsers,
  initialTrans,
}: Props) {
  const [users, setUsers] = useState<Profile[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | UserStatus>("all");
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    user: Profile;
    action: UserStatus;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.full_name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [users, search, statusFilter]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredUsers.slice(start, end);
  }, [filteredUsers, currentPage]);

  const handleStatusChange = async (userId: string, newStatus: UserStatus) => {
    try {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)),
      );
      setConfirmAction(null);

      const updatedUser = await updateUserStatusAction(userId, newStatus);
      toast.success(`Account ${newStatus}!`);

      setUsers((prev) => prev.map((u) => (u.id === userId ? updatedUser : u)));
    } catch (err) {
      console.error(err);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, status: newStatus === "active" ? "suspended" : "active" }
            : u,
        ),
      );
      toast.error("Failed to update user status");
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-6xl mx-auto">
      <PageHeader
        title="Users"
        subtitle={`${filteredUsers.length} user${filteredUsers.length !== 1 ? "s" : ""}`}
      />

      <UserFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {filteredUsers.length === 0 ? (
        <EmptyState
          heading="No users found"
          subtext="Try adjusting your search or filters."
        />
      ) : (
        <Card>
          <CardContent className="px-0 py-0">
            {paginatedUsers.map((user, index) => (
              <UserRow
                key={user.id}
                user={user}
                index={index}
                onClick={setSelectedUser}
                onAction={(user, action) => setConfirmAction({ user, action })}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {filteredUsers.length > itemsPerPage && (
        <Pagination
          totalItems={filteredUsers.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          setPage={setCurrentPage}
        />
      )}

      <UserDetailDrawer
        user={selectedUser}
        transactions={initialTrans}
        onClose={() => setSelectedUser(null)}
      />

      <ConfirmDialog
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => {
          if (confirmAction)
            handleStatusChange(confirmAction.user.id, confirmAction.action);
        }}
        title={
          confirmAction?.action === "suspended"
            ? "Suspend User"
            : "Activate User"
        }
        description={
          confirmAction?.action === "suspended"
            ? `Are you sure you want to suspend ${confirmAction.user.full_name}? They will lose access to the platform.`
            : `Are you sure you want to activate ${confirmAction?.user.full_name}?`
        }
      />
    </div>
  );
}
