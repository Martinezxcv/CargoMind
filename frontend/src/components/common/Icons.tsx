interface IconProps {
    className?: string
}

const DEFAULT = 'h-4 w-4'

export function PencilIcon({ className = DEFAULT }: IconProps) {
    return (
        <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
    )
}

export function TrashIcon({ className = DEFAULT }: IconProps) {
    return (
        <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
            <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
            />
        </svg>
    )
}

export function PlusIcon({ className = DEFAULT }: IconProps) {
    return (
        <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
            <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
            />
        </svg>
    )
}

export function SearchIcon({ className = DEFAULT }: IconProps) {
    return (
        <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
            <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
            />
        </svg>
    )
}

export function ExclamationIcon({ className = DEFAULT }: IconProps) {
    return (
        <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
            <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
            />
        </svg>
    )
}

export function SparklesIcon({ className = DEFAULT }: IconProps) {
    return (
        <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
            <path
                fillRule="evenodd"
                d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
                clipRule="evenodd"
            />
        </svg>
    )
}

export function TruckIcon({ className = DEFAULT }: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <path d="M3 7h11v9H3z" />
            <path d="M14 10h4l3 3v3h-7z" />
            <circle cx="7.5" cy="17.5" r="1.8" />
            <circle cx="17.5" cy="17.5" r="1.8" />
        </svg>
    )
}