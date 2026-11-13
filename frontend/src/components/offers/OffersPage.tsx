import { useState } from 'react'
import { useOffers } from '../../hooks/useOffers'
import type { City } from '../../types/city'
import type { CargoOffer, CargoOfferInput } from '../../types/offer'
import Button from '../common/Button'
import ErrorAlert from '../common/ErrorAlert'
import { PlusIcon } from '../common/Icons'
import Spinner from '../common/Spinner'
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
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                        My offers
                        {offers && (
                            <span className="ml-2 text-sm font-normal text-slate-400">({offers.length})</span>
                        )}
                    </h2>
                    <p className="text-sm text-slate-500">Cargo offers that carriers can find and score.</p>
                </div>
                {mode.kind === 'closed' && (
                    <Button icon={<PlusIcon />} onClick={() => setMode({ kind: 'create' })}>
                        New offer
                    </Button>
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
                !error && (
                    <div className="flex items-center gap-2 text-slate-500">
                        <Spinner /> Loading offers…
                    </div>
                )
            )}
        </div>
    )
}