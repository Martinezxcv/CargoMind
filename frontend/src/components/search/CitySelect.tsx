import type { City } from '../../types/city'
import { titleCase } from '../../utils/format'
import { inputClass } from './fieldStyles'
import FormField from './FormField'

interface CitySelectProps {
    label: string
    value: string
    cities: City[]
    onChange: (value: string) => void
}

export default function CitySelect({ label, value, cities, onChange }: CitySelectProps) {
    return (
        <FormField label={label}>
            <select className={inputClass} value={value} onChange={(e) => onChange(e.target.value)}>
                {cities.map((city) => (
                    <option key={city.name} value={city.name}>
                        {titleCase(city.name)} ({city.countryCode})
                    </option>
                ))}
            </select>
        </FormField>
    )
}