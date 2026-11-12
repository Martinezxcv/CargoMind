import type { City } from '../types/city'

// Use the preferred city if it exists, otherwise the first one in the list
export function defaultCity(cities: City[], preferred: string): string {
    return cities.find((c) => c.name === preferred)?.name ?? cities[0]?.name ?? ''
}