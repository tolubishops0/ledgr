import { Skeleton } from '@ledgr/ui'
import React from 'react'

function Loading() {
    return (
        <div className="p-4 md:p-6 space-y-4">
            <Skeleton variant="text" className="h-8 w-40" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {[0, 1, 2, 3].map((i) => (
                    <Skeleton key={i} variant="card" className="h-64" />
                ))}
            </div>
        </div>
    )
}

export default Loading