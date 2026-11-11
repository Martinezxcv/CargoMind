import type { City } from '../types/city'
import { ENDPOINTS } from './endpoints'
import { http } from './httpClient'

export function fetchCities(): Promise<City[]> {
    return http.get<City[]>(ENDPOINTS.cities)
}