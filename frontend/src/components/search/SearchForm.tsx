import { useState } from 'react'
import type { SyntheticEvent } from 'react'
import {
    CONTAINER_LABELS,
    CONTAINER_TYPES,
    DEFAULT_PAYLOAD_KG,
} from '../../constants/containerTypes'
import type { CargoSearchRequest, ContainerType } from '../../types/cargo'
import type { City } from '../../types/city'
import { defaultCity } from '../../utils/cities'
import { todayIso } from '../../utils/format'
import Button from '../common/Button'
import Card from '../common/Card'
import { SearchIcon } from '../common/Icons'
import CitySelect from './CitySelect'
import { inputClass } from './fieldStyles'
import FormField from './FormField'

interface SearchFormProps {
    cities: City[]
    loading: boolean
    onSearch: (request: CargoSearchRequest) => void
}

export default function SearchForm({ cities, loading, onSearch }: SearchFormProps) {
    const [currentLocation, setCurrentLocation] = useState(() => defaultCity(cities, 'BERLIN'))
    const [homeBase, setHomeBase] = useState(() => defaultCity(cities, 'WARSZAWA'))
    const [containerType, setContainerType] = useState<ContainerType>('TRUCK_24T')
    // String state lets the user clear the field and type freely
    const [maxPayloadKg, setMaxPayloadKg] = useState(String(DEFAULT_PAYLOAD_KG.TRUCK_24T))
    const [availableFrom, setAvailableFrom] = useState(todayIso())

    // Changing the vehicle type also suggests its standard payload
    const handleContainerTypeChange = (type: ContainerType) => {
        setContainerType(type)
        setMaxPayloadKg(String(DEFAULT_PAYLOAD_KG[type]))
    }

    const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault()
        onSearch({
            currentLocation,
            homeBase,
            containerType,
            maxPayloadKg: Number(maxPayloadKg),
            availableFrom,
        })
    }

    return (
        <Card>
            <form onSubmit={handleSubmit} className="p-6">
                <h2 className="text-lg font-semibold text-slate-900">Find return cargo</h2>
                <p className="mt-1 text-sm text-slate-500">
                    Tell us where your truck is and where it needs to get back to.
                </p>

                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                            onChange={(e) => handleContainerTypeChange(e.target.value as ContainerType)}
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
                        <Button type="submit" fullWidth loading={loading} icon={<SearchIcon />}>
                            {loading ? 'Searching…' : 'Find return cargo'}
                        </Button>
                    </div>
                </div>
            </form>
        </Card>
    )
}