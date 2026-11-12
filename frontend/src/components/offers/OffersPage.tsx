import { useState } from 'react'
import { useOffers } from '../../hooks/useOffers'
import type { City } from '../../types/city'
import type { CargoOffer, CargoOfferInput } from '../../types/offer'
import ErrorAlert from '../common/ErrorAlert'
import OfferForm from './OfferForm'
import OffersTable from './OffersTable'

interface OffersPageProps {
    cities: City[]
}

type FormMode = { kind: 'closed' } | { kind: 'create' } | { kind: 'edit'; offer: CargoOffer }

export default function OffersPage({ cities }: OffersPageProps) {
    const { offers, saving, error, create, update, remove } = useOffers()
    const [mode, setMode] = useState<FormMode>({ kind: 'closed' })

    const handleSubmit = async (input: CargoOfferInput) => {
        const ok = mode.kind === 'edit' ? await update(mode.offer.id, input) : await create(input)
        if (ok) setMode({ kind: 'closed' })
    }

    const handleDelete = async (id: number) => {
        const ok = await remove(id)
        // Do not keep editing an offer that no longer exists
        if (ok && mode.kind === 'edit' && mode.offer.id === id) setMode({ kind: 'closed' })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">My offers</h2>
                {mode.kind === 'closed' && (
                    <button
                        type="button"
                        onClick={() => setMode({ kind: 'create' })}
                        className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-white
                       transition hover:bg-emerald-600"
                    >
                        + New offer
                    </button>
                )}
            </div>

            {mode.kind !== 'closed' && (
                <OfferForm
                    // key resets the form state when switching between offers / create mode
                    key={mode.kind === 'edit' ? mode.offer.id : 'new'}
                    cities={cities}
                    initial={mode.kind === 'edit' ? mode.offer : null}
                    saving={saving}
                    onSubmit={handleSubmit}
                    onCancel={() => setMode({ kind: 'closed' })}
                />
            )}

            {error && <ErrorAlert message={error} />}

            {offers ? (
                <OffersTable
                    offers={offers}
                    busy={saving}
                    onEdit={(offer) => setMode({ kind: 'edit', offer })}
                    onDelete={handleDelete}
                />
            ) : (
                !error && <p className="text-slate-500">Loading offers…</p>
            )}
        </div>
    )
}