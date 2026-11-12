import { useState } from 'react'
import { CONTAINER_LABELS } from '../../constants/containerTypes'
import type { CargoOffer } from '../../types/offer'
import { formatEur, formatNumber, titleCase } from '../../utils/format'

interface OffersTableProps {
    offers: CargoOffer[]
    busy: boolean
    onEdit: (offer: CargoOffer) => void
    onDelete: (id: number) => void
}

export default function OffersTable({ offers, busy, onEdit, onDelete }: OffersTableProps) {
    // Id of the row waiting for delete confirmation
    const [confirmId, setConfirmId] = useState<number | null>(null)

    if (offers.length === 0) {
        return (
            <p className="rounded-md bg-white p-6 text-center text-slate-500 shadow">
                No offers yet. Create the first one.
            </p>
        )
    }

    return (
        <div className="overflow-x-auto rounded-lg bg-white shadow">
            <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                    <th className="px-4 py-3">Route</th>
                    <th className="px-4 py-3">Vehicle</th>
                    <th className="px-4 py-3">Weight</th>
                    <th className="px-4 py-3">Rate</th>
                    <th className="px-4 py-3">Company</th>
                    <th className="px-4 py-3">Pickup</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                {offers.map((offer) => (
                    <tr key={offer.id}>
                        <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                            {titleCase(offer.origin)} <span className="text-emerald-600">→</span>{' '}
                            {titleCase(offer.destination)}
                        </td>
                        <td className="px-4 py-3">{CONTAINER_LABELS[offer.containerType]}</td>
                        <td className="px-4 py-3">{formatNumber(offer.cargoWeightKg)} kg</td>
                        <td className="px-4 py-3">{formatEur(offer.pricePerKm)}/km</td>
                        <td className="px-4 py-3">{offer.companyName}</td>
                        <td className="whitespace-nowrap px-4 py-3">{offer.pickupDate}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-right">
                            {confirmId === offer.id ? (
                                <span className="inline-flex gap-2">
                    <button
                        type="button"
                        disabled={busy}
                        onClick={() => {
                            setConfirmId(null)
                            onDelete(offer.id)
                        }}
                        className="font-semibold text-rose-600 hover:text-rose-800 disabled:opacity-50"
                    >
                      Confirm delete
                    </button>
                    <button
                        type="button"
                        onClick={() => setConfirmId(null)}
                        className="text-slate-500 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                  </span>
                            ) : (
                                <span className="inline-flex gap-3">
                    <button
                        type="button"
                        disabled={busy}
                        onClick={() => onEdit(offer)}
                        className="font-medium text-slate-700 hover:text-emerald-600 disabled:opacity-50"
                    >
                      Edit
                    </button>
                    <button
                        type="button"
                        disabled={busy}
                        onClick={() => setConfirmId(offer.id)}
                        className="font-medium text-slate-700 hover:text-rose-600 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </span>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}