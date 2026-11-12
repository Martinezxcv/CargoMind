import type { ContainerType } from './cargo'

export interface CargoOffer {
    id: number
    origin: string
    destination: string
    containerType: ContainerType
    cargoWeightKg: number
    pricePerKm: number
    companyName: string
    pickupDate: string // ISO date: YYYY-MM-DD
}

// Payload for create/update (the server assigns the id)
export type CargoOfferInput = Omit<CargoOffer, 'id'>