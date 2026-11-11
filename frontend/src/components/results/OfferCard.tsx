import { CONTAINER_LABELS } from '../../constants/containerTypes'
import type { CargoOfferResult } from '../../types/cargo'
import { formatEur, formatNumber, titleCase } from '../../utils/format'
import ScoreBadge from './ScoreBadge'
import ScoreBar from './ScoreBar'

interface OfferCardProps {
    offer: CargoOfferResult
    rank: number
}

export default function OfferCard({ offer, rank }: OfferCardProps) {
    const b = offer.scoreBreakdown
    const profitable = b.estimatedProfit >= 0

    return (
        <article className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-start gap-4">
                <ScoreBadge score={b.totalScore} />

                <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        #{rank} · {offer.companyName}
                    </p>
                    <h3 className="text-lg font-semibold text-slate-900">
                        {titleCase(offer.origin)} <span className="text-emerald-600">→</span>{' '}
                        {titleCase(offer.destination)}
                    </h3>
                    <p className="text-sm text-slate-500">
                        {CONTAINER_LABELS[offer.containerType]} · {formatNumber(offer.cargoWeightKg)} kg ·
                        pickup {offer.pickupDate}
                    </p>
                </div>

                <div className="text-right">
                    <p className={`text-lg font-bold ${profitable ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {formatEur(b.estimatedProfit)}
                    </p>
                    <p className="text-xs text-slate-400">est. profit</p>
                </div>
            </div>

            <div className="mt-4 rounded-md border-l-4 border-emerald-500 bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    AI Ghost Cargo Assistant
                </p>
                <p className="mt-1 text-sm text-slate-700">{offer.aiSummary}</p>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-4">
                <ScoreBar label="Route" value={b.routeScore} />
                <ScoreBar label="Proximity" value={b.proximityScore} />
                <ScoreBar label="Profitability" value={b.profitScore} />
                <ScoreBar label="Deadline" value={b.deadlineScore} />
            </div>

            <p className="mt-3 text-xs text-slate-400">
                {formatNumber(b.loadedKm)} km loaded · {formatNumber(b.deadheadKm)} km empty drive ·{' '}
                {formatEur(offer.pricePerKm)}/km
            </p>
        </article>
    )
}