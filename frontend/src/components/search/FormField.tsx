import type { ReactNode } from 'react'

interface FormFieldProps {
    label: string
    hint?: string
    children: ReactNode
}

export default function FormField({ label, hint, children }: FormFieldProps) {
    return (
        <label className="block">
            <span className="text-sm font-medium text-slate-700">{label}</span>
            {children}
            {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
        </label>
    )
}