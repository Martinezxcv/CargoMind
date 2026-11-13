import { useState } from 'react'
import { CONTAINER_LABELS } from '../../constants/containerTypes'
import type { ContainerType } from '../../types/cargo'
import type { CargoOffer } from '../../types/offer'
import { formatEur, formatNumber, titleCase, todayIso } from '../../utils/format'
import Button from '../common/Button'
import Card from '../common/Card'
import EmptyState from '../common/EmptyState'
import { PencilIcon, TrashIcon, TruckIcon } from '../common/Icons'

interface OffersTableProps {
    offers: CargoOffer[]
    busy: boolean
    onEdit: (offer: CargoOffer) => void
    onDelete: (id: number) => void
}

const VEHICLE_TONE: Record<ContainerType, string> = {
    VAN_3T: 'bg-slate-100 text-slate-700 ring-slate-200',
    TRUCK_12T: 'bg-slate-100 text-slate-700 ring-slate-200',
    TRUCK_24T: 'bg-slate-100 text-slate-700 ring-slate-200',
    REEFER_24T: 'bg-sky-50 text-sky-700 ring-sky-200',
}

const TH = 'px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500'

function PickupDate({ date }: { date: string }) {
    const today = todayIso()
    // ISO dates (YYYY-MM-DD) compare correctly as plain strings
    if (date === today) {
        return (
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
        Today
      </span>
        )
    }
    if (date < today) {
        return (
            <span className="inline-flex items-center gap-1.5">
        <span className="text-slate-500 line-through">{date}</span>
        <span className="rounded-full bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700 ring-1 ring-rose-200">
          Expired
        </span>
      </span>
        )
    }
    return <span className="text-slate-700">{date}</span>
}

export default function OffersTable({ offers, busy, onEdit, onDelete }: OffersTableProps) {

    const [confirmId, setConfirmId] = useState<number | null>(null)

    if (offers.length === 0) {
        return (
            <EmptyState
                icon={<TruckIcon className="h-6 w-6" />}
                title="No offers yet"
                description="Create the first one with “New offer”."
            />
        )
    }

    return (
        <Card className="overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                        <th className={TH}>Route</th>
                        <th className={TH}>Vehicle</th>
                        <th className={`${TH} text-right`}>Weight</th>
                        <th className={`${TH} text-right`}>Rate</th>
                        <th className={TH}>Company</th>
                        <th className={TH}>Pickup</th>
                        <th className={`${TH} text-right`}>Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {offers.map((offer) => {
                        const confirming = confirmId === offer.id
                        return (
                            <tr
                                key={offer.id}
                                className={`transition-colors ${confirming ? 'bg-rose-50/60' : 'hover:bg-slate-50'}`}
                            >
                                <td className="whitespace-nowrap px-4 py-3">
                                    <div className="font-semibold text-slate-900">
                                        {titleCase(offer.origin)} <span className="text-emerald-600">→</span>{' '}
                                        {titleCase(offer.destination)}
                                    </div>
                                    <div className="text-xs text-slate-400">#{offer.id}</div>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3">
                    <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${VEHICLE_TONE[offer.containerType]}`}
                    >
                      {CONTAINER_LABELS[offer.containerType]}
                    </span>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-slate-700">
                                    {formatNumber(offer.cargoWeightKg)} kg
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-right font-semibold tabular-nums text-slate-900">
                                    {formatEur(offer.pricePerKm)}
                                    <span className="font-normal text-slate-400">/km</span>
                                </td>
                                <td className="px-4 py-3 text-slate-700">{offer.companyName}</td>
                                <td className="whitespace-nowrap px-4 py-3">
                                    <PickupDate date={offer.pickupDate} />
                                </td>
                                <td className="whitespace-nowrap px-4 py-3">
                                    <div className="flex justify-end gap-2">
                                        {confirming ? (
                                            <>
                                                <Button
                                                    size="sm"
                                                    variant="danger"
                                                    disabled={busy}
                                                    onClick={() => {
                                                        setConfirmId(null)
                                                        onDelete(offer.id)
                                                    }}
                                                >
                                                    Confirm delete
                                                </Button>
                                                <Button size="sm" variant="secondary" onClick={() => setConfirmId(null)}>
                                                    Cancel
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    size="sm"
                                                    variant="dark"
                                                    icon={<PencilIcon className="h-3.5 w-3.5" />}
                                                    disabled={busy}
                                                    onClick={() => onEdit(offer)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="danger"
                                                    icon={<TrashIcon className="h-3.5 w-3.5" />}
                                                    disabled={busy}
                                                    onClick={() => setConfirmId(offer.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        </Card>
    )
}