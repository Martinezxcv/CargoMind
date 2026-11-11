import type { ContainerType } from '../types/cargo'

// Record<ContainerType, ...> forces a label for every type (compile-time check)
export const CONTAINER_LABELS: Record<ContainerType, string> = {
    VAN_3T: 'Van 3 t',
    TRUCK_12T: 'Truck 12 t',
    TRUCK_24T: 'Truck 24 t',
    REEFER_24T: 'Reefer 24 t (refrigerated)',
}

export const CONTAINER_TYPES = Object.keys(CONTAINER_LABELS) as ContainerType[]