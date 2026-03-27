import { Skeleton } from "@ledgr/ui";

export default function UsersSkeleton() {
    return (
        <div className="p-4 md:p-6 space-y-4">
            <Skeleton variant="text" className="h-8 w-48" />
            <Skeleton variant="card" className="h-30 my-8" />
            <Skeleton variant="card" className="h-54" />
        </div>
    );
}