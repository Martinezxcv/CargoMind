import type { ReactNode } from 'react'

interface FormFieldProps {
    label: string
    children: ReactNode
}

export default function FormField({ label, children }: FormFieldProps) {
    return (
        <label className="text-sm font-medium text-slate-700">
            {label}
    {children}
    </label>
)
}