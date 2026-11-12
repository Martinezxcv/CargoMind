import type { CargoOffer, CargoOfferInput } from '../types/offer'
import { ENDPOINTS } from './endpoints'
import { http } from './httpClient'

export function fetchOffers(): Promise<CargoOffer[]> {
    return http.get<CargoOffer[]>(ENDPOINTS.offers)
}

export function createOffer(input: CargoOfferInput): Promise<CargoOffer> {
    return http.post<CargoOffer, CargoOfferInput>(ENDPOINTS.offers, input)
}

export function updateOffer(id: number, input: CargoOfferInput): Promise<CargoOffer> {
    return http.put<CargoOffer, CargoOfferInput>(ENDPOINTS.offerById(id), input)
}

export function deleteOffer(id: number): Promise<void> {
    return http.delete(ENDPOINTS.offerById(id))
}