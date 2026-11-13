import type { ReactNode } from 'react'

interface EmptyStateProps {
    title: string
    description?: string
    icon?: ReactNode
    action?: ReactNode
}

export default function EmptyState({ title, description, icon, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center rounded-xl border-2 border-dashed border-slate-300 bg-white/60 px-6 py-12 text-center">
            {icon && (
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    {icon}
                </div>
            )}
            <p className="font-medium text-slate-800">{title}</p>
            {description && <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>}
            {action && <div className="mt-4">{action}</div>}
        </div>
    )
}