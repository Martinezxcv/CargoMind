import type { ButtonHTMLAttributes, ReactNode } from 'react'
import Spinner from './Spinner'

type Variant = 'primary' | 'dark' | 'secondary' | 'danger'
type Size = 'sm' | 'md'

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
    variant?: Variant
    size?: Size
    icon?: ReactNode
    loading?: boolean
    fullWidth?: boolean
}

const BASE =
    'inline-flex items-center justify-center gap-2 rounded-lg font-semibold shadow-sm transition ' +
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
    'disabled:cursor-not-allowed disabled:opacity-60'

const VARIANTS: Record<Variant, string> = {
    primary: 'bg-emerald-500 text-white hover:bg-emerald-600 focus-visible:ring-emerald-500',
    dark: 'bg-slate-800 text-white hover:bg-slate-900 focus-visible:ring-slate-700',
    secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300 focus-visible:ring-slate-400',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500',
}

const SIZES: Record<Size, string> = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  fullWidth = false,
  type = 'button',
  disabled,
  children,
  ...rest
  }: ButtonProps) {
    return (
        <button
            type={type}
            disabled={disabled || loading}
            className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${fullWidth ? 'w-full' : ''}`}
            {...rest}
        >
            {loading ? <Spinner /> : icon}
            {children}
        </button>
    )
}