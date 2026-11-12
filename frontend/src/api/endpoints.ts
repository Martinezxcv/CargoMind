// Single source of truth for backend paths (relative to API_URL)
export const ENDPOINTS = {
    cities: '/cities',
    cargoSearch: '/cargo/search',
    offers: '/offers',
    offerById: (id: number) => `/offers/${id}`,
} as const