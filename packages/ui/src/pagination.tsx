"use client";

import * as React from "react";

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    setPage: (page: number) => void;
}

export function Pagination({ currentPage, totalItems, itemsPerPage, setPage }: PaginationProps) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-1">
            <button
                onClick={() => setPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-zinc-700 text-gray-500 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
            >
                Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={[
                        "w-8 h-8 text-sm rounded-lg font-medium transition-colors",
                        p === currentPage
                            ? "bg-green-600 text-white"
                            : "border border-gray-200 dark:border-zinc-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800",
                    ].join(" ")}
                >
                    {p}
                </button>
            ))}

            <button
                onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-zinc-700 text-gray-500 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
            >
                Next
            </button>
        </div>
    );
}