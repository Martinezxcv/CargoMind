import type { CargoOfferResult } from '../../types/cargo'
import EmptyState from '../common/EmptyState'
import { SearchIcon } from '../common/Icons'
import OfferCard from './OfferCard'

interface ResultsListProps {
    results: CargoOfferResult[]
}

export default function ResultsList({ results }: ResultsListProps) {
    if (results.length === 0) {
        return (
            <EmptyState
                icon={<SearchIcon className="h-6 w-6" />}
                title="No matching offers"
                description="Try a different vehicle type or a higher payload capacity."
            />
        )
    }

    return (
        <section className="space-y-4">
            <div className="flex items-baseline justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                    Best return cargo <span className="ml-1 text-slate-400">({results.length})</span>
                </h2>
                <p className="text-xs text-slate-500">Ranked by match score</p>
            </div>
            {results.map((offer, index) => (
                <OfferCard key={offer.id} offer={offer} rank={index + 1} />
            ))}
        </section>
    )
}