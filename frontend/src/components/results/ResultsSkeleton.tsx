import Card from '../common/Card'

interface ResultsSkeletonProps {
    count?: number
}

// Placeholder cards shown while the backend scores offers and asks Gemini for summaries
export default function ResultsSkeleton({ count = 3 }: ResultsSkeletonProps) {
    return (
        <div className="space-y-4" role="status" aria-label="Searching for cargo">
            {Array.from({ length: count }, (_, i) => (
                <Card key={i} className="animate-pulse p-6">
                    <div className="flex gap-4">
                        <div className="h-18 w-18 rounded-full bg-slate-200" />
                        <div className="flex-1 space-y-3">
                            <div className="h-3 w-1/3 rounded bg-slate-200" />
                            <div className="h-5 w-1/2 rounded bg-slate-200" />
                            <div className="h-3 w-2/3 rounded bg-slate-200" />
                        </div>
                    </div>
                    <div className="mt-4 h-16 rounded-lg bg-slate-100" />
                </Card>
            ))}
            <span className="sr-only">Loading…</span>
        </div>
    )
}