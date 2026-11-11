import type { CargoOfferResult, CargoSearchRequest } from '../types/cargo'
import { ENDPOINTS } from './endpoints'
import { http } from './httpClient'

export function searchCargo(request: CargoSearchRequest): Promise<CargoOfferResult[]> {
    return http.post<CargoOfferResult[], CargoSearchRequest>(ENDPOINTS.cargoSearch, request)
}