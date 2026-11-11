import type { CargoOfferResult } from '../../types/cargo'
import OfferCard from './OfferCard'

interface ResultsListProps {
    results: CargoOfferResult[]
}

export default function ResultsList({ results }: ResultsListProps) {
    if (results.length === 0) {
        return (
            <p className="rounded-md bg-white p-6 text-center text-slate-500 shadow">
                No matching offers for this vehicle and date.
            </p>
        )
    }

    return (
        <section className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">
                Best return cargo ({results.length})
            </h2>
            {results.map((offer, index) => (
                <OfferCard key={offer.id} offer={offer} rank={index + 1} />
            ))}
        </section>
    )
}