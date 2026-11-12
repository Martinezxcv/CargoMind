import type { ContainerType } from '../types/cargo'

// Record<ContainerType, ...> forces a label for every type (compile-time check)
export const CONTAINER_LABELS: Record<ContainerType, string> = {
    VAN_3T: 'Van 3 t',
    TRUCK_12T: 'Truck 12 t',
    TRUCK_24T: 'Truck 24 t',
    REEFER_24T: 'Reefer 24 t (refrigerated)',
}

// Default payload (kg) suggested when a vehicle type is selected; the user can still override it
export const DEFAULT_PAYLOAD_KG: Record<ContainerType, number> = {
    VAN_3T: 3000,
    TRUCK_12T: 12000,
    TRUCK_24T: 24000,
    REEFER_24T: 24000,
}

export const CONTAINER_TYPES = Object.keys(CONTAINER_LABELS) as ContainerType[]