import { ExclamationIcon } from './Icons'

interface ErrorAlertProps {
    message: string
}

export default function ErrorAlert({ message }: ErrorAlertProps) {
    return (
        <div
            role="alert"
            className="flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
        >
            <ExclamationIcon className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
            <p>{message}</p>
        </div>
    )
}