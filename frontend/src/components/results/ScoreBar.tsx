import { scoreTone } from '../../utils/score'

interface ScoreBarProps {
    label: string
    value: number
}

export default function ScoreBar({ label, value }: ScoreBarProps) {
    const width = Math.min(100, Math.max(0, value))
    return (
        <div>
            <div className="flex justify-between text-xs text-slate-500">
                <span>{label}</span>
                <span className="tabular-nums">{value.toFixed(0)}</span>
            </div>
            <div className="mt-1 h-1.5 rounded-full bg-slate-200">
                <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${scoreTone(value).bar}`}
                    style={{ width: `${width}%` }}
                />
            </div>
        </div>
    )
}