import { CONTAINER_LABELS } from '../../constants/containerTypes'
import type { CargoOfferResult } from '../../types/cargo'
import { formatEur, formatNumber, titleCase } from '../../utils/format'
import { scoreTone } from '../../utils/score'
import Card from '../common/Card'
import { SparklesIcon } from '../common/Icons'
import ScoreBadge from './ScoreBadge'
import ScoreBar from './ScoreBar'

interface OfferCardProps {
    offer: CargoOfferResult
    rank: number
}

interface StatProps {
    label: string
    value: string
    valueClass?: string
}

function Stat({ label, value, valueClass = 'text-slate-900' }: StatProps) {
    return (
        <div className="rounded-lg bg-slate-50 px-3 py-2.5">
            <p className="text-xs text-slate-500">{label}</p>
            <p className={`mt-0.5 text-base font-semibold tabular-nums ${valueClass}`}>{value}</p>
        </div>
    )
}

export default function OfferCard({ offer, rank }: OfferCardProps) {
    const b = offer.scoreBreakdown
    const tone = scoreTone(b.totalScore)
    const profitable = b.estimatedProfit >= 0

    return (
        <Card className={`overflow-hidden border-l-4 ${tone.accent}`}>
            <article className="p-6">
                <div className="flex items-start gap-4">
                    <ScoreBadge score={b.totalScore} />

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                #{rank} · {offer.companyName}
              </span>
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${tone.chip}`}>
                {tone.label}
              </span>
                        </div>

                        <h3 className="mt-1 text-xl font-semibold text-slate-900">
                            {titleCase(offer.origin)} <span className="text-emerald-600">→</span>{' '}
                            {titleCase(offer.destination)}
                        </h3>

                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
              <span className="rounded-md bg-slate-100 px-2 py-1">
                {CONTAINER_LABELS[offer.containerType]}
              </span>
                            <span className="rounded-md bg-slate-100 px-2 py-1">
                {formatNumber(offer.cargoWeightKg)} kg
              </span>
                            <span className="rounded-md bg-slate-100 px-2 py-1">Pickup {offer.pickupDate}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <Stat
                        label="Est. profit"
                        value={formatEur(b.estimatedProfit)}
                        valueClass={profitable ? 'text-emerald-600' : 'text-rose-600'}
                    />
                    <Stat label="Loaded distance" value={`${formatNumber(b.loadedKm)} km`} />
                    <Stat label="Empty drive" value={`${formatNumber(b.deadheadKm)} km`} />
                    <Stat label="Rate" value={`${formatEur(offer.pricePerKm)}/km`} />
                </div>

                <div className="mt-4 flex gap-3 rounded-lg border border-emerald-100 bg-emerald-50/60 p-4">
                    <SparklesIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                            AI Ghost Cargo Assistant
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-slate-700">{offer.aiSummary}</p>
                    </div>
                </div>

                <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Score breakdown
                </p>
                <div className="mt-2 grid gap-3 sm:grid-cols-4">
                    <ScoreBar label="Route" value={b.routeScore} />
                    <ScoreBar label="Proximity" value={b.proximityScore} />
                    <ScoreBar label="Profitability" value={b.profitScore} />
                    <ScoreBar label="Deadline" value={b.deadlineScore} />
                </div>
            </article>
        </Card>
    )
}