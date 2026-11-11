interface ErrorAlertProps {
    message: string
}

export default function ErrorAlert({ message }: ErrorAlertProps) {
    return (
        <div
            role="alert"
            className="rounded-md border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
        >
            {message}
        </div>
    )
}