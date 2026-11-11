import { useState } from 'react'
import type { SyntheticEvent } from 'react'
import { CONTAINER_LABELS, CONTAINER_TYPES } from '../../constants/containerTypes'
import type { CargoSearchRequest, ContainerType } from '../../types/cargo'
import type { City } from '../../types/city'
import { todayIso } from '../../utils/format'
import CitySelect from './CitySelect'
import { inputClass } from './fieldStyles'
import FormField from './FormField'

interface SearchFormProps {
    cities: City[]
    loading: boolean
    onSearch: (request: CargoSearchRequest) => void
}

// Use the preferred city if it exists, otherwise the first one in the list
function defaultCity(cities: City[], preferred: string): string {
    return cities.find((c) => c.name === preferred)?.name ?? cities[0]?.name ?? ''
}

export default function SearchForm({ cities, loading, onSearch }: SearchFormProps) {
    const [currentLocation, setCurrentLocation] = useState(() => defaultCity(cities, 'BERLIN'))
    const [homeBase, setHomeBase] = useState(() => defaultCity(cities, 'WARSZAWA'))
    const [containerType, setContainerType] = useState<ContainerType>('TRUCK_24T')
    const [maxPayloadKg, setMaxPayloadKg] = useState('24000')
    const [availableFrom, setAvailableFrom] = useState(todayIso())

    const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault()
        onSearch({ currentLocation, homeBase, containerType, maxPayloadKg: Number(maxPayloadKg), availableFrom })
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="grid gap-4 rounded-lg bg-white p-6 shadow sm:grid-cols-2 lg:grid-cols-3"
        >
            <CitySelect
                label="Current location (unloading point)"
                value={currentLocation}
                cities={cities}
                onChange={setCurrentLocation}
            />

            <CitySelect
                label="Home base (return destination)"
                value={homeBase}
                cities={cities}
                onChange={setHomeBase}
            />

            <FormField label="Vehicle type">
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

            <FormField label="Payload capacity (kg)">
                <input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    step={1}
                    required
                    className={inputClass}
                    value={maxPayloadKg}
                    onChange={(e) => setMaxPayloadKg(e.target.value)}
                />
            </FormField>

            <FormField label="Available from">
                <input
                    type="date"
                    required
                    className={inputClass}
                    value={availableFrom}
                    onChange={(e) => setAvailableFrom(e.target.value)}
                />
            </FormField>

            <div className="flex items-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white
                     transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? 'Searching…' : 'Find return cargo'}
                </button>
            </div>
        </form>
    )
}