export type ContainerType = 'VAN_3T' | 'TRUCK_12T' | 'TRUCK_24T' | 'REEFER_24T'

export interface CargoSearchRequest {
    currentLocation: string
    homeBase: string
    containerType: ContainerType
    maxPayloadKg: number // vehicle capacity, used for the hard "fits the vehicle" check
    availableFrom: string // ISO date: YYYY-MM-DD
}

export interface ScoreBreakdown {
    totalScore: number
    routeScore: number
    proximityScore: number
    profitScore: number
    vehicleScore: number
    deadlineScore: number
    estimatedProfit: number // EUR
    deadheadKm: number
    loadedKm: number
}

export interface CargoOfferResult {
    id: number
    origin: string
    destination: string
    containerType: ContainerType
    cargoWeightKg: number
    pricePerKm: number
    companyName: string
    pickupDate: string // ISO date
    scoreBreakdown: ScoreBreakdown
    aiSummary: string
}