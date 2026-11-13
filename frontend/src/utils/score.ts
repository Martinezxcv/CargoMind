export interface ScoreTone {
    label: string
    ring: string
    bar: string
    accent: string
    chip: string
}

const STRONG: ScoreTone = {
    label: 'Strong match',
    ring: 'stroke-emerald-500',
    bar: 'bg-emerald-500',
    accent: 'border-l-emerald-500',
    chip: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
}

const FAIR: ScoreTone = {
    label: 'Fair match',
    ring: 'stroke-amber-400',
    bar: 'bg-amber-400',
    accent: 'border-l-amber-400',
    chip: 'bg-amber-50 text-amber-700 ring-amber-200',
}

const WEAK: ScoreTone = {
    label: 'Weak match',
    ring: 'stroke-slate-400',
    bar: 'bg-slate-400',
    accent: 'border-l-slate-300',
    chip: 'bg-slate-100 text-slate-600 ring-slate-200',
}

export function scoreTone(score: number): ScoreTone {
    if (score >= 75) return STRONG
    if (score >= 50) return FAIR
    return WEAK
}