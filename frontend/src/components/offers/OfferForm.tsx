import { useState } from 'react'
import type { SyntheticEvent } from 'react'
import { CONTAINER_LABELS, CONTAINER_TYPES } from '../../constants/containerTypes'
import type { ContainerType } from '../../types/cargo'
import type { City } from '../../types/city'
import type { CargoOffer, CargoOfferInput } from '../../types/offer'
import { defaultCity } from '../../utils/cities'
import { todayIso } from '../../utils/format'
import CitySelect from '../search/CitySelect'
import { inputClass } from '../search/fieldStyles'
import FormField from '../search/FormField'

interface OfferFormProps {
    cities: City[]
    initial: CargoOffer | null // null = create mode
    saving: boolean
    onSubmit: (input: CargoOfferInput) => void
    onCancel: () => void
}

export default function OfferForm({ cities, initial, saving, onSubmit, onCancel }: OfferFormProps) {
    const [origin, setOrigin] = useState(() => initial?.origin ?? defaultCity(cities, 'BERLIN'))
    const [destination, setDestination] = useState(
        () => initial?.destination ?? defaultCity(cities, 'WARSZAWA'),
    )
    const [containerType, setContainerType] = useState<ContainerType>(
        initial?.containerType ?? 'TRUCK_24T',
    )
    // Numeric fields are strings so the user can clear them and type freely
    const [cargoWeightKg, setCargoWeightKg] = useState(initial ? String(initial.cargoWeightKg) : '')
    const [pricePerKm, setPricePerKm] = useState(initial ? initial.pricePerKm.toFixed(2) : '')
    const [companyName, setCompanyName] = useState(initial?.companyName ?? '')
    const [pickupDate, setPickupDate] = useState(initial?.pickupDate ?? todayIso())
    const [localError, setLocalError] = useState<string | null>(null)

    const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (origin === destination) {
            setLocalError('Origin and destination must be different cities')
            return
        }
        setLocalError(null)
        onSubmit({
            origin,
            destination,
            containerType,
            cargoWeightKg: Number(cargoWeightKg),
            pricePerKm: Number(pricePerKm),
            companyName: companyName.trim(),
            pickupDate,
        })
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="grid gap-4 rounded-lg bg-white p-6 shadow sm:grid-cols-2 lg:grid-cols-3"
        >
            <h2 className="text-lg font-semibold text-slate-900 sm:col-span-2 lg:col-span-3">
                {initial ? `Edit offer #${initial.id}` : 'New offer'}
            </h2>

            <CitySelect label="Pickup city (origin)" value={origin} cities={cities} onChange={setOrigin} />
            <CitySelect
                label="Delivery city (destination)"
                value={destination}
                cities={cities}
                onChange={setDestination}
            />

            <FormField label="Required vehicle type">
                <select
                    className={inputClass}
                    value={containerType}
                    onChange={(e) => setContainerType(e.target.value as ContainerType)}
                >
                    {CONTAINER_TYPES.map((type) => (
                        <option key={type} value={type}>
                            {CONTAINER_LABELS[type]}
                        </option>
                    ))}
                </select>
            </FormField>

            <FormField label="Cargo weight (kg)">
                <input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={100000}
                    step={1}
                    required
                    className={inputClass}
                    value={cargoWeightKg}
                    onChange={(e) => setCargoWeightKg(e.target.value)}
                />
            </FormField>

            <FormField label="Rate (EUR per km)">
                <input
                    type="number"
                    inputMode="decimal"
                    min={0.01}
                    max={999.99}
                    step={0.01}
                    required
                    className={inputClass}
                    value={pricePerKm}
                    onChange={(e) => setPricePerKm(e.target.value)}
                />
            </FormField>

            <FormField label="Pickup date">
                <input
                    type="date"
                    required
                    min={todayIso()}
                    className={inputClass}
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                />
            </FormField>

            <FormField label="Company name">
                <input
                    type="text"
                    required
                    maxLength={100}
                    className={inputClass}
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                />
            </FormField>

            {localError && (
                <p role="alert" className="text-sm text-rose-600 sm:col-span-2 lg:col-span-3">
                    {localError}
                </p>
            )}

            <div className="flex gap-3 sm:col-span-2 lg:col-span-3">
                <button
                    type="submit"
                    disabled={saving}
                    className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white
                     transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {saving ? 'Saving…' : initial ? 'Save changes' : 'Create offer'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={saving}
                    className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700
                     transition hover:bg-slate-50 disabled:opacity-60"
                >
                    Cancel
                </button>
            </div>
        </form>
    )
}