import { scoreTone } from '../../utils/score'

interface ScoreBadgeProps {
    score: number
}

const SIZE = 72
const STROKE = 7
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function ScoreBadge({ score }: ScoreBadgeProps) {
    const pct = Math.min(100, Math.max(0, score))
    const tone = scoreTone(score)

    return (
        <div
            className="relative h-18 w-18 shrink-0"
            role="img"
            aria-label={`${score.toFixed(0)} percent match`}
        >
            <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-full w-full -rotate-90">
                <circle
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={RADIUS}
                    fill="none"
                    strokeWidth={STROKE}
                    className="stroke-slate-200"
                />
                <circle
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={RADIUS}
                    fill="none"
                    strokeWidth={STROKE}
                    strokeLinecap="round"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={CIRCUMFERENCE * (1 - pct / 100)}
                    className={`${tone.ring} transition-all duration-500`}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold leading-none text-slate-900">{score.toFixed(0)}%</span>
                <span className="mt-0.5 text-[9px] uppercase tracking-wide text-slate-400">match</span>
            </div>
        </div>
    )
}