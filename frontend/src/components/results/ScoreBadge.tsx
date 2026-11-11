interface ScoreBadgeProps {
    score: number // 0-100
}

// Emerald = great match, amber = acceptable, slate = weak
function tone(score: number): string {
    if (score >= 75) return 'bg-emerald-500 text-white'
    if (score >= 50) return 'bg-amber-400 text-slate-900'
    return 'bg-slate-300 text-slate-700'
}

export default function ScoreBadge({ score }: ScoreBadgeProps) {
    return (
        <div
            className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-full ${tone(score)}`}
            aria-label={`${score.toFixed(0)} percent match`}
        >
            <span className="text-xl font-bold leading-none">{score.toFixed(0)}%</span>
            <span className="mt-0.5 text-[10px] uppercase tracking-wide opacity-80">match</span>
        </div>
    )
}