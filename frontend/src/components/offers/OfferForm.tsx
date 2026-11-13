import { useState } from 'react'
import type { ReactNode, SyntheticEvent } from 'react'
import {CONTAINER_LABELS, CONTAINER_TYPES, DEFAULT_PAYLOAD_KG} from '../../constants/containerTypes'
import type { ContainerType } from '../../types/cargo'
import type { City } from '../../types/city'
import type { CargoOffer, CargoOfferInput } from '../../types/offer'
import { defaultCity } from '../../utils/cities'
import { todayIso } from '../../utils/format'
import Button from '../common/Button'
import Card from '../common/Card'
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

function FormSection({ title, children }: { title: string; children: ReactNode }) {
    return (
        <div className="p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
        </div>
    )
}

export default function OfferForm({ cities, initial, saving, onSubmit, onCancel }: OfferFormProps) {
    const [origin, setOrigin] = useState(() => initial?.origin ?? defaultCity(cities, 'BERLIN'))
    const [destination, setDestination] = useState(
        () => initial?.destination ?? defaultCity(cities, 'WARSZAWA'),
    )
    const [containerType, setContainerType] = useState<ContainerType>(
        initial?.containerType ?? 'TRUCK_24T',
    )
    const maxWeightForVehicle = DEFAULT_PAYLOAD_KG[containerType]
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
        <Card className="overflow-hidden">
            <form onSubmit={handleSubmit} className="divide-y divide-slate-100">
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-slate-900">
                        {initial ? `Edit offer #${initial.id}` : 'New offer'}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        {initial
                            ? 'Update the details below and save your changes.'
                            : 'Publish a cargo that carriers can pick up on their way back.'}
                    </p>
                </div>

                <FormSection title="Route">
                    <CitySelect
                        label="Pickup city (origin)"
                        value={origin}
                        cities={cities}
                        onChange={setOrigin}
                    />
                    <CitySelect
                        label="Delivery city (destination)"
                        value={destination}
                        cities={cities}
                        onChange={setDestination}
                    />
                </FormSection>

                <FormSection title="Cargo">
                    <FormField label="Required vehicle type">
                        <select
                            className={inputClass}
                            value={containerType}
                            onChange={(e) => {
                                const newType = e.target.value as ContainerType
                                setContainerType(newType)

                                const newMax = DEFAULT_PAYLOAD_KG[newType]
                                if (Number(cargoWeightKg) > newMax) {
                                    setCargoWeightKg(newMax.toString())
                                }
                            }}
                        >
                            {CONTAINER_TYPES.map((type) => (
                                <option key={type} value={type}>
                                    {CONTAINER_LABELS[type]}
                                </option>
                            ))}
                        </select>
                    </FormField>

                    <FormField
                        label="Cargo weight (kg)"
                        hint={`Between 1 and ${maxWeightForVehicle.toLocaleString()} kg for selected vehicle`}
                    >
                        <input
                            type="number"
                            inputMode="numeric"
                            min={1}
                            max={maxWeightForVehicle}
                            step={1}
                            required
                            className={inputClass}
                            value={cargoWeightKg}
                            onChange={(e) => setCargoWeightKg(e.target.value)}
                        />
                    </FormField>

                    <FormField label="Rate (EUR per km)" hint="Up to 2 decimal places">
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
                </FormSection>

                <FormSection title="Schedule and company">
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
                </FormSection>

                <div className="flex flex-wrap items-center justify-end gap-3 bg-slate-50 px-6 py-4">
                    {localError && (
                        <p role="alert" className="mr-auto text-sm font-medium text-rose-600">
                            {localError}
                        </p>
                    )}
                    <Button variant="secondary" onClick={onCancel} disabled={saving}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={saving}>
                        {saving ? 'Saving…' : initial ? 'Save changes' : 'Create offer'}
                    </Button>
                </div>
            </form>
        </Card>
    )
}