import { Skeleton } from "@ledgr/ui";

export default function OverviewSkeleton() {
    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[0, 1, 2, 3].map((i) => (
                    <Skeleton key={i} variant="stat" />
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Skeleton variant="card" className="h-64" />
                <Skeleton variant="card" className="h-64" />
            </div>
        </div>
    );
}